"use client";

import useUpdateStore from "@/app/stores/discussionSidebar.store";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../../Inputs/Button/Button";
import { TextInput } from "../../Inputs/TextInput/TextInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../Base/Form/Form";
import { createReply } from "./actions";

const RichTextEditor = dynamic(
  () =>
    import("@/app/components/Inputs/RichTextEditor").then(
      (module) => module.RichTextEditor
    ),
  { ssr: false, loading: () => <></> }
);

const schema = z.object({
  content: z.string().min(1, "Post content is required"),
});

type SchemaT = z.infer<typeof schema>;

export default function CreateReplyForm({
  parent,
  startVisible = true,
  showCancel,
  setIsVisible,
}: {
  parent?: string;
  showCancel?: boolean;
  startVisible?: boolean;
  setIsVisible?: () => void;
}) {
  const form = useForm<SchemaT>({ resolver: zodResolver(schema) });
  const pathname = usePathname();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const discussionSlug = pathname?.split("/")[5];
  const courseSlug = pathname?.split("/")[3];
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(startVisible);
  const [clearEditor, setClearEditor] = useState<boolean>(false);
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const { updatePage, setUpdatePage, update, setUpdate } = useUpdateStore();

  const submit = async (data: SchemaT) => {
    setLoading(true);
    if (markdownContent.replace(/\s/g, "") === "") {
      form.setError("content", {
        type: "manual",
        message: "Post content is required",
      });
      setLoading(false);
      return;
    }
    const _ = await createReply(
      courseSlug,
      discussionSlug,
      data.content,
      markdownContent,
      parent
    );
    setUpdate(update * -1);
    setUpdatePage(updatePage + 1);
    setLoading(false);
    setClearEditor((prev) => !prev);

    if (showCancel) {
      cancelButtonRef.current?.click();
    }
  };

  return visible ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
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
        <div className="mt-3 w-full flex-row flex justify-end gap-4">
          {showCancel && (
            <Button
              variant={"secondary"}
              type="button"
              ref={cancelButtonRef}
              onClick={() => {
                setVisible(false);
                setIsVisible && setIsVisible();
              }}
            >
              Cancel
            </Button>
          )}
          <Button variant={"primary"} type="submit" loading={loading}>
            Post
          </Button>
        </div>
      </form>
    </Form>
  ) : (
    <TextInput
      placeholder="Reply"
      className="w-full"
      value={""}
      onClick={() => setVisible(true)}
    />
  );
}
