import db from "@/db";
import { courses, teacherCourses, teachers, users } from "@/db/schema";
import { NewTeacher } from "@/types";
import { eq } from "drizzle-orm";

const teacherService = {
  async create(
    newTeacher: NewTeacher,
    courseInviteCode: string
  ): Promise<string> {
    const userInfo: NewTeacher = newTeacher;

    const teacherID = await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({ ...userInfo })
        .returning();
      const [{ insertId }] = await tx
        .insert(teachers)
        .values({ ...newTeacher, id: user.id })
        .returning({ insertId: teachers.id });
      return insertId;
    });

    await this.addCourse(teacherID, courseInviteCode);

    return teacherID;
  },

  async get() {},

  async update() {},

  async delete() {},

  async addCourse(teacherId: string, teacherCode: string) {
    const course = await db.query.courses.findFirst({
      where: eq(courses.teacherCode, teacherCode),
    });

    if (!course) {
      return null;
    }

    try {
      const [{ courseId }] = await db
        .insert(teacherCourses)
        .values({ teacherId, courseId: course.id })
        .returning();
      return courseId;
    } catch (error) {
      return null;
    }
  },

  async getFirstCourse(id: string) {
    const teacherCourse = await db.query.teacherCourses.findFirst({
      where: eq(teacherCourses.teacherId, id),
    });

    if (!teacherCourse) {
      return null;
    }

    return teacherCourse.courseId;
  },

  async getCourses(id: string) {
    const teacher = await db.query.teachers.findFirst({
      where: eq(teachers.id, id),
      with: { courses: true },
    });
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    return teacher.courses;
  },
};

export default teacherService;
