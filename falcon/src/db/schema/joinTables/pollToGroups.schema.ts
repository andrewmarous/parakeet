import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { prompts } from "..";
import { clusters } from "../clusters.schema";

export const pollToGroups = pgTable(
  "poll_to_groups",
  {
    pollId: uuid("poll")
      .references(() => prompts.id)
      .notNull(),
    groupId: uuid("poll_group")
      .references(() => clusters.id)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.pollId, table.groupId] }),
    };
  }
);

export const pollGroupsRelations = relations(pollToGroups, ({ one }) => ({}));

export type PromptClusterSelect = InferSelectModel<typeof pollToGroups>;
