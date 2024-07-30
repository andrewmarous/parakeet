import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { json, pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { studentCourses } from ".";

export const pollType = pgEnum("poll_type", [
  "multiple_choice",
  "open_ended",
  "rank_order",
]);

export const polls = pgTable("polls", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  type: pollType("type").notNull(),
  question: json("question").notNull(),
});

export const pollRelations = relations(polls, ({ many }) => ({
  students: many(studentCourses),
}));

export type SelectPoll = InferSelectModel<typeof polls>;
export type InsertPoll = InferInsertModel<typeof polls>;
