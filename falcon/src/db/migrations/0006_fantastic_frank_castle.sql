ALTER TABLE "discussions" ADD COLUMN "poster_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "discussions" ADD COLUMN "is_anonymous" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "replies" ADD COLUMN "poster_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "replies" ADD COLUMN "is_answer" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "replies" ADD COLUMN "parent" uuid;--> statement-breakpoint
ALTER TABLE "replies" ADD COLUMN "content" json NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "replies" ADD CONSTRAINT "replies_parent_replies_id_fk" FOREIGN KEY ("parent") REFERENCES "replies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "replies" DROP COLUMN IF EXISTS "tags";