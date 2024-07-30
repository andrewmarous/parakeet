"use client";

import { MultipleChoiceQuestion, NumberQuestion, Question } from "@/types";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm, UseFormReturn } from "react-hook-form";
import { FaCheck, FaX } from "react-icons/fa6";
import { z } from "zod";
import ShowWorkDialog from "../../Dialogs/ShowWorkDialog/ShowWorkDialog";
import { Button } from "../../Inputs/Button/Button";
import { Label } from "../../Inputs/Label/Label";
import RadioGroup, { RadioGroupItem } from "../../Inputs/RadioGroup/RadioGroup";
import { TextInput } from "../../Inputs/TextInput/TextInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  useFormField,
} from "../Base/Form/Form";
import { addStudentScore } from "./actions";

const questionOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
});

const multipleChoiceQuestionSchema = z.object({
  type: z.literal("multiple-choice"),
  question: z.string(),
  topic: z.string(),
  options: z.array(questionOptionSchema),
  answer: z.string(),
  explanation: z.string(),
});

const numberQuestionSchema = z.object({
  type: z.literal("number"),
  topic: z.string(),
  question: z.string(),
  answer: z.number(),
  explanation: z.string(),
});

const questionsSchema = z.array(
  z.union([multipleChoiceQuestionSchema, numberQuestionSchema])
);

// Overall form schema
const formSchema = z.object({
  questions: questionsSchema,
});

type SchemaT = z.infer<typeof formSchema>;

function MultipleChoice<T extends FieldValues>({
  form,
  question,
  name,
}: {
  form: UseFormReturn<T>;
  question: MultipleChoiceQuestion;
  name: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field }) => (
        <div className="flex flex-row gap-4">
          <div>
            <CorrectIncorrectIcon<T> form={form} />
          </div>
          <FormItem className="space-y-3 flex-grow">
            <Label>{question.question}</Label>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                {question.options.map((option, idx) => (
                  <FormItem
                    className="flex items-center space-x-3 space-y-0"
                    key={idx}
                  >
                    <FormControl>
                      <RadioGroupItem value={option.id} />
                    </FormControl>
                    <Label className="font-normal">{option.text}</Label>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            {form.formState.isSubmitted && (
              <ShowWorkDialog
                explanation={question.explanation}
                correctAnswer={
                  question.options.find((o) => o.id === question.answer)?.text!
                }
              />
            )}
          </FormItem>
        </div>
      )}
    />
  );
}

function CorrectIncorrectIcon<T extends FieldValues>({
  form,
}: {
  form: UseFormReturn<T>;
}) {
  const { error, isDirty } = useFormField();
  const isValid = isDirty && !error && form.formState.isSubmitted;

  return error ? (
    <div className="flex flex-col justify-center items-center w-fit h-fit p-2 rounded-lg bg-gradient-to-br from-red-400 to-red-500 flex-grow inset-shadow-transparent-sm border border-red-300">
      <FaX className="w-2 h-2 stroke-2 stroke-white fill-white" />
    </div>
  ) : isValid ? (
    <div className="flex flex-col justify-center items-center w-fit h-fit p-2 rounded-lg bg-gradient-to-br from-green-400 to-green-500 flex-grow inset-shadow-transparent-sm border border-green-300">
      <FaCheck className="w-2 h-2 stroke-2 stroke-white fill-white" />
    </div>
  ) : (
    <></>
  );
}

function NumberAnswer<T extends FieldValues>({
  form,
  question,
  name,
}: {
  form: UseFormReturn<T>;
  question: NumberQuestion;
  name: string;
}) {
  const [value, setValue] = useState<string>("");

  return (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field }) => (
        <div className="flex flex-row gap-4">
          <div>
            <CorrectIncorrectIcon<T> form={form} />
          </div>
          <FormItem className="space-y-3 flex-grow">
            <Label className="leading-5">{question.question}</Label>
            <FormControl>
              <TextInput
                type="number"
                {...field}
                className="w-48"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  field.onChange(e);
                }}
              />
            </FormControl>
            {form.formState.isSubmitted && (
              <ShowWorkDialog
                explanation={question.explanation}
                correctAnswer={question.answer.toString()}
              />
            )}
          </FormItem>
        </div>
      )}
    />
  );
}

export default function ExamForm({
  questions,
  setScore,
}: {
  setScore: (num: number) => void;
  questions: Question[];
}) {
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];
  const examId = pathname?.split("/")[6];
  const [loading, setLoading] = useState(false);
  const form = useForm<SchemaT>({});
  const answers = questions.map((question) => question.answer);

  const submit = async (data: SchemaT) => {
    let errors = 0;
    let incorrectQuestions: Question[] = [];

    for (let i = 0; i < questions.length; i++) {
      if (data.questions[i].answer !== String(answers[i])) {
        errors++;
        incorrectQuestions.push(questions[i]);
        await form.setError(`questions.${i}.answer`, {
          message: "Wrong answer. Please try again.",
        });
      }
    }

    const studentResponse = data.questions.map((question: Question, idx) => {
      const responded = data.questions[idx].answer.toString();
      const correctAnswer = answers[idx].toString();
      return {
        isCorrect: responded === correctAnswer,
        responded,
        topic: question.topic,
        correctAnswer,
      };
    });

    const testScore =
      questions.length === errors
        ? 0
        : Math.round(((questions.length - errors) / questions.length) * 100);

    const _ = addStudentScore(examId, studentResponse, testScore);

    setScore(testScore);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="flex flex-col gap-8"
      >
        {questions.map((question, idx) => {
          if (question.type === "multiple-choice") {
            const questionName = `questions.${idx}.answer`;
            return (
              <MultipleChoice<SchemaT>
                form={form}
                question={question}
                name={questionName}
                key={idx}
              />
            );
          } else if (question.type === "number") {
            const questionName = `questions.${idx}.answer`;
            return (
              <NumberAnswer<SchemaT>
                form={form}
                question={question}
                name={questionName}
                key={idx}
              />
            );
          }
        })}
        <div className="flex flex-row form-actions w-full gap-4 justify-end">
          {/* <Button variant="secondary" ref={dialogCloseRef}>
              Save Answers
            </Button> */}
          <Button variant="secondary" type="submit" loading={loading}>
            Check answers <FaCheck />
          </Button>
        </div>
      </form>
    </Form>
  );
}
