"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import Divider from "../../Divider/Divider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../Tooltip/Tooltip";
import { Card } from "../Base";
import TopQuestionCard, {
  TopQuestionCardProps,
} from "../TopQuestionCard/TopQuestionCard";
import { getTopQuestionTopics } from "./actions";

export default function TopQuestionTopics() {
  const [data, setData] = useState<TopQuestionCardProps[]>([]);
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];

  useEffect(() => {
    getTopQuestionTopics(courseSlug).then((data) => {
      const dataSorted = data
        .sort((a, b) => b.count - a.count)
        .filter(
          (item) => item.topic !== "Unknown" && item.topic !== "Uncategorized"
        );
      setData(
        dataSorted
          .map((item, index) => ({
            topic_name: item.topic,
            num_chats: item.count,
            rank: index + 1,
            week_over_week_change:
              ((item.recentCount - item.previousCount) / item.previousCount) *
              100,
          }))
          .slice(0, 5)
      );
    });
  }, [courseSlug]);

  return (
    <Card className="p-6 flex flex-col space-between h-full gap-4 grow">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <p className="font-medium">Top Question Categories</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AiOutlineQuestionCircle className="w-4 h-4 fill-grey-600" />
              </TooltipTrigger>
              <TooltipContent className="max-w-96">
                <p className="text-grey-800">
                  Popular topics asked by students this week.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <Divider />
      <div className="flex flex-col justify-between gap-3 h-full">
        {data.map((item, idx) => (
          <TopQuestionCard
            key={idx}
            rank={item.rank}
            topic_name={item.topic_name}
            num_chats={item.num_chats}
            week_over_week_change={
              item.week_over_week_change === Infinity
                ? 100
                : item.week_over_week_change
            }
          />
        ))}
      </div>
    </Card>
  );
}
