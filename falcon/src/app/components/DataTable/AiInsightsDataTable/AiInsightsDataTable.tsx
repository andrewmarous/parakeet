"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { PromptT } from "../../Cards/PromptFeedCard/PromptFeedCard";
import ViewPromptDialog from "../../Dialogs/ViewPromptDialog/ViewPromptDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../DropdownMenu/Base/DropdownMenu";
import { Button, buttonVariants } from "../../Inputs/Button/Button";
import Nib from "../../Nib/Nib";
import { DataTable } from "../Base/DataTable";
import { getPromptInteraction } from "./actions";

export type AiInsightColumnT = {
  id: string;
  prompt: string;
  response: string;
  student: string;
  warningLevel: "Acceptable" | "Warning" | "Severe";
  studentId: string;
};

const staticColumns: ColumnDef<AiInsightColumnT>[] = [
  {
    accessorKey: "prompt",
    header: ({ column }) => <div className="pl-4">Prompt</div>,
    cell: ({ row }) => (
      <div className="text-sm font-medium text-dark-grey pl-4 truncate max-w-xs">
        {row.getValue("prompt")}
      </div>
    ),
  },
  {
    accessorKey: "response",
    header: ({ column }) => <div className="pl-4">Response</div>,
    cell: ({ row }) => (
      <div className="text-sm text-dark-grey pl-4 truncate max-w-xs">
        {row.getValue("response")}
      </div>
    ),
  },
  {
    accessorKey: "student",
    header: ({ column }) => {
      return (
        <Button
          className={buttonVariants({ variant: "tertiary" })}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="pl-4">
        <Nib variant="primary" text={row.getValue("student")} />
      </div>
    ),
  },
  {
    accessorKey: "warningLevel",
    header: ({ column }) => (
      <Button
        className={buttonVariants({ variant: "tertiary" })}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Warning
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const val = row.getValue("warningLevel") as string;

      return (
        <div className="ml-4">
          <Nib
            variant={
              val === "Warning"
                ? "yellow"
                : val === "Acceptable"
                  ? "green"
                  : "red"
            }
            text={val}
          />
        </div>
      );
    },
  },
];

export default function AiInsightsDataTable({
  data,
}: {
  data: AiInsightColumnT[];
}) {
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptT>({} as PromptT);
  const router = useRouter();

  const handleViewInteraction = (promptId: string) => {
    getPromptInteraction(promptId).then((data) => {
      setSelectedPrompt(data);
      setDialogOpen(true);
    });
  };

  const goToStudent = (studentId: string) => {
    router.push(`/teacher/course/${courseSlug}/analysis/student/${studentId}`);
  };

  const actionsColumn: ColumnDef<AiInsightColumnT> = {
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
              onSelect={() => handleViewInteraction(row.original.id)}
            >
              View prompt interaction
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => goToStudent(row.original.studentId)}
            >
              View student insights
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };

  const columns = [...staticColumns, actionsColumn];

  return (
    <>
      {dialogOpen && (
        <ViewPromptDialog
          prompt={selectedPrompt}
          onClose={() => setDialogOpen(false)}
          isNested
        />
      )}
      <DataTable columns={columns} data={data} filterColumnName="student" />
    </>
  );
}
