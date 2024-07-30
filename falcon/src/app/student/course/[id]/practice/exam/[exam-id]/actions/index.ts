"use server";

import { examService } from "@/services";

export async function getExam(examId: string) {
  const exams = await examService.get(examId);

  return exams;
}
