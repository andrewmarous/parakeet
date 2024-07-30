"use server";

import { courseService, mediaService, promptService } from "@/services";
import { NewPrompt } from "@/types/prompt.types";
import { getUid } from "@/utils";

interface QueryResponse {
  message: string;
  sources: { name: string; url: string; page: number }[];
}

async function sendQuery(
  prompt: string,
  courseId: string
): Promise<QueryResponse> {
  const response = await fetch(
    `${process.env.API_URL}/courses/${courseId}/prompt`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: prompt,
        previous_context: [],
      }),
    }
  );

  const data = await response.json();

  const pageMap: { [key: string]: number } = {};

  const retrieved = data.sources.map((source: any) => {
    if (pageMap[source.metadata.source.split("/").pop()] === undefined) {
      pageMap[source.metadata.source.split("/").pop()] = source.metadata.page;
    }
    return source.metadata.source.split("/").pop();
  });

  const media = await mediaService.getManyByKeys(retrieved);

  const sources = media.map((media) => {
    return {
      name: media.name,
      url: media.url,
      page: pageMap[media.key] ? pageMap[media.key] : 0,
    };
  });

  const uid: string = await getUid();

  const newPromptObj: NewPrompt = {
    studentId: uid,
    courseId: courseId,
    prompt: prompt,
    response: data.response,
    analysis: {
      sources: media.map((mediaItem) => mediaItem.id),
      topics: [],
    },
  };

  promptService.addPrompt(newPromptObj);

  return { message: data.response, sources: sources };
}

async function getCourseId(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  return courseId;
}

export { getCourseId, sendQuery };
