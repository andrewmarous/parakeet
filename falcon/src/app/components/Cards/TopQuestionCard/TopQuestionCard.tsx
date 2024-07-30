"use client";

import { ArrowUpIcon } from "@radix-ui/react-icons";
import { ArrowDownIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LuMessageSquare } from "react-icons/lu";
import Nib from "../../Nib/Nib";
import { Card } from "../Base";

export interface TopQuestionCardProps {
  rank: number;
  topic_name: string;
  num_chats: number;
  week_over_week_change: number;
}

export default function TopQuestionCard(props: TopQuestionCardProps) {
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];
  const searchParams = useSearchParams();
  const router = useRouter();
  const wowChange = Math.round(Math.abs(props.week_over_week_change))
    ? Math.round(Math.abs(props.week_over_week_change))
    : 0;

  const routeToTopicAnalysis = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("topic", props.topic_name);
    router.push(
      `/teacher/course/${courseSlug}/analysis/topic?${newSearchParams.toString()}`
    );
  };

  return (
    <Card
      className="p-2 w-full shadow-sm cursor-pointer hover:bg-grey-50 hover:border-grey-300"
      onClick={() => routeToTopicAnalysis()}
    >
      <div className="flex flex-row">
        <div className="pl-3 pr-5 py-2 border-r border-grey-200">
          <p className="font-medium">{props.rank}</p>
        </div>
        <div className="flex flex-row justify-between w-full items-center">
          <div>
            <div className="px-3 flex flex-col">
              <p className="font-medium text-sm">{props.topic_name}</p>
              <div className="flex flex-row items-center gap-1">
                <LuMessageSquare className="w-3 h-3 stroke-medium-grey" />
                <p className="text-xs text-medium-grey">
                  {props.num_chats} chats
                </p>
              </div>
            </div>
          </div>
          <Nib
            variant={props.week_over_week_change > 0 ? "green" : "red"}
            text={`${wowChange}% weekly`}
            leadIcon={
              props.week_over_week_change > 0 ? (
                <ArrowUpIcon />
              ) : (
                <ArrowDownIcon />
              )
            }
          />
        </div>
      </div>
    </Card>
  );
}
