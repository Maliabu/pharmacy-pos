ALTER TABLE "invoice_items" ALTER COLUMN "total_amount" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "invoice_items" ALTER COLUMN "total_amount" SET NOT NULL;