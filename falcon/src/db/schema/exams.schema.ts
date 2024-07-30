import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  json,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { courses, users } from ".";

export const exams = pgTable("exams", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  courseId: uuid("course_id")
    .references(() => courses.id)
    .notNull(),
  content: json("content").notNull(),
  created: timestamp("created").notNull().defaultNow(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  approved: boolean("approved").notNull().default(false),
  topics: text("topics").notNull(),
});

export const examRelations = relations(exams, ({ one }) => ({
  course: one(courses, {
    fields: [exams.courseId],
    references: [courses.id],
  }),
}));

export type SelectExam = InferSelectModel<typeof exams>;
export type InsertExam = InferInsertModel<typeof exams>;
