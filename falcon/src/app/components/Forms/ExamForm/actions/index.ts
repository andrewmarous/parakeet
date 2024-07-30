"use server";

import db from "@/db";
import { studentExams } from "@/db/schema/joinTables/studentExams.schema";
import { getUid } from "@/utils";

interface Answer {
  isCorrect: boolean;
  responded: string;
  topic: string;
  correctAnswer: string;
}

export async function addStudentScore(
  examId: string,
  answers: Answer[],
  score: number
) {
  const studentId = await getUid();
  const _ = await db
    .insert(studentExams)
    .values({
      studentId,
      examId,
      score,
      analysis: JSON.stringify(answers),
    })
    .onConflictDoNothing();
}
