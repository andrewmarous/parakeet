"use server";

import { courseService, promptService } from "@/services";

export async function getStudentTopicsData(
  courseSlug: string,
  studentId: string
) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const prompts = await promptService.getPromptsByStudent(courseId, studentId);

  let askingTheMostAboutMap: {
    [key: string]: number;
  } = {};
  prompts.forEach((prompt) => {
    askingTheMostAboutMap[prompt.topic] =
      (askingTheMostAboutMap[prompt.topic] || 0) + 1;
  });

  delete askingTheMostAboutMap["Unknown"];

  const data = Object.keys(askingTheMostAboutMap).map((key) => ({
    topic: key,
    num_prompts: askingTheMostAboutMap[key],
  }));

  data.sort((a, b) => b.num_prompts - a.num_prompts);
  return data;
}
