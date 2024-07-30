import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  cohortRelations,
  cohorts,
  courseRelations,
  courses,
  discussionRelations,
  discussions,
  discussionType,
  media,
  mediaRelations,
  promptRelation,
  prompts,
  replies,
  replyRelations,
  studentCourseRelations,
  studentCourses,
  students,
  studentsRelations,
  teacherCourseRelations,
  teacherCourses,
  teachers,
  teachersRelations,
  users,
} from "./schema";
import { clusterRelations, clusters } from "./schema/clusters.schema";
import { examRelations, exams } from "./schema/exams.schema";
import {
  studentExamRelations,
  studentExams,
} from "./schema/joinTables/studentExams.schema";
import { likes, likesRelations } from "./schema/likes.schema";

const sql = postgres(process.env.DB_URL!, { ssl: "require" });
const db = drizzle(sql, {
  schema: {
    users,
    teachers,
    students,
    studentsRelations,
    teacherCourseRelations,
    courses,
    studentCourses,
    studentCourseRelations,
    prompts,
    promptRelation,
    media,
    mediaRelations,
    teacherCourses,
    teachersRelations,
    courseRelations,
    cohorts,
    cohortRelations,
    exams,
    examRelations,
    studentExams,
    studentExamRelations,
    discussionType,
    discussions,
    discussionRelations,
    replies,
    replyRelations,
    likes,
    likesRelations,
    clusterRelations,
    clusters,
  },
});

export default db;
