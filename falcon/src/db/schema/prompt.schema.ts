import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  json,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { courses, students, users } from ".";

export const prompts = pgTable("prompts", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id")
    .references(() => courses.id)
    .notNull(),
  studentId: uuid("student_id")
    .references(() => students.id)
    .notNull(),
  prompt: text("prompt").notNull(),
  response: text("response").notNull(),
  created: timestamp("created").notNull().defaultNow(),
  analysisComplete: boolean("analysis_complete").notNull().default(false),
  analysis: json("analysis").$type<{
    topics: string[];
    sources: string[];
  }>(),
  topic: text("topic").notNull().default("Unknown"),
  aiWarning: text("ai_warning", { enum: ["Acceptable", "Warning", "Severe"] })
    .notNull()
    .default("Acceptable"),
  edited: boolean("edited").notNull().default(false),
  approved: boolean("approved").notNull().default(false),
});

export const promptRelation = relations(prompts, ({ one }) => ({
  course: one(courses, {
    fields: [prompts.courseId],
    references: [courses.id],
  }),
  student: one(students, {
    fields: [prompts.studentId],
    references: [students.id],
  }),
  user: one(users, {
    fields: [prompts.studentId],
    references: [users.id],
  }),
}));

export type SelectPrompt = InferSelectModel<typeof prompts>;
export type InsertPrompt = InferInsertModel<typeof prompts>;
