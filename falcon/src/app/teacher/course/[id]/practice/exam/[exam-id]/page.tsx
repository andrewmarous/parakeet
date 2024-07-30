"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/Breadcrumb/Breadcrumb";
import ChatContent from "@/app/components/ChatContent/ChatContent";
import IconBubble from "@/app/components/IconBubble/IconBubble";
import { Button } from "@/app/components/Inputs/Button/Button";
import { Label } from "@/app/components/Inputs/Label/Label";
import { TextArea } from "@/app/components/Inputs/TextArea/TextArea";
import { TextInput } from "@/app/components/Inputs/TextInput/TextInput";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/Tooltip/Tooltip";
import { cn } from "@/app/utils";
import { SelectExam } from "@/db/schema/exams.schema";
import {
  MultipleChoiceQuestion as MultipleChoiceQuestionT,
  NumberQuestion as NumberQuestionT,
} from "@/types";
import { Check } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaPencil } from "react-icons/fa6";
import { TbEdit } from "react-icons/tb";
import { Oval } from "react-loader-spinner";
import { getExam } from "./actions";
import useExamPageUpdateState from "./exam.store";

function MultipleChoiceQuestion({
  question,
  idx,
}: {
  question: MultipleChoiceQuestionT;
  idx: number;
}) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [editting, setEditting] = useState(false);
  const { setUpdateQuestions } = useExamPageUpdateState();

  return (
    <div>
      <div className="flex flex-row gap-4 items-top">
        <Label className="leading-5">{question.question}</Label>
        {editting ? (
          <Button
            variant="link"
            onClick={() => {
              setEditting(false);
              setShowExplanation(false);
            }}
            className="p-0 h-fit hover:no-underline text-blue-500"
          >
            Finish editting
          </Button>
        ) : (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="link"
                  onClick={() => {
                    setEditting(true);
                    setShowExplanation(true);
                  }}
                  className="p-0 h-fit"
                >
                  <TbEdit className="w-4 h-4 stroke-grey-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit this question.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <ul className="flex flex-col space-y-1 gap-1 mt-2">
        {question.options.map((option, idx) => (
          <li key={idx} className="flex flex-row items-center gap-2">
            <div
              className={cn(
                "h-4 w-4  inset-shadow-transparent-sm rounded-md border",
                option.id === question.answer
                  ? "bg-gradient-to-br from-green-300 to-green-400 border-green-300"
                  : "bg-gradient-to-br from-grey-200 to-grey-300  border-grey-300 "
              )}
            ></div>
            {editting ? (
              <div className="w-full flex flex-row gap-4 items-center">
                <TextInput
                  type="text"
                  value={option.text}
                  onChange={(e) => {
                    setUpdateQuestions(
                      {
                        ...question,
                        options: question.options.map((o) => {
                          if (o.id === option.id) {
                            return { ...o, text: e.target.value };
                          }
                          return o;
                        }),
                      },
                      idx
                    );
                  }}
                  className="w-full"
                />
                {option.id === question.answer && (
                  <div className="flex flex-row gap-2 items-center grow w-fit">
                    <FaArrowLeft className="w-4 h-4 fill-grey-600" />{" "}
                    <p className="text-sm text-grey-600 w-full line-clamp-1">
                      Correct
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <Label className="font-normal">{option.text}</Label>
            )}
          </li>
        ))}
      </ul>
      {showExplanation ? (
        <div className="mt-2">
          {editting ? (
            <div>
              <Label>Explanation</Label>
              <TextArea
                value={question.explanation}
                onChange={(e) =>
                  setUpdateQuestions(
                    {
                      ...question,
                      explanation: e.target.value,
                    },
                    idx
                  )
                }
              />
            </div>
          ) : (
            <>
              <Label>Explanation</Label>
              <ChatContent
                content={question.explanation}
                className="prose-sm mb-0"
              />
              <Button
                variant="link"
                className="text-sm text-blue-500 font-medium line-clamp-1 hover:no-underline p-0"
                onClick={() => setShowExplanation(false)}
              >
                Hide Explanation
              </Button>
            </>
          )}
        </div>
      ) : (
        <Button
          variant="link"
          className="text-sm text-blue-500 font-medium line-clamp-1 hover:no-underline p-0 mt-1"
          onClick={() => setShowExplanation(true)}
        >
          Show Explanation
        </Button>
      )}
    </div>
  );
}

function NumberQuestion({ question }: { question: NumberQuestionT }) {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div>
      <div className="flex flex-row gap-4 items-top">
        <Label className="leading-5">{question.question}</Label>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="link" onClick={() => {}} className="p-0 h-fit">
                <TbEdit className="w-4 h-4 stroke-grey-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit this question.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="p-3 bg-white border border-grey-200 rounded-lg w-fit mt-3">
        <Label className="font-normal">Answer</Label>
        <h3 className="font-medium text-lg">{question.answer}</h3>
      </div>
      {showExplanation ? (
        <div className="mt-2">
          <ChatContent
            content={question.explanation}
            className="prose-sm mb-0"
          />
          <Button
            variant="link"
            className="text-sm text-blue-500 font-medium line-clamp-1 hover:no-underline p-0"
            onClick={() => setShowExplanation(false)}
          >
            Hide Explanation
          </Button>
        </div>
      ) : (
        <Button
          variant="link"
          className="text-sm text-blue-500 font-medium line-clamp-1 hover:no-underline p-0 mt-1"
          onClick={() => setShowExplanation(true)}
        >
          Show Explanation
        </Button>
      )}
    </div>
  );
}

export default function TeacherPracticeExamPage() {
  const pathname = usePathname();
  const courseSlug = pathname.split("/")[3];
  const examId = pathname.split("/")[6];
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<SelectExam>();
  const { isDirty, questions, setQuestions } = useExamPageUpdateState();

  useEffect(() => {
    setLoading(true);
    getExam(examId)
      .then((data) => {
        setExam(data);
        setQuestions((data?.content as { [key: string]: any })?.questions);
      })
      .then(() => {
        setLoading(false);
      });
  }, [examId, setQuestions]);

  return loading ? (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Oval
        visible={true}
        height="54"
        width="54"
        color="#313149"
        secondaryColor="rgba(0,0,0,0)"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
      />
    </div>
  ) : (
    <div className="max-w-[800px] mx-auto  w-full">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/teacher/course/${courseSlug}/practice`}>
              Study Material
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Review Content</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-row w-full justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <IconBubble Icon={FaPencil} size="sm" />
          <div>
            <p className="font-medium text-grey-800">{exam?.name}</p>
            <p className="text-xs text-grey-600 max-w-[600px] truncate">
              Topics: {exam?.topics.split(",").join(", ")}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <Button variant="secondary" className="border border-green-200">
            Endorse
            <Check className="w-4 h-4" />
          </Button>
          {isDirty && <Button variant="secondary">Save changes</Button>}
        </div>
      </div>
      <div className="h-[1px] bg-grey-200 my-4 w-full"></div>
      <div className="flex flex-col gap-6">
        {questions.map((question, idx) => {
          if (question.type === "multiple-choice") {
            return (
              <MultipleChoiceQuestion key={idx} question={question} idx={idx} />
            );
          } else if (question.type === "number") {
            return <NumberQuestion question={question} key={idx} />;
          }
        })}
      </div>
    </div>
  );
}
