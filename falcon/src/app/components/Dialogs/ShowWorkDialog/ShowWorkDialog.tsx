"use client";

import { PiChatCenteredText } from "react-icons/pi";
import IconBubble from "../../IconBubble/IconBubble";
import { ScrollArea } from "../../ScrollArea/ScrollArea";

import ChatContent from "../../ChatContent/ChatContent";
import { Dialog, DialogContent, DialogTrigger } from "../Base/Dialog";

export default function ShowWorkDialog({
  explanation,
  correctAnswer,
}: {
  explanation: string;
  correctAnswer: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="text-sm text-blue-500 font-medium line-clamp-1 cursor-pointer hover:underline">
          Read explanation
        </p>
      </DialogTrigger>
      <DialogContent className="min-w-[50rem]">
        <div className="flex flex-row items-center gap-4">
          <div>
            <IconBubble Icon={PiChatCenteredText} size="md" />
          </div>
          <div className="mt-1 font-semibold text-lg">
            <h3>Explanation</h3>
            <p className="font-normal text-sm text-grey-600">
              Understand the work behind this question.
            </p>
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <p className="text-grey-800 text-sm">The correct answer was: </p>
          <p className="text-grey-800 font-medium mt-1">{correctAnswer}</p>
        </div>
        <ScrollArea className="mt-4 max-h-[24rem]">
          <p className="text-grey-800 text-sm font-medium">Explanation: </p>
          <ChatContent content={explanation} className="w-full prose-sm" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
