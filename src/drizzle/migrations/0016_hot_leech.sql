ALTER TABLE "stock" ALTER COLUMN "status" SET DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "stock" ALTER COLUMN "status" DROP NOT NULL;