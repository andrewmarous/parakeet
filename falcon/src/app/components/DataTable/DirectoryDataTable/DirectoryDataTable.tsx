"use client";

import { toast } from "@/app/hooks/useToast/useToast";
import { Link2Icon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddStudentToCohort from "../../Dialogs/AddStudentToCohort/AddStudentToCohort";
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
import { getInviteCode, getStudentsInClass } from "./actions";

type StudentColumnT = {
  id: string;
  name: string;
  email: string;
  cohort: string;
};

const staticColumns: ColumnDef<StudentColumnT>[] = [
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
          Name
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
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          className={buttonVariants({ variant: "tertiary" })}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-sm text-dark-grey pl-4">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "cohort",
    header: ({ column }) => {
      return (
        <Button
          className={buttonVariants({ variant: "tertiary" })}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cohort
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-sm text-dark-grey pl-4">
        {row.getValue("cohort")}
      </div>
    ),
  },
];

const TopRight: React.FunctionComponent = () => {
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];
  const [loading, setLoading] = useState(false);

  const copyInviteCode = async () => {
    setLoading(true);
    const inviteCode = await getInviteCode(courseSlug);
    navigator.clipboard.writeText(inviteCode);
    toast({
      title: "Copied!",
      description: "Course invite code copied to clipboard.",
      variant: "success",
    });
    setLoading(false);
  };

  return (
    <Button
      variant="secondary"
      onClick={() => copyInviteCode()}
      loading={loading}
    >
      Copy invite code <Link2Icon />
    </Button>
  );
};

export default function DirectoryDataTable({ classId }: { classId: string }) {
  const [data, setData] = useState<StudentColumnT[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];
  const { push } = useRouter();

  useEffect(() => {
    setLoading(true);
    getStudentsInClass(classId).then((students) => {
      setData(students.map((student) => ({ ...student })));
    });
    setLoading(false);
  }, [classId, dialogOpen]);

  const actionsColumn: ColumnDef<StudentColumnT> = {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const student = row.original;

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
                setSelectedStudentId(student.id);
                setDialogOpen(true);
              }}
            >
              Add to cohort
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                push(
                  `/teacher/course/${courseSlug}/analysis/student/${student.id}`
                )
              }
            >
              View insights
            </DropdownMenuItem>
            {row.original.cohort === "Unassigned" ? (
              <></>
            ) : (
              <DropdownMenuItem>View cohort</DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem>Remove student</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };

  const columns = [...staticColumns, actionsColumn];

  return (
    <>
      {dialogOpen && (
        <AddStudentToCohort
          onClose={() => setDialogOpen(false)}
          open={dialogOpen}
          student={selectedStudentId!}
        />
      )}
      <DataTable
        columns={columns}
        loading={loading}
        data={data}
        filterColumnName="name"
        topRightElement={<TopRight />}
      />
    </>
  );
}
