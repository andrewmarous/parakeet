"use server";

import { courseService, discussionService } from "@/services";
import { getRole, getUid } from "@/utils";
import { redirect } from "next/navigation";

export async function getTopics(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const topics = await courseService.getTopics(courseId);
  return topics;
}

interface CreateDiscussionPostData {
  topic?: string;
  subject: string;
  content: string;
  visibility: "teachers" | "students" | "both";
  type: "post" | "question" | "announcement";
  isAnonymous: boolean;
  markdownContent: string;
}

export async function createPost(
  courseSlug: string,
  formData: CreateDiscussionPostData
) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const uid = await getUid();
  const role = await getRole();

  const { id, idx } = await discussionService.create(courseId, uid, {
    ...formData,
  });

  const _ = fetch(
    `${process.env.API_URL}/courses/${courseId}/discussion-prompt`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        discussion: id,
        question: formData.markdownContent,
        previous_context: [],
      }),
    }
  );

  redirect(
    `/${role.toString()}/course/${courseSlug}/discussions/${idx.toString()}`
  );
}
