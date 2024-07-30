"use server";

import { cohortService, courseService } from "@/services";

export async function getCohortTableData(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);

  const cohorts = await courseService.getCohorts(courseId);

  const parsedCohortData = cohorts.map(async (cohort) => {
    const students = await cohortService.getStudents(cohort.id);
    const prompts = await cohortService.getPrompts(courseId, cohort.id);

    return {
      id: cohort.id,
      cohort: cohort.name,
      num_students: students.length,
      num_prompts: prompts.length,
    };
  });

  return Promise.all(parsedCohortData);
}
