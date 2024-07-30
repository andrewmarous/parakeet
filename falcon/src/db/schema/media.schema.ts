import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm/table";
import { courses } from ".";

export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key", { length: 255 }).notNull(),
  course: uuid("course_id")
    .references(() => courses.id)
    .notNull(),
  retrieved: bigint("retrieved", { mode: "number" }).notNull().default(0),
  url: varchar("url", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  dateUploaded: timestamp("date_uploaded").notNull().defaultNow(),
  released: timestamp("released").notNull().defaultNow(),
  isPublic: boolean("is_public").notNull().default(true),
});

export const mediaRelations = relations(media, ({ one }) => ({
  course: one(courses, {
    fields: [media.course],
    references: [courses.id],
  }),
}));

export type SelectMedia = InferSelectModel<typeof media>;
export type InsertMedia = InferInsertModel<typeof media>;
