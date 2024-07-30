import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  AnyPgColumn,
  boolean,
  json,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { courses, discussions, users } from ".";
import { likes } from "./likes.schema";

export const replies = pgTable("replies", {
  id: uuid("id").primaryKey().defaultRandom(),
  poster: uuid("poster").references(() => users.id),
  posterName: varchar("poster_name", { length: 255 }).notNull(),
  course: uuid("course")
    .references(() => courses.id)
    .notNull(),
  datePosted: timestamp("date_posted").notNull().defaultNow(),
  discussion: uuid("discussion").references(() => discussions.id),
  isAnswer: boolean("is_answer").notNull().default(false),
  parent: uuid("parent").references((): AnyPgColumn => replies.id),
  content: json("content").notNull(),
  markdownContent: text("markdown_content").notNull(),
  isParakeet: boolean("is_parakeet").notNull().default(false),
  isApproved: boolean("is_approved").notNull().default(false),
});

export const replyRelations = relations(replies, ({ one, many }) => ({
  discussion: one(discussions, {
    fields: [replies.discussion],
    references: [discussions.id],
  }),
  poster: one(users, {
    fields: [replies.poster],
    references: [users.id],
  }),
  parent: one(replies, {
    fields: [replies.parent],
    references: [replies.id],
    relationName: "parent",
  }),
  replies: many(replies, {
    relationName: "parent",
  }),
  likes: many(likes),
}));

export type SelectReply = InferSelectModel<typeof replies>;
export type InsertReply = InferInsertModel<typeof replies>;
