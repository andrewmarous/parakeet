"use client";

import { toast } from "@/app/hooks/useToast/useToast";
import { cn } from "@/app/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../Command/Command";
import { Button } from "../../Inputs/Button/Button";
import { Label } from "../../Inputs/Label/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Inputs/Select/Select";
import { TextInput } from "../../Inputs/TextInput/TextInput";
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
import sendApplication from "./actions";
import collegeData from "./collegeData";

const schema = z.object({
  name: z.string().min(1, "Please enter a name."),
  email: z.string().min(1, "Please enter a email."),
  school: z.string().min(1, "Please select a school."),
  grade: z.string({
    required_error: "Please select a grade.",
  }),
  major: z.string().optional(),
});

export type SchemaT = z.infer<typeof schema>;

interface College {
  name: string;
  country: string;
  web_pages: string[];
  alpha_two_code: string;
}

interface CollegeOption {
  label: string;
  value: string;
}

const fetchColleges = (): CollegeOption[] => {
  try {
    const colleges: College[] = collegeData;
    return colleges.map((college) => ({
      label: college.name,
      value: college.name,
    })); // Using the website as a unique value
  } catch (error) {
    console.error("Failed to fetch colleges:", error);
    return [];
  }
};

export default function AmbassadorForm() {
  const [colleges, setColleges] =
    useState<{ label: string; value: string }[]>(fetchColleges());
  const [schoolSelectOpen, setSchoolSelectOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<SchemaT>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      name: "",
      school: "",
      grade: "",
      major: "",
    },
  });

  const submit = async (data: SchemaT) => {
    setLoading(true);
    try {
      await sendApplication(data);
      toast({
        title: "Application Submitted!",
        description: "We'll get back to you within 2-3 days with an update.",
        variant: "success",
      });
      form.reset();
      setLoading(false);
    } catch (e) {
      toast({
        title: "Error submitting application",
        description:
          "There was an error submitting your application. Please try again.",
        variant: "error",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="name" isRequired>
                Name
              </Label>
              <FormControl>
                <TextInput
                  type="name"
                  placeholder="William Holmes Nichols"
                  {...field}
                  className="w-96"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="email" isRequired>
                Email
              </Label>
              <FormControl>
                <TextInput
                  type="email"
                  placeholder="Email"
                  {...field}
                  className="w-96"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="school"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Label htmlFor="school" isRequired>
                College
              </Label>
              <Popover
                open={schoolSelectOpen}
                onOpenChange={setSchoolSelectOpen}
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
                        {field.value !== ""
                          ? colleges.find(
                              (college) => college.label === field.value
                            )?.label
                          : "Select college"}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search colleges..." />
                    <CommandEmpty>No college found.</CommandEmpty>
                    <CommandList>
                      {colleges.map((college) => (
                        <CommandItem
                          key={college.value}
                          value={college.value}
                          onSelect={() => {
                            form.setValue("school", college.label);
                            setSchoolSelectOpen(false);
                          }}
                        >
                          {college.label}
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
        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="grade" isRequired>
                Grade
              </Label>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value === "" ? undefined : field.value}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Freshman">Freshman</SelectItem>
                    <SelectItem value="Sophomore">Sophomore</SelectItem>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Grad">Graduate Student</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="major"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="major">Major</Label>
              <FormControl>
                <TextInput
                  type="major"
                  placeholder="Major"
                  {...field}
                  className="w-96"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="form-actions">
          <Button type="submit" loading={loading} variant={"primary"}>
            Apply
          </Button>
        </div>
      </form>
    </Form>
  );
}
