"use client";

import { RoleT } from "@/types";
import { useUser } from "@clerk/nextjs";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useState } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import * as z from "zod";
import { DialogClose } from "../../Dialogs/Base/Dialog";
import { Button } from "../../Inputs/Button/Button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../../Inputs/InputOTP/InputOTP";
import { Label } from "../../Inputs/Label/Label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../Base/Form/Form";
import addCourse from "./actions/addCourse";

const schema = z.object({
  courseCode: z
    .string()
    .min(8, "Course code is required")
    .max(8, "Course code is required."),
});

type SchemaT = z.infer<typeof schema>;

const defaultValues: DefaultValues<SchemaT> = {
  courseCode: "",
};

export default function AddCourseForm() {
  const form = useForm<SchemaT>({ defaultValues });
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const role = user?.publicMetadata?.role as RoleT;

  const submit = async (data: SchemaT) => {
    setLoading(true);
    const res = await addCourse(data.courseCode, role);

    if (res === false) {
      form.setError("courseCode", {
        type: "manual",
        message: "Course code is invalid.",
      });
    }
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)}>
        <FormField
          control={form.control}
          name="courseCode"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="courseCode">Enter code</Label>
              <FormControl>
                <InputOTP
                  {...field}
                  maxLength={8}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  render={({ slots }) => (
                    <>
                      <InputOTPGroup>
                        {slots.slice(0, 8).map((slot, index) => (
                          <InputOTPSlot key={index} {...slot} />
                        ))}
                      </InputOTPGroup>
                    </>
                  )}
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
            Add Course
          </Button>
        </div>
      </form>
    </Form>
  );
}
