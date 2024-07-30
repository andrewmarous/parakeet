"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LuChevronsUpDown } from "react-icons/lu";
import { Dialog, DialogTrigger } from "../../Dialogs/Base/Dialog";
import CreateExamDialogContent from "../../Dialogs/CreateExamDialog/CreateExamDialog";
import { Button } from "../../Inputs/Button/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../Base/DropdownMenu";

export default function PracticeDropdown() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];
  const router = useRouter();

  return (
    <>
      <Dialog>
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              Create New...
              <LuChevronsUpDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* <DropdownMenuItem onClick={() => router.push("/ambassador")}>
          Create study guide
        </DropdownMenuItem> */}
            <DialogTrigger asChild onClick={() => setDropdownOpen(false)}>
              <DropdownMenuItem>Review material</DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/student/course/${courseSlug}/discussions?create-post`
                )
              }
            >
              Discussion post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <CreateExamDialogContent />
      </Dialog>
    </>
  );
}
