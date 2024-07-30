"use client";

import CourseListDropdown from "@/app/components/DropdownMenu/CourseListDropdown/CourseListDropdown";
import PracticeDropdown from "@/app/components/DropdownMenu/PracticeDropdown/PracticeDropdown";
import ProfileDropdown from "@/app/components/DropdownMenu/ProfileDropdown/ProfileDropdown";
import LinkItem from "@/app/components/LinkItem/LinkItem";
import { NavigationBar } from "@/app/components/NavigationBar/NavigationBar";
import NotificationPopover from "@/app/components/Popover/NotificationPopover/NotificationPopover";
import { cn } from "@/app/utils";
import { ChatBubbleIcon, MagicWandIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { FaPencil } from "react-icons/fa6";

export default function StudentCourseLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const basePath = pathname.split("/").slice(0, 4).join("/");

  return (
    <>
      <NavigationBar
        leftElement={
          <div className="flex flex-row gap-8 items-center">
            <Link href={"/student"} tabIndex={0}>
              <Image src={"/logo.svg"} alt={"logo"} width={18} height={18} />
            </Link>
            <div className="flex flex-row gap-2 items-center">
              <CourseListDropdown />
            </div>
          </div>
        }
        rightElement={
          <div className="flex flex-row gap-8 items-center">
            <NotificationPopover />
            <ProfileDropdown />
          </div>
        }
      />
      <NavigationBar
        className="max-h-[3.3rem] min-h-[3.3rem]"
        leftElement={
          <div className="flex flex-row gap-4 items-center">
            <LinkItem
              href={basePath}
              text={"Chat"}
              Icon={<MagicWandIcon />}
              isEqual
            />
            <LinkItem
              href={basePath + "/discussions"}
              text={"Discussions"}
              Icon={<ChatBubbleIcon />}
            />
            {/* <LinkItem
              href={basePath + "/comprehension"}
              text={"My Comprehension"}
              Icon={<BarChartIcon />}
            /> */}
            <LinkItem
              href={basePath + "/practice"}
              text={"Study Materials"}
              Icon={<FaPencil />}
            />
          </div>
        }
        rightElement={
          <div className="flex flex-row gap-5">
            <PracticeDropdown />
          </div>
        }
      />
      <main
        className={cn(
          pathname.startsWith(basePath + "/discussions") ? "p-0" : "p-12",
          "flex-col flex grow"
        )}
      >
        {children}
      </main>
    </>
  );
}
