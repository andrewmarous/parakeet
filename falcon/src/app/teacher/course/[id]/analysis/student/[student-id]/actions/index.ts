"use server";

import { courseService, promptService, userService } from "@/services";

export async function getStudentAnalyticsData(
  courseSlug: string,
  studentId: string
) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const user = await userService.get(studentId);

  const getPrompts = await promptService.getPromptsByStudent(
    courseId,
    studentId
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
    studentName: user.firstName + " " + user.lastName,
    totalPrompts,
    askingTheMostAbout,
  };
}
