"use server";

import { courseService, pollService } from "@/services";

export async function getPolls(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);

  const polls = await pollService.getPolls(courseId);

  return polls;
}
