"use client";

import usePromptFeedUpdateStore from "@/app/stores/promptFeed.store";
import { timeAgo } from "@/app/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { GoDotFill } from "react-icons/go";
import { Oval } from "react-loader-spinner";
import ViewPromptDialog from "../../Dialogs/ViewPromptDialog/ViewPromptDialog";
import { ScrollArea } from "../../ScrollArea/ScrollArea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../Tooltip/Tooltip";
import { Card } from "../Base";
import { getMostRecentPrompts } from "./actions";

export interface PromptT {
  date: Date;
  question: string;
  response: string;
  approved: boolean;
  studentId: string;
  id: string;
}

export default function PromptFeedCard({ maxHeight }: { maxHeight: string }) {
  const [prompts, setPrompts] = useState<PromptT[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];
  const { updatePrompts } = usePromptFeedUpdateStore();

  useEffect(() => {
    setLoading(true);
    getMostRecentPrompts(courseSlug).then((data) => {
      setPrompts(data);
    });
    setLoading(false);
  }, [courseSlug, updatePrompts]);

  return (
    <Card
      className="p-6 relative overflow-hidden"
      style={{ height: maxHeight }}
    >
      <div className="flex flex-row items-center gap-2">
        <p className="font-medium">Prompt Feed</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AiOutlineQuestionCircle className="w-4 h-4 fill-grey-600" />
            </TooltipTrigger>
            <TooltipContent className="max-w-96">
              <p className="text-grey-800">
                View a live feed of prompts coming from students.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex flex-col mt-4 w-full h-full">
        {loading ? (
          <Oval
            visible={true}
            height="54"
            width="54"
            color="#313149"
            secondaryColor="rgba(0,0,0,0)"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
          />
        ) : (
          <ScrollArea style={{ maxHeight: maxHeight }}>
            {prompts.map((prompt, idx) => (
              <div key={idx} className="flex flex-row w-full">
                <div className="w-2 flex flex-col items-center mr-8">
                  <GoDotFill className="w-5 h-5 p-0 m-0 fill-blue-500 stroke-blue-600" />
                  {idx !== prompts.length - 1 && (
                    <div className="w-[3px] h-full bg-blue-100 rounded-full"></div>
                  )}
                </div>
                <div className="w-full flex flex-col gap-2 pb-8">
                  <p className="text-sm text-dark-grey font-medium leading-none">
                    {timeAgo(prompt.date)}
                  </p>
                  <ViewPromptDialog prompt={prompt} />
                </div>
              </div>
            ))}
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}
