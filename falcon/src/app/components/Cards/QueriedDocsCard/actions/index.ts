"use server";

import { courseService, mediaService } from "@/services";

export async function getDocAccessedData(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const mediaData = await mediaService.getCourseAccessData(courseId);

  return mediaData;
}
