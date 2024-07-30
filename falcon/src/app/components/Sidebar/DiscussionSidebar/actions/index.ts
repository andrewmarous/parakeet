"use server";

import { courseService, discussionService } from "@/services";
import { Discussion } from "@/types";

export async function getDiscussions(
  courseSlug: string
): Promise<Discussion[]> {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const discussions = await discussionService.getDiscussions(courseId);
  if (!discussions) return [];
  return discussions;
}
