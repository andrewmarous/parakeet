"use server";

import { courseService } from "@/services";

export async function getQuestionCategories(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const categories = await courseService.getCourseCategories(courseId);

  const filteredCategories = categories.filter((category) => {
    return category.topic !== "Unknown";
  });

  let totalQuestions = filteredCategories.reduce(
    (acc, category) => acc + category.count,
    0
  );

  return {
    categories: filteredCategories,
    totalQuestions,
  };
}
