"use client";

import { cn } from "@/app/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaBullhorn, FaQuestion, FaRegMessage } from "react-icons/fa6";
import * as z from "zod";
import { Button } from "../../Inputs/Button/Button";
import { Label } from "../../Inputs/Label/Label";
import { RichTextEditor } from "../../Inputs/RichTextEditor";
import { TextInput } from "../../Inputs/TextInput/TextInput";

import { toast } from "@/app/hooks/useToast/useToast";
import useUpdateStore from "@/app/stores/discussionSidebar.store";
import CardRadioGroupItem from "../../Inputs/CardRadio/CardRadio";
import { Checkbox } from "../../Inputs/Checkbox/Checkbox";
import RadioGroup, { RadioGroupItem } from "../../Inputs/RadioGroup/RadioGroup";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../Base/Form/Form";
import { createPost, getTopics } from "./actions";

const schema = z.object({
  subject: z
    .string()
    .min(1, "Post subject is required")
    .max(100, "Post subject is too long"),
  topic: z.string().optional(),
  content: z.string().min(1, "Post content is required"),
  visibility: z.enum(["teachers", "students", "both"]),
  type: z.enum(["post", "question", "announcement"]),
  isAnonymous: z.boolean(),
});

type SchemaT = z.infer<typeof schema>;

export default function CreatePostForm() {
  const form = useForm<SchemaT>({
    resolver: zodResolver(schema),
    defaultValues: {
      subject: "",
      content: "",
      type: "question",
      visibility: "both",
      isAnonymous: false,
    },
  });
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState<string[]>([]);
  const [showMoreTopics, setShowMoreTopics] = useState(false);
  const [clearEditor, setClearEditor] = useState<boolean>(false);
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const { update, setUpdate } = useUpdateStore();

  useEffect(() => {
    setLoading(true);
    getTopics(courseSlug)
      .then((topics) => {
        setTopics(topics);
      })
      .then(() => {
        setLoading(false);
      });
  }, [courseSlug]);

  const submit = async (data: SchemaT) => {
    try {
      setLoading(true);
      if (markdownContent.replace(/\s/g, "") === "") {
        form.setError("content", {
          type: "manual",
          message: "Post content is required",
        });
        setLoading(false);
        return;
      }
      const _ = await createPost(courseSlug, {
        ...data,
        markdownContent,
      });
      setUpdate(update * -1);
      setLoading(false);
    } catch (e) {
      toast({
        title: "Uh oh!",
        description: "Something went wrong with. Please try again.",
        variant: "error",
      });
      setClearEditor((prev) => !prev);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-row items-center gap-4">
        <div>
          <div
            className={
              "flex items-center justify-center rounded-xl border bg-gradient-to-b from-grey-100 to-grey-200 inset-shadow-transparent border-grey-200 h-11 w-11"
            }
          >
            <FaRegMessage className={"h-5 w-5 fill-grey-600"} />
          </div>
        </div>
        <div className="mt-1">
          <h3 className="font-semibold">Create a discussion post</h3>
          <p className="font-normal text-xs text-grey-600">
            Post a question in order to get an answer from your course staff or
            peers.
          </p>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submit)}
          className="mt-8 form-elements"
        >
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="subject" isRequired>
                  Subject
                </Label>
                <FormControl>
                  <TextInput
                    type="text"
                    className="w-[36rem]"
                    placeholder="Enter subject of your post"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="topic">Select topic</Label>
                <FormControl>
                  <>
                    <div className="flex flex-row flex-wrap gap-4">
                      {topics.slice(0, 8).map((topic, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "px-3 py-2 rounded-lg cursor-pointer transition duration-1000 ease-in-out",
                            field.value !== topic &&
                              "bg-gradient-to-br from-grey-25 to-grey-200 inset-shadow-transparent border border-grey-200",
                            field.value === topic &&
                              "bg-gradient-to-br from-blue-50 to-blue-100 inset-shadow-transparent border border-blue-100"
                          )}
                          onClick={() => {
                            if (field.value === topic) {
                              field.onChange(undefined);
                            } else {
                              field.onChange(topic);
                            }
                          }}
                        >
                          <p className="font-medium text-xs text-grey-700">
                            {topic}
                          </p>
                        </div>
                      ))}
                      {topics.length > 8 &&
                        showMoreTopics &&
                        topics.slice(8).map((topic, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "px-3 py-2 rounded-lg cursor-pointer transition duration-1000 ease-in-out",
                              field.value !== topic &&
                                "bg-gradient-to-br from-grey-25 to-grey-200 inset-shadow-transparent border border-grey-200",
                              field.value === topic &&
                                "bg-gradient-to-br from-blue-50 to-blue-100 inset-shadow-transparent border border-blue-100"
                            )}
                            onClick={() => {
                              if (field.value === topic) {
                                field.onChange(undefined);
                              } else {
                                field.onChange(topic);
                              }
                            }}
                          >
                            <p className="font-medium text-xs text-grey-700">
                              {topic}
                            </p>
                          </div>
                        ))}
                    </div>
                    {topics.length > 8 &&
                      (showMoreTopics ? (
                        <Button
                          variant={"link"}
                          onClick={() => setShowMoreTopics(false)}
                          className="p-0 text-blue-500"
                          type="button"
                        >
                          Show Less
                        </Button>
                      ) : (
                        <Button
                          variant={"link"}
                          onClick={() => setShowMoreTopics(true)}
                          type="button"
                          className="p-0 text-blue-500"
                        >
                          Show More
                        </Button>
                      ))}
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="content" isRequired>
                  Content
                </Label>
                <FormControl>
                  <RichTextEditor
                    onEditorChange={field.onChange}
                    clearEditor={clearEditor}
                    setMarkdownText={setMarkdownContent}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full h-[1px] bg-grey-200 my-4"></div>
          <div className="grid grid-cols-3">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="type" isRequired>
                    Discussion Type
                  </Label>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <CardRadioGroupItem
                            value={"question"}
                            option={{
                              value: "question",
                              label: "Question",
                              Icon: (
                                <FaQuestion className="h-4 w-4 fill-grey-800" />
                              ),
                            }}
                            currentValue={field.value}
                          />
                        </FormControl>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <CardRadioGroupItem
                            value={"post"}
                            option={{
                              value: "post",
                              label: "Post",
                              Icon: (
                                <FaBullhorn className="h-4 w-4 fill-grey-800" />
                              ),
                            }}
                            currentValue={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-4">
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <Label htmlFor="visibility" isRequired>
                      Who can view this?
                    </Label>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="both" />
                          </FormControl>
                          <Label className="font-normal">
                            Teachers and students
                          </Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="teachers" />
                          </FormControl>
                          <Label className="font-normal">Teachers</Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="students" />
                          </FormControl>
                          <Label className="font-normal">Students</Label>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="isAnonymous"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <Label>Anonymous</Label>
                    <FormDescription>
                      Do not let other students know your name.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="form-actions w-fit">
            <Button
              type="submit"
              className="w-full"
              loading={loading}
              variant={"primary"}
            >
              Post
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
