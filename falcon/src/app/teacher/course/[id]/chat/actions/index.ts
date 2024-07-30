"use server";

import { courseService, mediaService } from "@/services";

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

  return { message: data.response, sources: sources };
}

async function getCourseId(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  return courseId;
}

export { getCourseId, sendQuery };
