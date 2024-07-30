import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { courses, teachers } from "..";

export const teacherCourses = pgTable(
  "teacher_course",
  {
    teacherId: uuid("teacher")
      .references(() => teachers.id)
      .notNull(),
    courseId: uuid("course")
      .references(() => courses.id)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.teacherId, table.courseId] }),
    };
  }
);

export const teacherCourseRelations = relations(teacherCourses, ({ one }) => ({
  teacher: one(teachers, {
    fields: [teacherCourses.teacherId],
    references: [teachers.id],
  }),
  course: one(courses, {
    fields: [teacherCourses.courseId],
    references: [courses.id],
  }),
}));
