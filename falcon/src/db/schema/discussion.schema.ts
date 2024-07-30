import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { courses, replies, users } from ".";
import { likes } from "./likes.schema";

export const discussionType = pgEnum("discussion_type", [
  "question",
  "post",
  "announcement",
]);

export const discussionVisibility = pgEnum("discussion_visibility", [
  "teachers",
  "students",
  "both",
]);

export const discussions = pgTable("discussions", {
  id: uuid("id").primaryKey().defaultRandom(),
  idx: bigint("idx", { mode: "number" }).notNull(),
  type: discussionType("type").notNull(),
  poster: uuid("poster")
    .references(() => users.id)
    .notNull(),
  posterName: varchar("poster_name", { length: 255 }).notNull(),
  course: uuid("course")
    .references(() => courses.id)
    .notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  content: json("content").notNull(),
  tag: varchar("tag", { length: 255 }),
  datePosted: timestamp("date_posted").notNull().defaultNow(),
  visibility: discussionVisibility("visibility").notNull(),
  isAnswered: boolean("is_answered").default(false).notNull(),
  isAnonymous: boolean("is_anonymous").default(false).notNull(),
  isPinned: boolean("is_pinned").default(false).notNull(),
  markdownContent: text("markdown_content").notNull(),
});

export const discussionRelations = relations(discussions, ({ one, many }) => ({
  course: one(courses, {
    fields: [discussions.course],
    references: [courses.id],
  }),
  poster: one(users, {
    fields: [discussions.poster],
    references: [users.id],
  }),
  replies: many(replies),
  likes: many(likes),
}));

export type SelectDiscussion = InferSelectModel<typeof discussions>;
export type InsertDiscussion = InferInsertModel<typeof discussions>;
