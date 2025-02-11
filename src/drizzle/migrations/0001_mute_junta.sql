ALTER TABLE "users" ADD COLUMN "is_ligged_in" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_login" timestamp;