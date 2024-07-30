"use server";

import { courseService, promptService } from "@/services";

export async function getMetrics(courseSlug: string, topic: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const totalPrompts = await promptService.getTotalByTopic(courseId, topic);
  const totalStudentsAsking = await promptService.getTotalStudentsAskingByTopic(
    courseId,
    topic
  );
  const percentageOfTotal = await promptService.getQuestionsAskingPercentage(
    courseId,
    topic
  );

  const percentageRounded = Math.round(percentageOfTotal);

  return {
    totalPrompts,
    totalStudentsAsking,
    percentageOfTotal: percentageRounded,
  };
}

export async function getUsageData(courseSlug: string, topic: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const usageData = await promptService.getUsageByTopic(courseId, topic);
  return usageData;
}
