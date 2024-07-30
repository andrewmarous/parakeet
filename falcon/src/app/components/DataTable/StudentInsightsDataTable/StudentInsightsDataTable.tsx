"use client";

import { timeAgo } from "@/app/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
import { getPromptInteraction } from "../TopicInsightsDataTable/actions";
import { getStudentInsights } from "./actions";

type StudentInsightColumnT = {
  id: string;
  prompt: string;
  response: string;
  topic: string;
  sent: string;
};

const staticColumns: ColumnDef<StudentInsightColumnT>[] = [
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
    accessorKey: "topic",
    header: ({ column }) => {
      return (
        <Button
          className={buttonVariants({ variant: "tertiary" })}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Topic
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="pl-4 line-clamp-1 truncate">
        <Nib variant="primary" text={row.getValue("topic")} />
      </div>
    ),
  },
  {
    accessorKey: "sent",
    header: ({ column }) => <div className="pl-4">Sent</div>,
    cell: ({ row }) => (
      <div className="text-sm text-dark-grey pl-4 line-clamp-1">
        {row.getValue("sent")}
      </div>
    ),
  },
];

export default function StudentInsightsDataTable() {
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];
  const studentId = pathname.split("/").pop();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptT>({} as PromptT);
  const [data, setData] = useState<StudentInsightColumnT[]>([]);

  useEffect(() => {
    getStudentInsights(courseSlug, studentId!).then((data) => {
      const cleanedData = data.map((prompt) => {
        return {
          id: prompt.id,
          prompt: prompt.prompt,
          response: prompt.response,
          topic: prompt.topic,
          sent: timeAgo(prompt.created),
        };
      });
      setData(cleanedData);
    });
  }, [courseSlug, studentId]);

  const handleViewInteraction = (promptId: string) => {
    getPromptInteraction(promptId).then((data) => {
      setSelectedPrompt(data);
      setDialogOpen(true);
    });
  };

  const actionsColumn: ColumnDef<StudentInsightColumnT> = {
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
          showCTA={false}
          isNested
        />
      )}
      <DataTable columns={columns} data={data} filterColumnName="topic" />
    </>
  );
}
