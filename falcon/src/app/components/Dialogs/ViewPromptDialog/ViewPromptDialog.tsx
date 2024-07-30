"use client";

import { BsStars } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { PiChatCenteredText } from "react-icons/pi";
import { PromptT } from "../../Cards/PromptFeedCard/PromptFeedCard";
import IconBubble from "../../IconBubble/IconBubble";
import { ScrollArea } from "../../ScrollArea/ScrollArea";

import { DialogClose } from "@radix-ui/react-dialog";
import { usePathname, useRouter } from "next/navigation";
import { FaArrowRight, FaCheck } from "react-icons/fa6";
import { TbEdit } from "react-icons/tb";

import { toast } from "@/app/hooks/useToast/useToast";
import usePromptFeedUpdateStore from "@/app/stores/promptFeed.store";
import { useState } from "react";
import ChatContent from "../../ChatContent/ChatContent";
import { Button } from "../../Inputs/Button/Button";
import { TextArea } from "../../Inputs/TextArea/TextArea";
import Nib from "../../Nib/Nib";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../Tooltip/Tooltip";
import { Dialog, DialogContent, DialogTrigger } from "../Base/Dialog";
import { editResponse, verify } from "./actions";

export function ViewPromptDialogContent({
  prompt,
  showCTA,
}: {
  prompt: PromptT;
  showCTA: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const courseSlug = pathname?.split("/")[3];
  const [isEditting, setIsEditting] = useState(false);
  const [verifyOptimistic, setVerifyOptimistic] = useState<boolean>(
    prompt.approved
  );
  const [response, setResponse] = useState(prompt.response);
  const { updatePrompts, setUpdatePrompts } = usePromptFeedUpdateStore();

  const verifyResponse = async () => {
    try {
      setVerifyOptimistic(true);
      await verify(prompt.id);
      setUpdatePrompts(!updatePrompts);
    } catch (error) {
      toast({
        title: "Uh oh!",
        description: "Something went wrong",
        variant: "error",
      });
    }
  };

  const confirmEdit = async () => {
    try {
      setIsEditting(false);
      setVerifyOptimistic(true);
      await editResponse(prompt.id, response);
      setUpdatePrompts(!updatePrompts);
    } catch (error) {
      toast({
        title: "Uh oh!",
        description: "Something went wrong",
        variant: "error",
      });
    }
  };

  return (
    <DialogContent className="min-w-[50rem]">
      <div className="flex flex-row items-center gap-4">
        <div>
          <IconBubble Icon={PiChatCenteredText} size="md" />
        </div>
        <div className="mt-1 font-semibold text-lg">
          <h3>Prompt Interaction</h3>
          <p className="font-normal text-sm text-grey-600">
            View this student&apos;s interaction with Parakeet.
          </p>
        </div>
      </div>
      <ScrollArea className="mt-4 max-h-[24rem]">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-4">
            <div className="max-w-5 min-w-5 flex flex-col items-center mr-2">
              <GoDotFill className="w-5 h-5 p-0 m-0 fill-blue-500 stroke-blue-600" />
              <div className="w-[3px] h-full bg-blue-100 rounded-full"></div>
            </div>
            <div className="pb-5">
              <p className="text-sm font-medium text-grey-800 mb-1">Question</p>
              <p className="text-sm text-grey-800 leading-6">
                {prompt.question}
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div className="max-w-5 min-w-5 flex flex-col items-center mr-2">
              <BsStars className="w-5 h-5 p-0 m-0 fill-blue-500 stroke-blue-600" />
            </div>
            <div className="w-full">
              <div className="w-full flex flex-row items-center gap-4 mb-2">
                <p className="text-sm font-medium text-grey-800">Response</p>
                {!isEditting && !prompt.approved && !verifyOptimistic ? (
                  <div className="flex flex-row gap-3">
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="link"
                            onClick={() => setIsEditting(true)}
                            className="p-0 h-fit"
                          >
                            <TbEdit className="w-4 h-4 stroke-grey-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit response text.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="link"
                            onClick={() => verifyResponse()}
                            className="p-0 h-fit"
                          >
                            <FaCheck className="w-4 h-4 fill-grey-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Verify this response.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : prompt.approved || verifyOptimistic ? (
                  <div>
                    <Nib variant="green" text="Verified" />
                  </div>
                ) : (
                  <></>
                )}
              </div>
              {isEditting ? (
                <div>
                  <TextArea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="w-full h-[10rem]"
                  />

                  <div className="flex flex-row gap-6 mt-2">
                    <Button
                      variant="link"
                      onClick={() => setIsEditting(false)}
                      className="p-0 h-fit text-grey-700 hover:no-underline"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => confirmEdit()}
                      className="p-0 h-fit text-blue-500 hover:no-underline"
                    >
                      Confirm Edit <FaCheck />
                    </Button>
                  </div>
                </div>
              ) : (
                <ChatContent content={response} className="w-full prose-sm" />
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="flex flex-row justify-end mt-4 gap-6">
        <DialogClose asChild>
          <Button variant="secondary">Close</Button>
        </DialogClose>
        {showCTA && (
          <Button
            variant="primary"
            onClick={() =>
              router.push(
                `/teacher/course/${courseSlug}/analysis/student/${prompt.studentId}`
              )
            }
          >
            View Student <FaArrowRight />
          </Button>
        )}
      </div>
    </DialogContent>
  );
}

export default function ViewPromptDialog({
  prompt,
  onClose,
  isNested,
  showCTA = true,
}: {
  showCTA?: boolean;
  prompt: PromptT;
  onClose?: () => void;
  isNested?: boolean;
}) {
  return isNested ? (
    <Dialog open={Boolean(prompt)} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <div className="bg-white py-3 px-4 rounded-tl-lg rounded-tr-lg rounded-br-lg border-grey-200 border shadow-sm overflow-hidden max-w-full hover:bg-grey-25 cursor-pointer hover:border-grey-300">
          <p className="text-sm text-dark-grey font-normal line-clamp-1">
            {prompt.question}
          </p>
        </div>
      </DialogTrigger>
      <ViewPromptDialogContent prompt={prompt} showCTA={showCTA} />
    </Dialog>
  ) : (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-white py-3 px-4 rounded-tl-lg rounded-tr-lg rounded-br-lg border-grey-200 border shadow-sm overflow-hidden max-w-full hover:bg-grey-25 cursor-pointer hover:border-grey-300">
          <p className="text-sm text-dark-grey font-normal line-clamp-1">
            {prompt.question}
          </p>
        </div>
      </DialogTrigger>
      <ViewPromptDialogContent prompt={prompt} showCTA={showCTA} />
    </Dialog>
  );
}
