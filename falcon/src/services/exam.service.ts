import db from "@/db";
import { exams } from "@/db/schema/exams.schema";
import { and, eq } from "drizzle-orm";

const examService = {
  async create(
    courseId: string,
    name: string,
    exam: JSON,
    createdBy: string,
    topics: string[]
  ) {
    const topicsString = topics.join(",");
    const [newExam] = await db
      .insert(exams)
      .values({
        name,
        courseId,
        content: exam,
        createdBy,
        topics: topicsString,
      })
      .returning();

    return newExam.id;
  },

  async get(id: string) {
    const exam = await db.query.exams.findFirst({
      where: eq(exams.id, id),
    });

    return exam;
  },

  async findByName(courseId: string, name: string) {
    const exam = await db.query.exams.findFirst({
      where: and(eq(exams.courseId, courseId), eq(exams.name, name)),
    });
    return exam;
  },
};

export default examService;
