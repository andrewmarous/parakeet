"use server";

import { courseService, promptService } from "@/services";

export async function getUsageData(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const usageData = await promptService.getUsageByClass(courseId);
  return usageData;
}
