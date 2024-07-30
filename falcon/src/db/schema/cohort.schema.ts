import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { courses, studentCourses } from ".";

export const cohorts = pgTable("cohorts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  course: uuid("course")
    .references(() => courses.id)
    .notNull(),
});

export const cohortRelations = relations(cohorts, ({ many }) => ({
  students: many(studentCourses),
}));

export type SelectCohort = InferSelectModel<typeof cohorts>;
export type InsertCohort = InferInsertModel<typeof cohorts>;
