"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/Tabs/Tabs";
import { cn, timeAgo } from "@/app/utils";
import { Discussion, RoleT } from "@/types";
import { usePathname, useRouter } from "next/navigation";

import { FaBullhorn, FaQuestion } from "react-icons/fa6";

import useUpdateStore from "@/app/stores/discussionSidebar.store";
import { useUser } from "@clerk/nextjs";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { FaRegMessage } from "react-icons/fa6";
import { TextInput } from "../../Inputs/TextInput/TextInput";
import { getDiscussions } from "./actions";

function DiscussionItem({ discussion }: { discussion: Discussion }) {
  const pathname = usePathname();
  const discussionSlug = pathname?.split("/")[5];
  const basePath = pathname.split("/").slice(0, 5).join("/");
  const { user } = useUser();
  const role = user?.publicMetadata?.role as RoleT;
  const posterName =
    discussion.isAnonymous && role === "student"
      ? "Anonymous"
      : discussion.posterName;
  const router = useRouter();
  return (
    <div
      className={cn(
        "w-full cursor-pointer flex flex-col justify-between gap-1 px-3 py-3 rounded-lg border border-white",
        discussionSlug === discussion.idx.toString()
          ? "bg-gradient-to-br from-blue-50 to-blue-100 inset-shadow-transparent border border-blue-100 "
          : "hover:bg-grey-100"
      )}
      onClick={() => {
        router.push(`${basePath}/${discussion.idx.toString()}`);
      }}
    >
      <div className="flex flex-row gap-2 items-center">
        {discussion.type === "question" ? (
          <FaQuestion className="w-3 h-3 fill-grey-600" />
        ) : discussion.type === "post" ? (
          <FaRegMessage className="w-3 h-3 fill-grey-600" />
        ) : (
          <FaBullhorn className="w-3 h-3 fill-grey-600" />
        )}
        <p className="text-sm font-medium truncate text-grey-700 shrink leading-0">
          {discussion.subject}
        </p>
      </div>
      <div className="flex flex-row gap-1 justify-between items-center">
        <p className="text-[0.7rem] font-medium text-grey-500">
          {timeAgo(discussion.datePosted)} by {posterName}
        </p>
        <div className="flex flex-row gap-2">
          <div className="flex flex-row gap-1 items-center">
            <p className="text-[0.7rem] font-medium text-grey-500">
              {discussion.likes.length}
            </p>
            <ArrowUp className="w-3 h-3 stroke-grey-500" />
          </div>
          <div className="flex flex-row gap-1 items-center">
            <p className="text-[0.7rem] font-medium text-grey-500">
              {discussion.replies!.length}
            </p>
            <FaRegMessage className="w-3 h-3 fill-grey-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscussionList({ discussions }: { discussions: Discussion[] }) {
  return discussions.length === 0 ? (
    <p className="px-3 py-2 bg-grey-100 border border-grey-200 rounded-lg font-medium text-grey-700 text-center w-fit mx-auto inset-shadow-transparent text-sm">
      No Posts
    </p>
  ) : (
    discussions.map((discussion, idx) => (
      <DiscussionItem key={idx} discussion={discussion} />
    ))
  );
}

export default function DiscussionSidebar() {
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];
  const isTeacher = pathname?.split("/")[1] === "teacher";
  const [searchValue, setSearchValue] = useState("");
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [displayedDiscussions, setDisplayedDiscussions] = useState<
    Discussion[]
  >([]);
  const { update } = useUpdateStore();

  useEffect(() => {
    getDiscussions(courseSlug).then((data) => {
      setDiscussions(data);
      setDisplayedDiscussions(data);
    });
  }, [courseSlug, update]);

  const searchDiscussion = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const value = event.target.value;
    setSearchValue(value);
    if (value === "") {
      setDisplayedDiscussions(discussions);
    } else {
      const filteredDiscussions = discussions.filter((discussion) =>
        discussion.subject.toLowerCase().includes(value.toLowerCase())
      );
      setDisplayedDiscussions(filteredDiscussions);
    }
  };

  return (
    <div
      className="w-[21rem] min-w-[21rem] border-grey-200 border-r flex flex-col bg-white overflow-y-scroll"
      style={
        isTeacher
          ? {
              height: "calc(100vh - 4rem)",
              maxHeight: "calc(100vh - 4rem)",
            }
          : {
              height: "calc(100vh - 7.3rem)",
              maxHeight: "calc(100vh - 7.3rem)",
            }
      }
    >
      {isTeacher ? (
        <>
          <div className="h-fit border-b border-grey-200 w-full flex items-center px-4 py-4 flex-col gap-3">
            <TextInput
              placeholder="Search"
              value={searchValue}
              onChange={searchDiscussion}
            />
          </div>
          <div className="mt-4 px-4 w-full flex flex-col gap-3 grow">
            <DiscussionList discussions={displayedDiscussions} />
          </div>
        </>
      ) : (
        <Tabs defaultValue="everyone">
          <div className="h-fit border-b border-grey-200 w-full flex items-center px-4 py-4 flex-col gap-3">
            <TextInput
              placeholder="Search"
              value={searchValue}
              onChange={searchDiscussion}
            />
            <TabsList className="grid grid-cols-2 gap-3 w-full">
              <TabsTrigger value="everyone">Everyone</TabsTrigger>
              <TabsTrigger value="student">Students</TabsTrigger>
            </TabsList>
          </div>
          <div className="mt-4">
            <TabsContent
              value="everyone"
              className="w-full flex flex-col px-4 gap-3 grow"
            >
              <DiscussionList discussions={displayedDiscussions} />
            </TabsContent>
            <TabsContent
              value="student"
              className="w-full flex flex-col px-4 gap-3 grow mt-0"
            >
              <DiscussionList
                discussions={displayedDiscussions.filter(
                  (d) => d.visibility === "students"
                )}
              />
            </TabsContent>
          </div>
        </Tabs>
      )}
    </div>
  );
}
