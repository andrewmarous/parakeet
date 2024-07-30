import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { polls, pollType } from "./polls.schema";

export const pollStatus = pgEnum("poll_type", ["open", "closed", "waiting"]);

export const pollGroups = pgTable("polls", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  status: pollType("pollStatus").notNull(),
  topics: varchar("topics", { length: 255 }).notNull(),
});

export const pollGroupRelations = relations(pollGroups, ({ many }) => ({
  polls: many(polls),
}));

export type SelectPollGroup = InferSelectModel<typeof pollGroups>;
export type InsertPollGroup = InferInsertModel<typeof pollGroups>;
