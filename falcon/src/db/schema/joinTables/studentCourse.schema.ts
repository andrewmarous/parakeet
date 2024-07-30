import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { courses, students } from "..";
import { cohorts } from "../cohort.schema";

export const studentCourses = pgTable(
  "student_course",
  {
    studentId: uuid("student")
      .references(() => students.id)
      .notNull(),
    courseId: uuid("course")
      .references(() => courses.id)
      .notNull(),
    cohort: uuid("cohort").references(() => cohorts.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.studentId, table.courseId] }),
    };
  }
);

export const studentCourseRelations = relations(studentCourses, ({ one }) => ({
  student: one(students, {
    fields: [studentCourses.studentId],
    references: [students.id],
  }),
  course: one(courses, {
    fields: [studentCourses.courseId],
    references: [courses.id],
  }),
  cohort: one(cohorts, {
    fields: [studentCourses.cohort],
    references: [cohorts.id],
  }),
}));

export type StudentCourse = InferSelectModel<typeof studentCourses>;
