"use client";

import { ParakeetLogo } from "@/assets";
import { LucideMessageSquareWarning } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LuBarChartBig,
  LuClipboardList,
  LuFiles,
  LuLayoutDashboard,
  LuMessageSquare,
  LuPencil,
  LuSettings,
  LuWand,
} from "react-icons/lu";
import { SidebarLink } from "../Base/Sidebar";

export default function TeacherSidebar() {
  const pathname = usePathname();
  const basePath = pathname.split("/").slice(0, 4).join("/");

  return (
    <div className="w-64 min-w-64 h-screen border-grey-200 border-r flex flex-col bg-white">
      <div className="h-16 border-b border-grey-200 w-full flex items-center px-10 flex-row gap-8">
        <Link href={"/teacher"}>
          <Image src={"/logo.svg"} alt={"logo"} width={18} height={18} />
        </Link>
      </div>
      <div className="mt-8 w-full flex flex-col px-8 grow justify-between">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="text-grey-500 font-medium text-xs">MANAGE</p>
            <SidebarLink
              href={basePath + "/dashboard"}
              label="Dashboard"
              Icon={LuLayoutDashboard}
            />
            <SidebarLink
              href={basePath + "/discussion"}
              label="Discussion"
              Icon={LuMessageSquare}
            />
            <SidebarLink
              href={basePath + "/polls"}
              label="Polls"
              Icon={LuBarChartBig}
            />
            <SidebarLink
              href={basePath + "/practice"}
              label="Study Materials"
              Icon={LuPencil}
            />
            <SidebarLink
              href={basePath + "/content"}
              label="Course Content"
              Icon={LuFiles}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-grey-500 font-medium text-xs">ANALYZE</p>
            <SidebarLink
              href={basePath + "/analysis"}
              label="Insights"
              Icon={LuWand}
            />
            <SidebarLink
              href={basePath + "/ai"}
              label="Academic Integrity"
              Icon={LucideMessageSquareWarning}
            />
            <SidebarLink
              href={basePath + "/directory"}
              label="Students"
              Icon={LuClipboardList}
            />
          </div>
        </div>
        <div className="mb-8 flex flex-col gap-2">
          <SidebarLink
            href={basePath + "/chat"}
            label="Try out chat"
            Icon={ParakeetLogo}
          />
          <SidebarLink
            href={basePath + "/settings"}
            label="Course Settings"
            Icon={LuSettings}
          />
        </div>
      </div>
    </div>
  );
}
