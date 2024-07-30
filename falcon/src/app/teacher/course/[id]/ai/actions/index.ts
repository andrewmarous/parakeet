"use server";

import { courseService } from "@/services";

export async function getAiInsightsData(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const prompts = await courseService.getPrompts(courseId);

  return prompts;
}
