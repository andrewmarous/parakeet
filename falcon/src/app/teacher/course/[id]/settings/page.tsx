"use client";

import AddCourseStaffDialog from "@/app/components/Dialogs/AddCourseStaffDialog/AddCourseStaffDialog";
import AddTopicDialog from "@/app/components/Dialogs/AddTopicDialog/AddTopicDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/DropdownMenu/Base/DropdownMenu";
import { Button, buttonVariants } from "@/app/components/Inputs/Button/Button";
import { Label } from "@/app/components/Inputs/Label/Label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/app/components/Inputs/RadioGroup/RadioGroup";
import Nib from "@/app/components/Nib/Nib";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/Tooltip/Tooltip";
import { MoreHorizontal } from "lucide-react";
import { AiOutlineQuestionCircle } from "react-icons/ai";

const mockTopicsData = [
  {
    id: 1,
    name: "Topic 1",
  },
  {
    id: 2,
    name: "Topic 2",
  },
  {
    id: 3,
    name: "Topic 3",
  },
  {
    id: 4,
    name: "Topic 4",
  },
  {
    id: 5,
    name: "Topic 5",
  },
];

const mockStaffData = [
  {
    id: 1,
    name: "John Doe",
    email: "HqQ3h@example.com",
    type: "admin",
    status: "active",
  },
  {
    id: 2,
    name: "Zack Ashen",
    email: "zach@ashen.com",
    type: "regular",
    status: "active",
  },
  {
    id: 3,
    name: "Jonathan Grossman",
    email: "jag527@cornell.edu",
    type: "regular",
    status: "pending",
  },
];

const TopicsSettings = () => {
  return (
    <div className="flex flex-col gap-4">
      {mockTopicsData.map((topic, index) => (
        <div
          key={topic.id}
          className={`flex justify-between items-center pb-4 ${index !== mockTopicsData.length - 1 ? "border-b border-grey-200" : ""}`}
        >
          <Label className="font-medium text-sm">{topic.name}</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className={`${buttonVariants({ variant: "tertiary" })} h-8 w-8 p-0`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View topic insights</DropdownMenuItem>
              <DropdownMenuItem>Delete topic</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
};

const CourseStaffSettings = () => {
  return (
    <div className="flex flex-col gap-4">
      {mockStaffData.map((staff, index) => (
        <div
          key={staff.id}
          className={`flex justify-between items-center pb-4 ${index !== mockStaffData.length - 1 ? "border-b border-grey-200" : ""}`}
        >
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              <div className="font-medium text-sm">{staff.name}</div>
              {staff.type === "admin" && <Nib text="Admin" />}
              {staff.status === "pending" && (
                <Nib variant="yellow" text="Invite pending" />
              )}
            </div>
            <div className="text-xs text-grey-500">{staff.email}</div>
          </div>
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
              // onSelect={() => ()}
              >
                Action 1
              </DropdownMenuItem>
              <DropdownMenuItem
              // onSelect={() => ()}
              >
                Action 2
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
};

const ModelSettings = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center gap-2">
        <div className="text-sm font-medium">Adjust Output Specificity</div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AiOutlineQuestionCircle className="w-4 h-4 fill-grey-600" />
            </TooltipTrigger>
            <TooltipContent className="max-w-96">
              <p className="text-xs text-grey-800"></p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <RadioGroup className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <RadioGroupItem value={"TODO: FIX"} />
          <Label className="font-normal">{"More specific"}</Label>
        </div>
        <div className="flex flex-row gap-2">
          <RadioGroupItem value={"TODO: FIX"} />
          <Label className="font-normal">{"Less specific"}</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 pb-8">
        <h3 className="font-semibold text-lg text-grey-900">Course Settings</h3>
        <div className="text-grey-500 text-sm">
          View and manage settings for your course.
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between items-center pb-4 border-b border-grey-200">
            <div>
              <div className="font-medium text-grey-700">Topics Settings</div>
              <p className="text-xs text-grey-500">
                Add, edit, or delete topics.
              </p>
            </div>
            <AddTopicDialog />
          </div>
          <TopicsSettings />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between items-center pb-4 border-b border-grey-200">
            <div>
              <div className="font-medium text-grey-700">
                Course Staff Settings
              </div>
              <p className="text-xs text-grey-500">
                Add and adjust permissions for course staff.
              </p>
            </div>
            <AddCourseStaffDialog />
          </div>
          <CourseStaffSettings />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between items-center pb-4 border-b border-grey-200">
            <div>
              <div className="font-medium text-grey-700">Model Settings</div>
              <p className="text-xs text-grey-500">
                Adjust the specificity of the generated content.
              </p>
            </div>
            <Button
              className={`${buttonVariants({ variant: "primary" })}`}
              onClick={() => {}}
              disabled
            >
              Save
            </Button>
          </div>
          <ModelSettings />
        </div>
      </div>
    </div>
  );
}
