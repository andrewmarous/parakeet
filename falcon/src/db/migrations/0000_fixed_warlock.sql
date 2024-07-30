DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('teacher', 'student');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cohorts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"course" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teacher_code" varchar(8) NOT NULL,
	"student_code" varchar(8) NOT NULL,
	"slug" varchar(32) NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(50) NOT NULL,
	"topics" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "discussions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(32) NOT NULL,
	"poster" uuid,
	"course" uuid,
	"subject" varchar(255) NOT NULL,
	"tags" varchar(255) NOT NULL,
	"date_posted" timestamp DEFAULT now() NOT NULL,
	"retrieved" bigint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"course_id" uuid NOT NULL,
	"content" json NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"approved" boolean DEFAULT false NOT NULL,
	"topics" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(255) NOT NULL,
	"course_id" uuid NOT NULL,
	"retrieved" bigint DEFAULT 0 NOT NULL,
	"url" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"date_uploaded" timestamp DEFAULT now() NOT NULL,
	"released" timestamp DEFAULT now() NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prompts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"prompt" text NOT NULL,
	"response" text NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"analysis_complete" boolean DEFAULT false NOT NULL,
	"analysis" json,
	"topic" text DEFAULT 'Unknown' NOT NULL,
	"ai_warning" text DEFAULT 'Acceptable' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "replies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"poster" uuid,
	"course" uuid,
	"tags" varchar(255) NOT NULL,
	"date_posted" timestamp DEFAULT now() NOT NULL,
	"retrieved" bigint DEFAULT 0 NOT NULL,
	"discussion" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "students" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teachers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cuid" varchar(55) NOT NULL,
	"first_name" varchar(60) NOT NULL,
	"last_name" varchar(60) NOT NULL,
	"email" varchar(100) NOT NULL,
	"role" "role" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "student_course" (
	"student" uuid NOT NULL,
	"course" uuid NOT NULL,
	"cohort" uuid,
	CONSTRAINT "student_course_student_course_pk" PRIMARY KEY("student","course")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "student_exams" (
	"student" uuid NOT NULL,
	"exam" uuid NOT NULL,
	"score" bigint NOT NULL,
	"analysis" json NOT NULL,
	"date_taken" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "student_exams_student_exam_pk" PRIMARY KEY("student","exam")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teacher_course" (
	"teacher" uuid NOT NULL,
	"course" uuid NOT NULL,
	CONSTRAINT "teacher_course_teacher_course_pk" PRIMARY KEY("teacher","course")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "usersCuidIdx" ON "users" ("cuid");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cohorts" ADD CONSTRAINT "cohorts_course_courses_id_fk" FOREIGN KEY ("course") REFERENCES "courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "discussions" ADD CONSTRAINT "discussions_poster_users_id_fk" FOREIGN KEY ("poster") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "discussions" ADD CONSTRAINT "discussions_course_courses_id_fk" FOREIGN KEY ("course") REFERENCES "courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exams" ADD CONSTRAINT "exams_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exams" ADD CONSTRAINT "exams_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "media" ADD CONSTRAINT "media_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prompts" ADD CONSTRAINT "prompts_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prompts" ADD CONSTRAINT "prompts_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "replies" ADD CONSTRAINT "replies_poster_users_id_fk" FOREIGN KEY ("poster") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "replies" ADD CONSTRAINT "replies_course_courses_id_fk" FOREIGN KEY ("course") REFERENCES "courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "replies" ADD CONSTRAINT "replies_discussion_discussions_id_fk" FOREIGN KEY ("discussion") REFERENCES "discussions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_course" ADD CONSTRAINT "student_course_student_students_id_fk" FOREIGN KEY ("student") REFERENCES "students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_course" ADD CONSTRAINT "student_course_course_courses_id_fk" FOREIGN KEY ("course") REFERENCES "courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_course" ADD CONSTRAINT "student_course_cohort_cohorts_id_fk" FOREIGN KEY ("cohort") REFERENCES "cohorts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_exams" ADD CONSTRAINT "student_exams_student_students_id_fk" FOREIGN KEY ("student") REFERENCES "students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_exams" ADD CONSTRAINT "student_exams_exam_courses_id_fk" FOREIGN KEY ("exam") REFERENCES "courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teacher_course" ADD CONSTRAINT "teacher_course_teacher_teachers_id_fk" FOREIGN KEY ("teacher") REFERENCES "teachers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teacher_course" ADD CONSTRAINT "teacher_course_course_courses_id_fk" FOREIGN KEY ("course") REFERENCES "courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
