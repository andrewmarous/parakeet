"use client";

import { toast } from "@/app/hooks/useToast/useToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa6";
import { Oval } from "react-loader-spinner";
import * as z from "zod";
import { DialogClose } from "../../Dialogs/Base/Dialog";
import { Button } from "../../Inputs/Button/Button";
import { Label } from "../../Inputs/Label/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Inputs/Select/Select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../Base/Form/Form";
import { addStudentToCohort, getCohorts, getStudentCohort } from "./actions";

const schema = z.object({
  cohort: z.object({
    label: z.string(),
    value: z.string(),
  }),
});

type SchemaT = z.infer<typeof schema>;

interface Cohort {
  id: string;
  course: string;
  name: string;
}

export default function AddStudentToCohortForm({
  student,
}: {
  student: string;
}) {
  const form = useForm<SchemaT>({
    resolver: zodResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(true);
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setDialogLoading(true);
    getCohorts(courseSlug).then((cohorts) => {
      setCohorts(cohorts);
      setDialogLoading(false);
    });
    getStudentCohort(courseSlug, student).then((cohort) => {
      if (cohort) {
        form.setValue("cohort", {
          label: cohort.name,
          value: cohort.id,
        });
      }
    });
    setDialogLoading(false);
  }, [courseSlug, form, student]);

  const submit = async (data: SchemaT) => {
    setLoading(true);
    try {
      const res = await addStudentToCohort(
        courseSlug,
        data.cohort.value,
        student
      );
    } catch (e) {
      toast({
        title: "Uh oh!",
        description: "Something went wrong with your query. Please try again.",
        variant: "error",
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
          name="cohort"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="cohort">Cohort Name</Label>
              <FormControl>
                <Select
                  onValueChange={(value: string) => {
                    const newCohort = cohorts.find(
                      (cohort) => cohort.id === value
                    );
                    field.onChange({
                      label: newCohort?.name,
                      value: newCohort?.id,
                    });
                  }}
                  defaultValue={field.value ? field.value.label : undefined}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select cohort" />
                  </SelectTrigger>
                  <SelectContent>
                    {dialogLoading ? (
                      <SelectItem className="py-4" disabled value="loading">
                        <Oval
                          visible={true}
                          height="16"
                          width="16"
                          color="#313149"
                          secondaryColor="rgba(0,0,0,0)"
                          ariaLabel="oval-loading"
                          strokeWidth={6}
                          wrapperStyle={{}}
                          wrapperClass="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
                        />
                      </SelectItem>
                    ) : (
                      <>
                        {cohorts.map((cohort) => (
                          <SelectItem key={cohort.id} value={cohort.id}>
                            {cohort.name}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
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
            Add student <FaPlus />
          </Button>
        </div>
      </form>
    </Form>
  );
}
