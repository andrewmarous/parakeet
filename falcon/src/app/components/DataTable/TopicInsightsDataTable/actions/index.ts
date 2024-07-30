"use server";

import { PromptT } from "@/app/components/Cards/PromptFeedCard/PromptFeedCard";
import { courseService, promptService } from "@/services";

export async function getTopicInsightsData(courseSlug: string, topic: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const prompts = await promptService.getPromptsByTopic(courseId, topic);

  return prompts;
}

export async function getClusterInsightsData(
  courseSlug: string,
  cluster: string
) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const prompts = await promptService.getPromptsByCluster(courseId, cluster);

  return prompts;
}

export async function getPromptInteraction(promptId: string): Promise<PromptT> {
  const promptData = await promptService.getPromptById(promptId);

  const cleanedPromptData: PromptT = {
    date: promptData.created,
    question: promptData.prompt,
    id: promptData.id,
    response: promptData.response,
    studentId: promptData.studentId,
    approved: promptData.approved,
  };

  return cleanedPromptData;
}
