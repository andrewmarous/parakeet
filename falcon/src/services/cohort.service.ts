import db from "@/db";
import { cohorts, studentCourses } from "@/db/schema";
import { eq } from "drizzle-orm";
import promptService from "./prompt.service";

const cohortService = {
  async getStudents(cohortId: string) {
    const students = await db.query.studentCourses.findMany({
      where: eq(studentCourses.cohort, cohortId),
    });

    return students;
  },

  async getPrompts(courseId: string, cohortId: string) {
    const students = await this.getStudents(cohortId);

    const studentPromises = students.map((student) => {
      const prompts = promptService.getPromptsByStudent(
        courseId,
        student.studentId
      );
    });

    return Promise.all(studentPromises);
  },

  async create(courseId: string, name: string) {
    const cohortId = await db.transaction(async (tx) => {
      const [{ insertId }] = await tx
        .insert(cohorts)
        .values({ name, course: courseId })
        .returning({ insertId: cohorts.id });
      return insertId;
    });

    return cohortId;
  },
};

export default cohortService;
