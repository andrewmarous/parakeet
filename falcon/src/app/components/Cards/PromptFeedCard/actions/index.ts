"use server";

import { courseService } from "@/services";

export async function getMostRecentPrompts(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const prompts = await courseService.getRecentPrompts(courseId);
  return prompts.map((prompt) => ({
    date: prompt.created,
    question: prompt.prompt,
    id: prompt.id,
    response: prompt.response,
    studentId: prompt.studentId,
    approved: prompt.approved,
  }));
}
