"use server";

import { courseService } from "@/services";

export async function getTopQuestionTopics(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const topics = await courseService.getCourseCategories(courseId);

  return topics;
}
