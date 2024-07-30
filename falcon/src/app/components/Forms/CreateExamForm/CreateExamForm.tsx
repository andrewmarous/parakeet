"use client";

import { toast } from "@/app/hooks/useToast/useToast";
import { cn } from "@/app/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa6";
import { Oval } from "react-loader-spinner";
import * as z from "zod";
import { DialogClose } from "../../Dialogs/Base/Dialog";
import { Button } from "../../Inputs/Button/Button";
import { Label } from "../../Inputs/Label/Label";
import { TextInput } from "../../Inputs/TextInput/TextInput";
import { ScrollArea } from "../../ScrollArea/ScrollArea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../Base/Form/Form";
import { createExam, getTopics } from "./actions";

const schema = z.object({
  examName: z
    .string()
    .min(1, "Exam name is required")
    .max(245, "Exam name is required."),
  topics: z.array(z.string()).min(1, "Please select at least one topic"),
});

type SchemaT = z.infer<typeof schema>;

const defaultValues: DefaultValues<SchemaT> = {
  examName: "",
  topics: [],
};

export default function CreateExamForm() {
  const form = useForm<SchemaT>({
    defaultValues,
    resolver: zodResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [formLoading, setFormLoading] = useState(true);

  useEffect(() => {
    setFormLoading(true);
    getTopics(courseSlug)
      .then((topics) => {
        setTopics(topics);
      })
      .then(() => {
        setFormLoading(false);
      });
  }, [courseSlug]);

  const submit = async (data: SchemaT) => {
    setLoading(true);
    const ref = toast({
      title: "This can take a while...",
      description:
        "We are working on making this faster, but it can take 2-3 minutes right now. Please be patient.",
    });
    try {
      const res = await createExam(courseSlug, data);
      if (res.duplicateName) {
        ref.dismiss();
        form.setError("examName", {
          type: "manual",
          message: "Name already exists.",
        });
        setLoading(false);
        return;
      }

      if (res.noTopics) {
        ref.dismiss();
        form.setError("topics", {
          type: "manual",
          message: "Please select at least one topic.",
        });
        setLoading(false);
        return;
      }
      setLoading(false);
      dialogCloseRef.current?.click();
    } catch (e) {
      ref.dismiss();
      toast({
        title: "Uh oh!",
        description: "Something went wrong with your query. Please try again.",
        variant: "error",
      });
      form.reset();
    }
  };

  return formLoading ? (
    <div className="w-full ">
      <Oval
        visible={true}
        height="36"
        width="36"
        color="#313149"
        secondaryColor="rgba(0,0,0,0)"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass="mx-auto my-8 w-fit"
      />
    </div>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="form-elements">
        <FormField
          control={form.control}
          name="examName"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="examName" isRequired>
                Exam name
              </Label>
              <FormControl>
                <TextInput
                  type="text"
                  placeholder="Enter a name for your practice exam..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="topics"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="topics" isRequired>
                Select topics
              </Label>
              <FormControl>
                <ScrollArea className="max-h-[300px] overflow-scroll">
                  <div className="flex flex-row flex-wrap gap-4">
                    {topics.map((topic, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "px-3 py-2 rounded-lg cursor-pointer transition duration-1000 ease-in-out",
                          !field.value.includes(topic) &&
                            "bg-gradient-to-br from-grey-50 to-grey-100 inset-shadow-transparent border border-grey-100",
                          field.value.includes(topic) &&
                            "bg-gradient-to-br from-blue-50 to-blue-100 inset-shadow-transparent border border-blue-100"
                        )}
                        onClick={() => {
                          if (field.value.includes(topic)) {
                            field.onChange(
                              field.value.filter((t) => t !== topic)
                            );
                          } else {
                            field.onChange([...field.value, topic]);
                          }
                        }}
                      >
                        <p className="font-medium text-xs text-grey-700">
                          {topic}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row form-actions w-full gap-4 justify-end">
          <DialogClose asChild>
            <Button variant="secondary" ref={dialogCloseRef}>
              Cancel
            </Button>
          </DialogClose>
          <Button variant="primary" type="submit" loading={loading}>
            Create review <FaPlus />
          </Button>
        </div>
      </form>
    </Form>
  );
}
