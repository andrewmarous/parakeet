import { InferSelectModel, relations } from "drizzle-orm";
import {
  bigint,
  json,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { students } from "..";
import { exams } from "../exams.schema";

export const studentExams = pgTable(
  "student_exams",
  {
    studentId: uuid("student")
      .references(() => students.id)
      .notNull(),
    examId: uuid("exam")
      .references(() => exams.id)
      .notNull(),
    score: bigint("score", { mode: "number" }).notNull(),
    analysis: json("analysis").notNull(),
    dateTaken: timestamp("date_taken").notNull().defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.studentId, table.examId] }),
    };
  }
);

export const studentExamRelations = relations(studentExams, ({ one }) => ({
  exam: one(exams, {
    fields: [studentExams.examId],
    references: [exams.id],
  }),
}));

export type StudentExam = InferSelectModel<typeof studentExams>;
