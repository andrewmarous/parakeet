ALTER TABLE "student_exams" DROP CONSTRAINT "student_exams_exam_courses_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_exams" ADD CONSTRAINT "student_exams_exam_exams_id_fk" FOREIGN KEY ("exam") REFERENCES "exams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
