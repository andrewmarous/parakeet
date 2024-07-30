import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { bigint, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { courses, prompts } from ".";

export const clusters = pgTable("clusters", {
  id: uuid("id").primaryKey().defaultRandom(),
  course: uuid("course")
    .references(() => courses.id)
    .notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  score: bigint("score", { mode: "number" }).notNull(),
  density: bigint("density", { mode: "number" }).notNull(),
});

export const clusterRelations = relations(clusters, ({ many }) => ({
  prompts: many(prompts),
}));

export type SelectClusters = InferSelectModel<typeof clusters>;
export type InsertClusters = InferInsertModel<typeof clusters>;
