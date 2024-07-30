import { relations } from "drizzle-orm";
import { pgTable, uuid } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm/table";
import { studentCourses } from "./joinTables/studentCourse.schema";
import { users } from "./users.schema";

export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
});

export const studentsRelations = relations(students, ({ many, one }) => ({
  courses: many(studentCourses),
  user: one(users, {
    fields: [students.id],
    references: [users.id],
  }),
}));

export type SelectStudent = InferSelectModel<typeof students>;
export type InsertStudent = InferInsertModel<typeof students>;
