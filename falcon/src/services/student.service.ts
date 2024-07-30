import db from "@/db";
import {
  courses,
  InsertUser,
  studentCourses,
  students,
  users,
} from "@/db/schema";
import { NewStudent } from "@/types";
import { eq, sql } from "drizzle-orm";

const studentService = {
  async create(newStudent: NewStudent) {
    const userInfo: InsertUser = newStudent;

    const studentId = await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({ ...userInfo })
        .returning();
      const [{ insertId }] = await tx
        .insert(students)
        .values({ ...newStudent, id: user.id })
        .returning({ insertId: students.id });

      return insertId;
    });

    return studentId;
  },

  async get(id: string) {
    const student = await db.query.students.findFirst({
      where: eq(students.id, id),
    });

    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    return {
      ...user,
    };
  },

  async update() {},

  async delete() {},

  async getCourses(id: string) {
    const student = await db.query.students.findFirst({
      where: eq(students.id, id),
      with: { courses: true },
    });
    if (!student) {
      throw new Error("Student not found");
    }

    return student.courses;
  },

  async addCourse(studentId: string, courseId: string): Promise<string | null> {
    const course = await db.query.courses.findFirst({
      where: eq(courses.studentCode, courseId),
    });

    if (!course) {
      console.error("Course not found");
      return null;
    }

    try {
      const [{ courseId }] = await db
        .insert(studentCourses)
        .values({ studentId, courseId: course.id })
        .returning();
      return courseId;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async removeCourse(studentId: string, courseId: string) {
    await db
      .delete(studentCourses)
      .where(sql`student = ${studentId} AND course = ${courseId}`);

    return true;
  },
};

export default studentService;
