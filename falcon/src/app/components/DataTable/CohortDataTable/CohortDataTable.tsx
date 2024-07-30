"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AddCohortDialog from "../../Dialogs/CreateCohortDialog/CreateCohortDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../DropdownMenu/Base/DropdownMenu";
import { Button, buttonVariants } from "../../Inputs/Button/Button";
import { Checkbox } from "../../Inputs/Checkbox/Checkbox";
import { DataTable } from "../Base/DataTable";
import { getCohortTableData } from "./actions";

type CohortColumnT = {
  id: string;
  cohort: string;
  num_students: number;
  num_prompts: number;
};

const staticColumns: ColumnDef<CohortColumnT>[] = [
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
    accessorKey: "cohort",
    header: ({ column }) => {
      return (
        <Button
          className={buttonVariants({ variant: "tertiary" })}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cohort Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-sm font-medium text-dark-grey pl-4">
        {row.getValue("cohort")}
      </div>
    ),
  },
  {
    accessorKey: "num_students",
    header: ({ column }) => {
      return (
        <Button
          className={buttonVariants({ variant: "tertiary" })}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          # of Students
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-sm text-dark-grey pl-4">
        {row.getValue("num_students")}
      </div>
    ),
  },
  {
    accessorKey: "num_prompts",
    header: ({ column }) => {
      return (
        <Button
          className={buttonVariants({ variant: "tertiary" })}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          # of Prompts
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-sm text-dark-grey pl-4">
        {row.getValue("num_prompts")}
      </div>
    ),
  },
];

const TopRight: React.FunctionComponent = () => {
  return <AddCohortDialog />;
};

export default function CohortDataTable() {
  const [data, setData] = useState<CohortColumnT[]>([]);
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];

  useEffect(() => {
    getCohortTableData(courseSlug).then((data) => {
      setData(data);
    });
  }, [courseSlug]);

  const actionsColumn: ColumnDef<CohortColumnT> = {
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
            <DropdownMenuItem>View cohort insights</DropdownMenuItem>
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
        filterColumnName="cohort"
        topRightElement={<TopRight />}
      />
    </>
  );
}
