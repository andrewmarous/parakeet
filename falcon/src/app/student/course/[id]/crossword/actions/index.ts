"use server";

import { courseService } from "@/services";

export async function getCrosswordData(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const response = await fetch(
    `${process.env.API_URL}/courses/${courseId}/create-crossword`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topics: ["KNN", "Perceptron", "Logistic Regression"],
      }),
    }
  );

  console.log(response);

  const data = await response.json();

  console.log(data);

  return data.crossword;
}
