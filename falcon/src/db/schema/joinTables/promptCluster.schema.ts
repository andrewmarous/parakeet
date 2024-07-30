import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { prompts } from "..";
import { clusters } from "../clusters.schema";

export const promptClusters = pgTable(
  "prompt_clusters",
  {
    promptId: uuid("prompt")
      .references(() => prompts.id)
      .notNull(),
    clusterId: uuid("cluster")
      .references(() => clusters.id)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.promptId, table.clusterId] }),
    };
  }
);

export const promptClusterRelations = relations(promptClusters, ({ one }) => ({
  prompt: one(prompts, {
    fields: [promptClusters.promptId],
    references: [prompts.id],
  }),
  cluster: one(clusters, {
    fields: [promptClusters.clusterId],
    references: [clusters.id],
  }),
}));

export type PromptClusterSelect = InferSelectModel<typeof promptClusters>;
