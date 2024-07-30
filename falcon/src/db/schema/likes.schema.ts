import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, uuid } from "drizzle-orm/pg-core";
import { discussions } from "./discussion.schema";
import { replies } from "./replies.schema";
import { users } from "./users.schema";

export const likes = pgTable("likes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user")
    .references(() => users.id)
    .notNull(),
  replyId: uuid("reply").references(() => replies.id),
  discussionId: uuid("discussion").references(() => discussions.id),
});

export const likesRelations = relations(likes, ({ one }) => ({
  discussion: one(discussions, {
    fields: [likes.discussionId],
    references: [discussions.id],
  }),
  reply: one(replies, {
    fields: [likes.replyId],
    references: [replies.id],
  }),
}));

export type SelectLike = InferSelectModel<typeof likes>;
