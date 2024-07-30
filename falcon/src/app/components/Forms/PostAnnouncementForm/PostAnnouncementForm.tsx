"use client";

import { useState } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import * as z from "zod";
import { DialogClose } from "../../Dialogs/Base/Dialog";
import { Button } from "../../Inputs/Button/Button";
import { Label } from "../../Inputs/Label/Label";
import { TextArea } from "../../Inputs/TextArea/TextArea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../Base/Form/Form";

const schema = z.object({
  announcement: z.string().min(1, "Announcement is required"),
});

type SchemaT = z.infer<typeof schema>;

const defaultValues: DefaultValues<SchemaT> = {
  announcement: "",
};

export default function PostAnnouncementForm() {
  const form = useForm<SchemaT>({ defaultValues });
  const [loading, setLoading] = useState(false);

  const submit = async (data: SchemaT) => {
    setLoading(true);
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)}>
        <FormField
          control={form.control}
          name="announcement"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="announcement">Announcement</Label>
              <FormControl>
                <TextArea
                  {...field}
                  id="announcement"
                  placeholder="Write your announcement here"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row form-actions w-full gap-4 justify-end">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button variant="primary" type="submit" loading={loading}>
            Post
          </Button>
        </div>
      </form>
    </Form>
  );
}
