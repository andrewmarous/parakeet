"use server";

import { courseService } from "@/services";
import mediaService, { FileEsque } from "@/services/media.service";
import { redirect } from "next/navigation";

export async function uploadContent(
  isPublic: boolean,
  courseSlug: string,
  formData: FormData
) {
  const files = formData.getAll("files") as FileEsque[];
  const courseId = await courseService.getCourseIdBySlug(courseSlug);

  const res = await mediaService.upload(files, isPublic, courseId);

  redirect(`/teacher/course/${courseSlug}/content`);
}
