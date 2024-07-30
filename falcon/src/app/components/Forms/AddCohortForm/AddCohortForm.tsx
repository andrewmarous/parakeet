"use client";

import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa6";
import * as z from "zod";
import { DialogClose } from "../../Dialogs/Base/Dialog";
import { Button } from "../../Inputs/Button/Button";
import { Label } from "../../Inputs/Label/Label";
import { TextInput } from "../../Inputs/TextInput/TextInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../Base/Form/Form";
import { addCohort } from "./actions";

const schema = z.object({
  name: z
    .string()
    .min(8, "Cohort name is required")
    .max(8, "Cohort name is required."),
});

type SchemaT = z.infer<typeof schema>;

const defaultValues: DefaultValues<SchemaT> = {
  name: "",
};

export default function AddCohortForm() {
  const form = useForm<SchemaT>({ defaultValues });
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  const submit = async (data: SchemaT) => {
    setLoading(true);
    const res = await addCohort(courseSlug, data.name);

    if (!res) {
      form.setError("name", {
        type: "manual",
        message: "Cohort already exists.",
      });
    }
    setLoading(false);
    dialogCloseRef.current?.click();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="courseCode">Name</Label>
              <FormControl>
                <TextInput
                  type="text"
                  placeholder="Enter name of cohort"
                  {...field}
                />
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
            Add cohort <FaPlus />
          </Button>
        </div>
      </form>
    </Form>
  );
}
