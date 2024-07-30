"use server";

import { courseService, teacherService } from "@/services";
import { getUid } from "@/utils";
import { redirect } from "next/navigation";

export async function redirectToTeacherCourse() {
  const teacherId = await getUid();
  const courseId = await teacherService.getFirstCourse(teacherId);
  if (!courseId) {
    return;
  }

  const courseSlug = await courseService.getSlugById(courseId);

  redirect(`/teacher/course/${courseSlug}/dashboard`);
}
