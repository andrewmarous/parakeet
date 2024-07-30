"use client";

import { Button } from "@/app/components/Inputs/Button/Button";
import { cn, timeAgo } from "@/app/utils";
import ChatLogo from "@/assets/ChatLogo";
import { Reply as ReplyT } from "@/types";
import { Check } from "lucide-react";
import { useState } from "react";
import { FaCheck, FaRegEyeSlash } from "react-icons/fa6";

import { toast } from "@/app/hooks/useToast/useToast";
import useUpdateStore from "@/app/stores/discussionSidebar.store";
import { TbEdit } from "react-icons/tb";
import ChatContent from "../ChatContent/ChatContent";
import { TextArea } from "../Inputs/TextArea/TextArea";
import Nib from "../Nib/Nib";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../Tooltip/Tooltip";
import { approve, edit } from "./actions";

export function ParakeetReply({ reply }: { reply: ReplyT }) {
  const [replyContent, setReplyContent] = useState<string>(
    reply.markdownContent
  );
  const [optimisticApproved, setOptimisticApproved] = useState<boolean>(
    reply.isApproved
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const { updatePage, setUpdatePage } = useUpdateStore();

  const confirmEdit = async () => {
    try {
      setEditMode(false);
      setOptimisticApproved(true);
      await edit(reply.id, replyContent);
      setUpdatePage(updatePage * -1);
    } catch (error) {
      toast({
        title: "Uh oh!",
        description: "Something went wrong",
        variant: "error",
      });
    }
  };

  const approveReply = async () => {
    try {
      setOptimisticApproved(true);
      await approve(reply.id);
      setUpdatePage(updatePage * -1);
    } catch (error) {
      toast({
        title: "Uh oh!",
        description: "Something went wrong",
        variant: "error",
      });
    }
  };

  return (
    <div className={cn("rounded-lg border-grey-300 border bg-white")}>
      <div className="p-5">
        <div className="flex flex-row gap-4 items-center mb-4">
          <ChatLogo className="h-9 w-9" />
          <div className="flex flex-col">
            <div className="flex flex-row gap-6">
              <div className="flex flex-row gap-3 items-center">
                <div className="flex flex-row items-center gap-3">
                  <p className="font-medium text-grey-800">
                    {reply.posterName}
                  </p>
                  {optimisticApproved || editMode ? (
                    <></>
                  ) : (
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger>
                          <FaRegEyeSlash className="w-4 h-4 fill-grey-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Students can not view Parakeet&apos;s response until
                            you approve it.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                {!optimisticApproved && !editMode && (
                  <div className="w-px h-3/4 bg-grey-300 ml-2"></div>
                )}
                <div className="flex flex-row gap-1 items-center">
                  {!editMode && optimisticApproved ? (
                    <Nib variant="green" text="Verified by Professor" />
                  ) : !editMode ? (
                    <>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={"link"}
                              onClick={() => approveReply()}
                              className={cn(
                                "h-fit text-normal text-xs py-1 px-2 rounded-lg hover:no-underlinetext-grey-700 gap-1  hover:bg-blue-50  hover:border hover:border-blue-100 border border-white"
                              )}
                            >
                              <Check className="w-4 h-4 stroke-grey-700" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Approve this answer</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={"link"}
                              onClick={() => setEditMode(true)}
                              className={cn(
                                "h-fit text-normal text-xs py-1 px-2 rounded-lg hover:no-underlinetext-grey-700 gap-1  hover:bg-blue-50  hover:border hover:border-blue-100 border border-white"
                              )}
                            >
                              <TbEdit className="w-4 h-4 stroke-grey-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit this answer.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                {reply.isAnswer && (
                  <div className="flex flex-row gap-1 items-center px-2 py-1 bg-gradient-to-br from-green-25 to-green-50 rounded-lg border border-green-100 inset-shadow-transparent">
                    <p className="text-green-600 text-xs font-medium">Answer</p>
                    <FaCheck className="w-3 h-3 fill-green-400" />
                  </div>
                )}
              </div>
            </div>
            <p className="text-grey-600 text-xs">{timeAgo(reply.datePosted)}</p>
          </div>
        </div>
        {editMode ? (
          <div>
            <TextArea
              className="w-full text-sm h-[15rem]"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <div className="flex flex-row gap-6 mt-2">
              <Button
                variant="link"
                onClick={() => setEditMode(false)}
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
          <ChatContent content={replyContent} className="text-sm" />
        )}
      </div>
    </div>
  );
}
