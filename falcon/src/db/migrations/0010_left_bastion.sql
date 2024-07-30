DO $$ BEGIN
 CREATE TYPE "poll_type" AS ENUM('multiple_choice', 'open_ended', 'rank_order');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "polls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"type" "poll_type" NOT NULL,
	"question" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "poll_to_groups" (
	"poll" uuid NOT NULL,
	"poll_group" uuid NOT NULL,
	CONSTRAINT "poll_to_groups_poll_poll_group_pk" PRIMARY KEY("poll","poll_group")
);
--> statement-breakpoint
ALTER TABLE "prompts" ADD COLUMN "edited" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "prompts" ADD COLUMN "approved" boolean DEFAULT false NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "poll_to_groups" ADD CONSTRAINT "poll_to_groups_poll_prompts_id_fk" FOREIGN KEY ("poll") REFERENCES "prompts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "poll_to_groups" ADD CONSTRAINT "poll_to_groups_poll_group_clusters_id_fk" FOREIGN KEY ("poll_group") REFERENCES "clusters"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
