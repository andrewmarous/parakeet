"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";
import UploadContentDialog from "../../Dialogs/UploadContentDialog/UploadContentDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../DropdownMenu/Base/DropdownMenu";
import { Button, buttonVariants } from "../../Inputs/Button/Button";
import { Checkbox } from "../../Inputs/Checkbox/Checkbox";
import { DataTable } from "../Base/DataTable";
import { deleteContent, getContentData, moveTo } from "./actions";

type CourseContentType = "public" | "private" | "all" | "scheduled";

type ContentColumnT = {
  id: string;
  name: string;
  file_type: string;
  date_uploaded: string;
  url: string;
};

const staticColumns: ColumnDef<ContentColumnT>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className={buttonVariants({ variant: "tertiary" })}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          File Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-sm font-medium text-dark-grey pl-4">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "file_type",
    header: ({ column }) => {
      return (
        <Button
          className={buttonVariants({ variant: "tertiary" })}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          File Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-sm text-dark-grey pl-4">
        {row.getValue("file_type")}
      </div>
    ),
  },
  {
    accessorKey: "date_uploaded",
    header: ({ column }) => {
      return (
        <Button
          className={buttonVariants({ variant: "tertiary" })}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Uploaded
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-sm text-dark-grey pl-4">
        {new Date(row.getValue("date_uploaded")).toLocaleDateString()}
      </div>
    ),
  },
];

export default function CourseContentDataTable({
  contentType,
}: {
  contentType: CourseContentType;
}) {
  const [data, setData] = useState<ContentColumnT[]>([]);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const courseSlug = pathname.split("/")[3];
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setLoading(true);
    getContentData(courseSlug, contentType === "public").then((data) => {
      const formattedData = data.map((content) => {
        const date = new Date(content.dateUploaded).toLocaleDateString();
        return {
          id: content.id,
          name: content.name,
          file_type: "PDF",
          date_uploaded: date,
          url: content.url,
        };
      });
      setData(formattedData);
      setLoading(false);
    });
  }, [courseSlug, contentType, reload]);

  const actionsColumn: ColumnDef<ContentColumnT> = {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className={`${buttonVariants({ variant: "tertiary" })} h-8 w-8 p-0`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                const url = data[Number(row.id)]["url"];
                // Create a temporary anchor (`<a>`) element
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("target", "_blank");
                link.setAttribute("rel", "noopener noreferrer");
                link.setAttribute("download", ""); // The download attribute can suggest to browsers to download instead of navigate.

                // Append to the document and click
                document.body.appendChild(link);
                link.click();

                // Clean up by removing the temporary element
                document.body.removeChild(link);
              }}
            >
              Download file
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex flex-row gap-1"
              onClick={async () => {
                await moveTo(
                  data[Number(row.id)]["id"],
                  contentType === "public"
                );
                setReload((prevReload) => !prevReload);
              }}
            >
              <span>Move to </span>
              {contentType === "private" ? (
                <span>public</span>
              ) : (
                <span>private</span>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () =>
                await deleteContent(data[Number(row.id)]["id"])
              }
            >
              Delete file
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };

  const columns = [...staticColumns, actionsColumn];

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        filterColumnName="name"
        loading={loading}
        topRightElement={
          <UploadContentDialog isPublic={contentType === "public"} />
        }
      />
    </>
  );
}
