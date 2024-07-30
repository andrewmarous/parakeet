"use server";

import { courseService, mediaService } from "@/services";

export async function getContentData(courseSlug: string, isPublic: boolean) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);

  const content = await courseService.getContent(courseId, isPublic);

  return content;
}

export async function moveTo(contentId: string, isPublic: boolean) {
  const res = await mediaService.moveTo(contentId, isPublic);
}

export async function deleteContent(contentId: string) {}
