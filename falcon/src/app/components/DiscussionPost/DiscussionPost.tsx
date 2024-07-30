"use client";

import { toast } from "@/app/hooks/useToast/useToast";
import useUpdateStore from "@/app/stores/discussionSidebar.store";
import { cn, timeAgo } from "@/app/utils";
import { Discussion, Reply as ReplyT } from "@/types";
import { useUser } from "@clerk/nextjs";
import { ArrowUp } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Oval } from "react-loader-spinner";
import { Reply } from "../DiscussionReply/DiscussionReply";
import { ParakeetReply } from "../DiscussionReply/ParakeetReply";
import CreateReplyForm from "../Forms/CreateReplyForm/CreateReplyForm";
import { Button } from "../Inputs/Button/Button";
import { getDiscussion, likeDiscussion } from "./actions";
const RichTextContent = dynamic(
  () =>
    import("@/app/components/Inputs/RichTextEditor").then(
      (module) => module.RichTextContent
    ),
  { ssr: false }
);

export default function DiscussionPost() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;
  const isTeacher = useMemo(() => role === "teacher", [role]);
  const pathname = usePathname();
  const discussionSlug = pathname?.split("/")[5];
  const courseSlug = pathname?.split("/")[3];
  const [loading, setLoading] = useState(true);
  const [discussion, setDiscussion] = useState<Discussion>();
  const [replies, setReplies] = useState<ReplyT[]>([]);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [uid, setUid] = useState<string>();
  const [likeCount, setLikeCount] = useState(0);
  const router = useRouter();
  const { update, setUpdate, updatePage } = useUpdateStore();

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    setUpdate(parseInt(discussionSlug));
    try {
      getDiscussion(courseSlug, discussionSlug)
        .then((data) => {
          const discussionData = data?.discussion;
          const discussionRepliesFiltered = discussionData?.replies?.filter(
            (reply) =>
              !reply.isParakeet ||
              (reply.isParakeet && (reply.isApproved || isTeacher))
          );

          setReplies(discussionRepliesFiltered!);
          setUid(data?.uid);

          setDiscussion(discussionData);
          if (discussionData === undefined) {
            return discussionData;
          }

          if (
            discussionData.likes.find(
              (like) =>
                like.userId === data?.uid! &&
                like.discussionId === discussionData.id
            )
          ) {
            setIsLiked(true);
          } else {
            setIsLiked(false);
          }
          setLikeCount(discussionData.likes.length);

          return data;
        })
        .then((data) => {
          if (data === undefined) {
            router.push(`/student/course/${courseSlug}/discussions`);
          } else {
            setLoading(false);
          }
        });
    } catch (error) {
      toast({
        variant: "error",
        title: "Uh oh!",
        description: "An error occurred while getting this discussion.",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSlug, discussionSlug, router, setUpdate, update]);

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
    likeDiscussion(courseSlug, discussionSlug, isLiked).then(() => {
      setUpdate(update * -1);
    });
  };

  return loading ? (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
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
    </div>
  ) : (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between w-full items-start">
          <h3 className="font-medium text-xl">{discussion?.subject}</h3>
          <Button
            variant="tertiary"
            onClick={toggleLike}
            className={cn(isLiked && "bg-blue-50 text-blue-600")}
          >
            <p className="text-sm font-medium text-grey-700">{likeCount}</p>
            <ArrowUp
              className={cn(
                "w-5 h-5",
                isLiked ? "stroke-blue-700" : "stroke-grey-700"
              )}
            />
          </Button>
        </div>
        <div className="flex flex-row gap-2 justify-between items-center">
          <p className="text-[0.7rem] font-medium text-grey-500">
            {timeAgo(discussion?.datePosted!)} by {discussion?.posterName}
          </p>
        </div>
      </div>
      <div className="mt-8">
        <div className="bg-white p-5 rounded-lg border-blue-200 border">
          <div className="flex flex-row gap-4 items-center mb-4">
            <div className="w-9 h-9 bg-gradient-to-b from-grey-300 to-grey-50 rounded-lg" />
            <div className="flex flex-col">
              <p className="font-medium text-grey-800">
                {discussion?.posterName}
              </p>
              <p className="text-grey-600 text-xs">
                {timeAgo(discussion?.datePosted!)}
              </p>
            </div>
          </div>
          <RichTextContent content={JSON.stringify(discussion?.content!)} />
        </div>
        {replies.length! > 0 && (
          <div className="mt-8">
            <p className="font-medium text-grey-800 mb-4">
              {(() => {
                const text =
                  discussion?.type === "question" ? "Answer" : "Comment";

                return (
                  <>
                    {replies.length === 1
                      ? `1 ${text}`
                      : `${replies.length} ${text}s`}
                  </>
                );
              })()}
            </p>
            <div className="flex flex-col gap-6">
              {replies.map((reply: ReplyT) =>
                reply.isParakeet ? (
                  <ParakeetReply key={reply.id} reply={reply} />
                ) : (
                  <Reply key={reply.id} reply={reply} uid={uid!} />
                )
              )}
            </div>
          </div>
        )}
        <div className="my-8 w-full h-[1px] bg-grey-200" />
        <div className="w-full">
          <p className="font-medium text-grey-800 mb-4">Your Reply</p>
          <CreateReplyForm />
        </div>
      </div>
    </>
  );
}
