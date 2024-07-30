"use server";

import { PromptT } from "@/app/components/Cards/PromptFeedCard/PromptFeedCard";
import { courseService, promptService } from "@/services";

export async function getAiInsightsData(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const prompts = await courseService.getPrompts(courseId);

  const filteredPrompts = prompts.filter(
    (prompt) => prompt.prompts!.aiWarning !== "Acceptable"
  );

  return filteredPrompts;
}

export async function getPromptInteraction(promptId: string): Promise<PromptT> {
  const promptData = await promptService.getPromptById(promptId);

  const cleanedPromptData: PromptT = {
    date: promptData.created,
    question: promptData.prompt,
    id: promptData.id,
    response: promptData.response,
    studentId: promptData.studentId,
  };

  return cleanedPromptData;
}
