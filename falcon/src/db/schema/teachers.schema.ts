import { relations } from "drizzle-orm";
import { boolean, pgTable, uuid } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm/table";
import { teacherCourses } from ".";

export const teachers = pgTable("teachers", {
  id: uuid("id").primaryKey().defaultRandom(),
  isAdmin: boolean("is_admin").notNull().default(false),
});

export const teachersRelations = relations(teachers, ({ many, one }) => ({
  courses: many(teacherCourses),
}));

export type SelectTeacher = InferSelectModel<typeof teachers>;
export type InsertTeacher = InferInsertModel<typeof teachers>;
