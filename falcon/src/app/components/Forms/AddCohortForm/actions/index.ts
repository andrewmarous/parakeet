"use server";

import { cohortService, courseService } from "@/services";

export async function addCohort(courseSlug: string, name: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);

  const newCohortId = await cohortService.create(courseId, name);

  return newCohortId;
}
