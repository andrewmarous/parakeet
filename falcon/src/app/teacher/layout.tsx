"use client";

import { usePathname, useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa6";
import CourseListDropdown from "../components/DropdownMenu/CourseListDropdown/CourseListDropdown";
import ProfileDropdown from "../components/DropdownMenu/ProfileDropdown/ProfileDropdown";
import { Button } from "../components/Inputs/Button/Button";
import { NavigationBar } from "../components/NavigationBar/NavigationBar";
import NotificationPopover from "../components/Popover/NotificationPopover/NotificationPopover";
import TeacherSidebar from "../components/Sidebar/TeacherSidebar/TeacherSidebar";
import { cn } from "../utils";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const basePath = pathname.split("/").slice(0, 4).join("/");

  return (
    <div className="flex flex-row w-full">
      <TeacherSidebar />
      <div className="flex flex-col w-full grow">
        <NavigationBar
          leftElement={<CourseListDropdown />}
          rightElement={
            <div className="flex flex-row gap-8 items-center">
              <Button
                variant="primary"
                onClick={() =>
                  router.push(basePath + "/discussion?create-post")
                }
              >
                Create Post <FaPlus />
              </Button>
              <NotificationPopover />
              <ProfileDropdown />
            </div>
          }
        />
        <main
          className={cn(
            "w-full h-full relative",
            pathname.startsWith(basePath + "/discussion")
              ? "p-0"
              : "p-12 overflow-y-scroll"
          )}
          style={{ maxHeight: "calc(100vh - 4rem)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
