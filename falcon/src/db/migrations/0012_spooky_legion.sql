ALTER TABLE "discussions" ADD COLUMN "markdown_content" text NOT NULL;--> statement-breakpoint
ALTER TABLE "replies" ADD COLUMN "markdown_content" text NOT NULL;