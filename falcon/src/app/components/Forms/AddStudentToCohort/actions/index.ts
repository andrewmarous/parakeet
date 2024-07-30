"use server";

import { courseService } from "@/services";

export async function getCohorts(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);

  const cohorts = await courseService.getCohorts(courseId);

  return cohorts;
}

export async function getStudentCohort(courseSlug: string, student: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const cohort = await courseService.getStudentCohort(courseId, student);
  return cohort;
}

export async function addStudentToCohort(
  courseSlug: string,
  cohort: string,
  student: string
) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  await courseService.addStudentToCohort(courseId, cohort, student);
}
