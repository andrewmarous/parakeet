"use server";

"use server";

import { courseService } from "@/services";
import { getUid } from "@/utils";

export async function getTopicTableData(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const topicData = await courseService.getCourseCategories(courseId);
  return topicData;
}

export async function getQuestionCategories(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const studentId = await getUid();
  const categories = await courseService.getCourseCategories(
    courseId,
    studentId
  );

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
