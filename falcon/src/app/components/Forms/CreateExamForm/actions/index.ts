"use server";

import { courseService, examService } from "@/services";
import { getUid } from "@/utils";
import http from "http";
import { redirect } from "next/navigation";

export async function getTopics(courseSlug: string) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const topics = await courseService.getTopics(courseId);
  return topics;
}

interface ExamData {
  topics: string[];
  examName: string;
}

const keepAliveAgent = new http.Agent({
  keepAlive: true,
});

async function fetchWithKeepAlive(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Add the agent to the options
  const fetchOptions = {
    ...options,
    agent: keepAliveAgent,
  };

  // Make the fetch request with keep-alive enabled
  const response = await fetch(url, fetchOptions);
  return response;
}

export async function createExam(courseSlug: string, formData: ExamData) {
  const courseId = await courseService.getCourseIdBySlug(courseSlug);
  const uid = await getUid();
  const { topics, examName } = formData;

  if (!topics.length) {
    return { noTopics: true };
  }

  const duplicate = await examService.findByName(courseId, examName);

  if (duplicate) {
    return { duplicateName: true };
  }

  const response = await fetchWithKeepAlive(
    `${process.env.API_URL}/courses/${courseId}/create-exam`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topics,
        exam_name: examName,
      }),
      signal: AbortSignal.timeout(600000),
    }
  );

  const data = await response.json();
  const exam = data.exam;

  const examId = await examService.create(
    courseId,
    examName,
    exam,
    uid,
    topics
  );

  redirect(`/student/course/${courseSlug}/practice/exam/${examId}`);
}
