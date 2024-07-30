ALTER TABLE "discussions" ADD COLUMN "content" json NOT NULL;--> statement-breakpoint
ALTER TABLE "discussions" ADD COLUMN "is_public" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "discussions" ADD COLUMN "is_anonymous" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "discussions" ADD COLUMN "is_community" boolean DEFAULT false NOT NULL;