ALTER TABLE "discussions" RENAME COLUMN "retrieved" TO "likes";--> statement-breakpoint
ALTER TABLE "replies" RENAME COLUMN "retrieved" TO "likes";--> statement-breakpoint
ALTER TABLE "discussions" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "replies" ALTER COLUMN "poster" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "replies" ALTER COLUMN "course" SET NOT NULL;