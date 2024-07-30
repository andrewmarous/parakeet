import { relations } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm/table";

export const roles = pgEnum("role", ["teacher", "student"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cuid: varchar("cuid", { length: 55 }).notNull(),
    firstName: varchar("first_name", { length: 60 }).notNull(),
    lastName: varchar("last_name", { length: 60 }).notNull(),
    email: varchar("email", { length: 100 }).notNull(),
    role: roles("role").notNull(),
  },
  (users) => {
    return {
      usersCuidIdx: uniqueIndex("usersCuidIdx").on(users.cuid),
    };
  }
);

export const usersRelations = relations(users, ({ one }) => ({}));

export type SelectUser = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;
