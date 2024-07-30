DO $$ BEGIN
 CREATE TYPE "discussion_type" AS ENUM('question', 'post', 'announcement');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "discussions" RENAME COLUMN "slug" TO "idx";--> statement-breakpoint
ALTER TABLE "discussions" RENAME COLUMN "tags" TO "tag";--> statement-breakpoint
ALTER TABLE "discussions" ALTER COLUMN "idx" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "discussions" ADD COLUMN "type" "discussion_type";--> statement-breakpoint
ALTER TABLE "discussions" ADD COLUMN "is_answered" boolean DEFAULT false NOT NULL;