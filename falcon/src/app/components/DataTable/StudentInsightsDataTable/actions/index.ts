"use server";

import { courseService, promptService } from "@/services";

export async function getStudentInsights(
  courseSlug: string,
  studentId: string
) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const prompts = await promptService.getPromptsByStudent(courseId, studentId);

  return prompts;
}
