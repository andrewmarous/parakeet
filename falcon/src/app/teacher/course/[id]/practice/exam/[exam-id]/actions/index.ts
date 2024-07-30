"use server";

import { examService } from "@/services";

export async function getExam(examId: string) {
  const exam = examService.get(examId);

  return exam;
}
