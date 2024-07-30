"use server";

import { courseService } from "@/services";
import { getUid } from "@/utils";

export async function getExams(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const uid = await getUid();

  const exams = await courseService.getExams(courseId);

  const filteredExams = exams.filter((exam) => exam.createdBy === uid);

  return {
    allExams: exams,
    studentExams: filteredExams,
  };
}
