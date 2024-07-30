DO $$ BEGIN
 CREATE TYPE "discussion_visibility" AS ENUM('teachers', 'students', 'both');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "discussions" ALTER COLUMN "tag" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "discussions" ADD COLUMN "visibility" "discussion_visibility" NOT NULL;--> statement-breakpoint
ALTER TABLE "discussions" DROP COLUMN IF EXISTS "is_public";--> statement-breakpoint
ALTER TABLE "discussions" DROP COLUMN IF EXISTS "is_anonymous";--> statement-breakpoint
ALTER TABLE "discussions" DROP COLUMN IF EXISTS "is_community";