"use client";

import { cn } from "@/app/utils";
import { StudentCourse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import * as z from "zod";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../Command/Command";
import { DialogClose } from "../../Dialogs/Base/Dialog";
import { Button } from "../../Inputs/Button/Button";
import { Label } from "../../Inputs/Label/Label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../Popover/Base/Popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../Base/Form/Form";
import addCourse, { getCourses } from "./actions/addCourse";

const schema = z.object({
  course: z
    .object({
      label: z.string().min(1, "You must select a course."),
      value: z.string().min(1, "You must select a course."),
    })
    .required(),
});

type SchemaT = z.infer<typeof schema>;

const defaultValues: DefaultValues<SchemaT> = {
  course: {
    label: "",
    value: "",
  },
};

export default function AddCourseDropdownForm({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const form = useForm<SchemaT>({
    defaultValues,
    resolver: zodResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const [courseSelectOpen, setCourseSelectOpen] = useState(false);
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [searchCourse, setSearchCourse] = useState<string>("");

  useEffect(() => {
    getCourses().then((data) => {
      setCourses(data);
    });
  }, []);

  useEffect(() => {}, [courseSelectOpen]);

  const submit = async (data: SchemaT) => {
    setLoading(true);
    const res = await addCourse(data.course.value, "student");

    if (res === false) {
      form.setError("course", {
        type: "manual",
        message: "Course code is invalid.",
      });
    }
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="pointer-events-auto"
      >
        <FormField
          control={form.control}
          name="course"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Label htmlFor="courseCode" isRequired>
                Courses
              </Label>
              <Popover
                open={courseSelectOpen}
                onOpenChange={setCourseSelectOpen}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="secondary"
                      role="combobox"
                      className={cn(
                        "w-fit justify-between",
                        !field.value && "text-grey-700"
                      )}
                    >
                      <span className="max-w-[175px] truncate">
                        {field.value.label !== ""
                          ? courses.find(
                              (course) => course.name === field.value.label
                            )?.name
                          : "Select course"}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[300px] p-0 pointer-events-auto"
                  containerRef={containerRef.current}
                >
                  <Command className="pointer-events-auto">
                    <CommandInput
                      placeholder="Search for courses..."
                      autoFocus
                    />
                    <CommandEmpty>No course found.</CommandEmpty>
                    <CommandList>
                      {courses.map((course, idx) => (
                        <CommandItem
                          key={idx}
                          value={course.name}
                          onSelect={() => {
                            form.setValue("course", {
                              label: course.name,
                              value: course.studentCode,
                            });
                            setCourseSelectOpen(false);
                          }}
                        >
                          {course.name}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
