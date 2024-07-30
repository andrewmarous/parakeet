"use client";

import { timeAgo } from "@/app/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
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
import {
  getClusterInsightsData,
  getPromptInteraction,
  getTopicInsightsData,
} from "./actions";

type TopicInsightColumnT = {
  id: string;
  prompt: string;
  response: string;
  student: string;
  sent: string;
  studentId: string;
};

const staticColumns: ColumnDef<TopicInsightColumnT>[] = [
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
    accessorKey: "sent",
    header: ({ column }) => <div className="pl-4">Sent</div>,
    cell: ({ row }) => (
      <div className="text-sm text-dark-grey pl-4">{row.getValue("sent")}</div>
    ),
  },
];

export default function StudentInsightsDataTable({
  topic,
  cluster,
}: {
  topic?: string;
  cluster?: string;
}) {
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];
  const [data, setData] = useState<TopicInsightColumnT[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptT>({} as PromptT);
  const router = useRouter();

  useEffect(() => {
    if (topic) {
      getTopicInsightsData(courseSlug, topic).then((data) => {
        const cleanedData = data.map((prompt) => {
          return {
            id: prompt.prompts!.id,
            prompt: prompt.prompts!.prompt,
            response: prompt.prompts!.response,
            student: `${prompt.users?.firstName} ${prompt.users?.lastName}`,
            sent: timeAgo(prompt.prompts!.created),
            studentId: prompt.users?.id!,
          };
        });
        setData(cleanedData);
      });
    } else if (cluster) {
      getClusterInsightsData(courseSlug, cluster).then((data) => {
        const cleanedData = data?.prompts.map((prompt) => {
          return {
            id: prompt.id,
            prompt: prompt.prompt,
            response: prompt.response,
            student: `${prompt.user.firstName} ${prompt.user.lastName}`,
            sent: timeAgo(prompt.created),
            studentId: prompt.user.id!,
          };
        });
        setData(cleanedData!);
      });
    }
  }, [cluster, courseSlug, topic]);

  const handleViewInteraction = (promptId: string) => {
    getPromptInteraction(promptId).then((data) => {
      setSelectedPrompt(data);
      setDialogOpen(true);
    });
  };

  const goToStudent = (studentId: string) => {
    router.push(`/teacher/course/${courseSlug}/analysis/student/${studentId}`);
  };

  const actionsColumn: ColumnDef<TopicInsightColumnT> = {
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
