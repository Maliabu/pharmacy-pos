ALTER TABLE "receipt" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "receipt" ADD COLUMN "updated_at" timestamp;