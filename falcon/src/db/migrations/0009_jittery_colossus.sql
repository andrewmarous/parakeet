CREATE TABLE IF NOT EXISTS "clusters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course" uuid NOT NULL,
	"label" varchar(255) NOT NULL,
	"score" bigint NOT NULL,
	"density" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prompt_clusters" (
	"prompt" uuid NOT NULL,
	"cluster" uuid NOT NULL,
	CONSTRAINT "prompt_clusters_prompt_cluster_pk" PRIMARY KEY("prompt","cluster")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clusters" ADD CONSTRAINT "clusters_course_courses_id_fk" FOREIGN KEY ("course") REFERENCES "courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prompt_clusters" ADD CONSTRAINT "prompt_clusters_prompt_prompts_id_fk" FOREIGN KEY ("prompt") REFERENCES "prompts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prompt_clusters" ADD CONSTRAINT "prompt_clusters_cluster_clusters_id_fk" FOREIGN KEY ("cluster") REFERENCES "clusters"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
