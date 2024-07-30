"use client";

import { Button } from "@/app/components/Inputs/Button/Button";
import useUpdateStore from "@/app/stores/discussionSidebar.store";
import { cn, timeAgo } from "@/app/utils";
import { Reply as ReplyT } from "@/types";
import { ArrowUp } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { FaCheck, FaRegMessage } from "react-icons/fa6";
import CreateReplyForm from "../Forms/CreateReplyForm/CreateReplyForm";
import { likeReply } from "./actions";
const RichTextContent = dynamic(
  () =>
    import("@/app/components/Inputs/RichTextEditor").then(
      (module) => module.RichTextContent
    ),
  { ssr: false }
);

function SubReply({
  reply,
  level = 0,
  uid,
}: {
  reply: ReplyT;
  level?: number;
  uid: string;
}) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState(reply.likes.length);
  const { update, setUpdate, updatePage, setUpdatePage } = useUpdateStore();

  useEffect(() => {
    if (
      reply.likes.find(
        (like) => like.userId === uid! && like.replyId === reply.id
      )
    ) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [reply.id, reply.likes, uid]);

  const toggleLike = () => {
    setIsLiked((prevIsLiked) => {
      if (prevIsLiked) {
        return false;
      } else {
        return true;
      }
    });
    setLikeCount((prev) => {
      return prev + (isLiked ? -1 : 1);
    });
    likeReply(reply.id, isLiked).then(() => {
      setUpdate(update * -1);
    });
  };

  return (
    <div>
      <div className="ml-5 mt-4">
        <div className="w-full flex flex-row gap-6">
          <div className="flex flex-row gap-4 items-center mb-4">
            <div className="w-9 h-9 bg-gradient-to-b from-grey-300 to-grey-50 rounded-lg" />
            <div className="flex flex-col">
              <div className="flex flex-row gap-6 items-center">
                <p className="font-medium text-grey-800">{reply.posterName}</p>
                <div className="flex flex-row gap-3 items-center">
                  <Button
                    variant={"link"}
                    onClick={toggleLike}
                    className="h-fit text-normal text-xs text-grey-700 gap-1 hover:no-underline py-1 px-2 hover:bg-blue-50 rounded-lg hover:border hover:border-blue-100 border border-white"
                  >
                    {likeCount}
                    <ArrowUp className="w-4 h-4 stroke-grey-700" />
                  </Button>
                  {reply.replies && (
                    <Button
                      variant={"link"}
                      onClick={() => setShowReplyInput(true)}
                      className="h-fit text-normal text-xs text-grey-700 gap-1 hover:no-underline py-1 px-2 hover:bg-blue-50 rounded-lg hover:border hover:border-blue-100 border border-white"
                    >
                      {reply.replies.length}
                      <FaRegMessage className="fill-grey-700 w-3 h-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>

              <p className="text-grey-600 text-xs">
                {timeAgo(reply.datePosted)}
              </p>
            </div>
          </div>
        </div>

        <RichTextContent content={JSON.stringify(reply.content)} />
        {showReplyInput && (
          <div className={cn("w-full border-none mt-5")}>
            <CreateReplyForm
              parent={reply.id}
              startVisible={true}
              setIsVisible={() => setShowReplyInput(false)}
              showCancel
            />
          </div>
        )}
        {reply.replies && (
          <div className="flex flex-col gap-3 mt-4">
            {reply.replies.map((replyToReply: ReplyT) => (
              <>
                <SubReply
                  key={reply.id}
                  reply={replyToReply}
                  level={level + 1}
                  uid={uid}
                />
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Reply({ reply, uid }: { reply: ReplyT; uid: string }) {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState(reply.likes.length);
  const { update, setUpdate, updatePage, setUpdatePage } = useUpdateStore();

  useEffect(() => {
    if (
      reply.likes.find(
        (like) => like.userId === uid! && like.replyId === reply.id
      )
    ) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [reply.id, reply.likes, uid]);

  const toggleLike = () => {
    setIsLiked((prevIsLiked) => {
      if (prevIsLiked) {
        return false;
      } else {
        return true;
      }
    });
    setLikeCount((prev) => {
      return prev + (isLiked ? -1 : 1);
    });
    likeReply(reply.id, isLiked).then(() => {
      setUpdate(update * -1);
    });
  };

  return (
    <div className={cn("rounded-lg border-grey-300 border bg-white")}>
      <div className="p-5">
        <div className="flex flex-row gap-4 items-center mb-4">
          <div className="w-9 h-9 bg-gradient-to-b from-grey-300 to-grey-50 rounded-lg" />
          <div className="flex flex-col">
            <div className="flex flex-row gap-6">
              <div className="flex flex-row gap-6 items-center">
                <p className="font-medium text-grey-800">{reply.posterName}</p>
                <div className="flex flex-row gap-1 items-center">
                  <Button
                    variant={"link"}
                    onClick={toggleLike}
                    className={cn(
                      "h-fit text-normal text-xs py-1 px-2 rounded-lg hover:no-underline",
                      isLiked
                        ? "text-blue-700 gap-1 bg-blue-50  border border-blue-100"
                        : "text-grey-700 gap-1  hover:bg-blue-50  hover:border hover:border-blue-100 border border-white"
                    )}
                  >
                    {likeCount}
                    <ArrowUp className="w-4 h-4 stroke-grey-700" />
                  </Button>
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
        <RichTextContent content={JSON.stringify(reply.content)} />
        {reply.replies && (
          <div className="flex flex-col gap-3 mt-4">
            {reply.replies.map((replyToReply: ReplyT) => (
              <>
                <SubReply key={reply.id} reply={replyToReply} uid={uid} />
              </>
            ))}
          </div>
        )}
      </div>
      <div
        className={
          "w-full bg-grey-50 border-t border-grey-300 p-3 rounded-b-lg"
        }
      >
        <CreateReplyForm
          parent={reply.id}
          startVisible={false}
          showCancel={true}
        />
      </div>
    </div>
  );
}

export { Reply, SubReply };
