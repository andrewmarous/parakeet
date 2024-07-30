"use server";

import { courseService, promptService } from "@/services";

async function getCohortData(courseSlug: string, cohortId: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const cohorts = await courseService.getCohorts(courseId);
  const cohort = cohorts.find((cohort) => cohort.id === cohortId);
  if (!cohort) {
    throw new Error("Cohort not found");
  }
  const students = await courseService.getCohortStudents(courseId, cohortId);

  const studentIds = students.map((student) => student.studentId);

  const getPrompts = await promptService.getPromptsByCohort(
    courseId,
    studentIds
  );

  const totalPrompts = getPrompts.length;
  let askingTheMostAboutMap: {
    [key: string]: number;
  } = {};

  getPrompts.forEach((prompt) => {
    askingTheMostAboutMap[prompt.topic] =
      (askingTheMostAboutMap[prompt.topic] || 0) + 1;
  });

  delete askingTheMostAboutMap["Unknown"];

  const askingTheMostAbout = Object.keys(askingTheMostAboutMap).reduce(
    (a, b) => {
      return askingTheMostAboutMap[a] > askingTheMostAboutMap[b] ? a : b;
    }
  );

  return {
    cohortName: cohort.name,
    totalPrompts,
    askingTheMostAbout,
    numberOfStudents: studentIds.length,
  };
}

export default getCohortData;
