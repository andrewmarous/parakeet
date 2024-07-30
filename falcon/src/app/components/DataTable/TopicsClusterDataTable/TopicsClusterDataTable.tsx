"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../DropdownMenu/Base/DropdownMenu";
import { Button, buttonVariants } from "../../Inputs/Button/Button";
import { Checkbox } from "../../Inputs/Checkbox/Checkbox";
import { DataTable } from "../Base/DataTable";

export type TopicClusterColumnT = {
  id: string;
  cluster: string;
  num_questions: number;
  most_recent_question: string;
};

const staticColumns: ColumnDef<TopicClusterColumnT>[] = [
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
    accessorKey: "cluster",
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
      <div className="text-sm font-medium text-dark-grey pl-4">
        {row.getValue("cluster")}
      </div>
    ),
  },
  {
    accessorKey: "num_questions",
    header: ({ column }) => {
      return (
        <Button
          className={buttonVariants({ variant: "tertiary" })}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          # of Questions
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-sm text-dark-grey pl-4">
        {row.getValue("num_questions")}
      </div>
    ),
  },
  {
    accessorKey: "most_recent_question",
    header: ({ column }) => {
      return (
        <Button
          className={buttonVariants({ variant: "tertiary" })}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Most Recent Question
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-sm text-dark-grey pl-4">
        {row.getValue("most_recent_question")}
      </div>
    ),
  },
];

export default function TopicsDataTable({
  data,
}: {
  data: TopicClusterColumnT[];
}) {
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];
  const searchParams = useSearchParams();
  const router = useRouter();

  const routeToTopicAnalysis = (clusterId: string) => {
    router.push(
      `/teacher/course/${courseSlug}/analysis/topic-alert/${clusterId}`
    );
  };

  const actionsColumn: ColumnDef<TopicClusterColumnT> = {
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
              onClick={() => routeToTopicAnalysis(row.getValue("topic"))}
            >
              View alert insights
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };

  const columns = [...staticColumns, actionsColumn];

  return (
    <>
      <DataTable columns={columns} data={data} filterColumnName="topic" />
    </>
  );
}
