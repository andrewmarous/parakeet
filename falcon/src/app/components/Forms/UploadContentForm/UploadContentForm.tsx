import { cn } from "@/app/utils";
import { DialogClose } from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { LuUpload } from "react-icons/lu";
import * as z from "zod";
import { Button } from "../../Inputs/Button/Button";
import { Calendar } from "../../Inputs/Calendar/Calendar";
import { Label } from "../../Inputs/Label/Label";
import { MediaInput } from "../../Inputs/MediaInput/MediaInput";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../Popover/Base/Popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../Tooltip/Tooltip";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../Base/Form/Form";
import { uploadContent } from "./actions";

const schema = z.object({
  files: z.instanceof(File).array(),
  release_date: z.date().optional(),
});

type SchemaT = z.infer<typeof schema>;

const defaultValues: DefaultValues<SchemaT> = {
  release_date: new Date(),
  files: [],
};

const MAX_FILE_SIZE = 10000000;
const allowedFileTypes = ["application/pdf"];

export default function UploadContentForm({ isPublic }: { isPublic: boolean }) {
  const form = useForm<SchemaT>({ defaultValues });
  const {
    setError,
    clearErrors,
    setValue,
    control,
    formState: { errors },
  } = form;
  const [loading, setLoading] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];

  const handleFilesChange = (fileList: File[]) => {
    let isValid = true;
    const validFiles: File[] = [];

    fileList.forEach((file) => {
      if (!allowedFileTypes.includes(file.type)) {
        setError("files", {
          type: "manual",
          message: `${file.name}: Invalid file type`,
        });
        isValid = false;
      } else if (file.size > MAX_FILE_SIZE) {
        setError("files", {
          type: "manual",
          message: `${file.name}: File too large`,
        });
        isValid = false;
      } else {
        validFiles.push(file);
      }
    });

    if (isValid) {
      clearErrors("files");
    }

    setValue("files", validFiles, { shouldValidate: true });
  };

  const submit = async (data: SchemaT) => {
    setLoading(true);
    const files = data.files;
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    const res = await uploadContent(isPublic, courseSlug, formData);
    closeButtonRef.current?.click();
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="form-elements">
        <FormField
          control={control}
          name="files"
          rules={{
            validate: {
              checkNoErrors: () => {
                return !errors.files || (errors.files.message as string);
              },
              checkFileCount: (files: File[]) => {
                return (
                  files.length <= 10 ||
                  "You can only upload a maximum of 10 files at a time"
                );
              },
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MediaInput
                  id={"media"}
                  label="Upload any PDFs related to this course."
                  {...field}
                  onChange={handleFilesChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isPublic ? (
          <FormField
            control={form.control}
            name="release_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="flex flex-row gap-2">
                  <Label>Release date</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AiOutlineQuestionCircle className="w-4 h-4 fill-grey-600" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-96">
                        <p className="text-grey-800">
                          Select the date this content should be accessible for
                          your students.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"secondary"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <></>
        )}
        <div className="flex flex-row form-actions w-full gap-4 justify-end">
          <DialogClose asChild>
            <Button variant="secondary" ref={closeButtonRef}>
              Cancel
            </Button>
          </DialogClose>
          <Button variant="primary" type="submit" loading={loading}>
            Upload Content <LuUpload />
          </Button>
        </div>
      </form>
    </Form>
  );
}
