"use server";

import { courseService } from "@/services";

export async function getCourse(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  return courseId;
}
