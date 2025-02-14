CREATE TABLE "invoice_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "invoice" RENAME COLUMN "product_id" TO "address";--> statement-breakpoint
ALTER TABLE "invoice" RENAME COLUMN "user" TO "payment_means";--> statement-breakpoint
ALTER TABLE "invoice" RENAME COLUMN "invoice_products_id" TO "updated_at";--> statement-breakpoint
ALTER TABLE "invoice" DROP CONSTRAINT "invoice_product_id_stock_id_fk";
--> statement-breakpoint
ALTER TABLE "invoice" DROP CONSTRAINT "invoice_user_users_id_fk";
--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_invoice_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoice"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_product_id_stock_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."stock"("id") ON DELETE cascade ON UPDATE no action;