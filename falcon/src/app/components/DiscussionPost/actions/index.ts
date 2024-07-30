"use server";

import { courseService, discussionService } from "@/services";
import { Discussion } from "@/types";
import { getRole, getUid } from "@/utils";
import { redirect } from "next/navigation";

interface GetDiscussionResponse {
  discussion: Discussion;
  uid: string;
}

export async function getDiscussion(
  courseSlug: string,
  discussionSlug: string
): Promise<GetDiscussionResponse | undefined> {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  try {
    const discussion = await discussionService.getDiscussionWithReplies(
      courseId,
      parseInt(discussionSlug)
    );

    const role = await getRole();

    const posterName =
      discussion.isAnonymous && role === "student"
        ? "Anonymous"
        : discussion.posterName;

    return {
      discussion: {
        ...discussion,
        posterName,
      },
      uid: await getUid(),
    };
  } catch (error) {
    console.log(error);
    const _ = await redirect(`/student/course/${courseSlug}/discussions`);
    console.log("Discussion not found");
    return undefined;
  }
}

export async function likeDiscussion(
  courseSlug: string,
  discussionSlug: string,
  isLiked: boolean
) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const uid = await getUid();
  const { id } = await discussionService.getDiscussionBySlug(
    courseId,
    parseInt(discussionSlug)
  );
  if (!isLiked) {
    const _ = await discussionService.likeDiscussion(id, uid);
  } else {
    const _ = await discussionService.unlikeDiscussion(id, uid);
  }
}
