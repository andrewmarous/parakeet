"use server";

import { courseService, discussionService } from "@/services";
import { getUid } from "@/utils";

export async function createReply(
  courseSlug: string,
  discussionSlug: string,
  content: string,
  markdownContent: string,
  parent?: string
) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const discussion = await discussionService.getDiscussionBySlug(
    courseId,
    parseInt(discussionSlug)
  );
  const uid = await getUid();

  const _ = await discussionService.createReply(
    courseId,
    discussion?.id!,
    uid,
    content,
    markdownContent,
    parent
  );
}
