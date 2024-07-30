import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { media, prompts, studentCourses, teacherCourses } from ".";

export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  teacherCode: varchar("teacher_code", { length: 8 }).notNull(),
  studentCode: varchar("student_code", { length: 8 }).notNull(),
  slug: varchar("slug", { length: 32 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull(),
  topics: text("topics").notNull(),
});

export const courseRelations = relations(courses, ({ many }) => ({
  media: many(media),
  prompts: many(prompts),
  teachers: many(teacherCourses),
  students: many(studentCourses),
}));

export type SelectCourse = InferSelectModel<typeof courses>;
export type InsertCourse = InferInsertModel<typeof courses>;
