"use server";

import { courseService } from "@/services";

export async function getPracticeData(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const practiceData = await courseService.getExams(courseId);
  return practiceData;
}
