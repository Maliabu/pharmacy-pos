CREATE TABLE "receipt_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"receipt_id" integer NOT NULL,
	"user" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "receipt" DROP CONSTRAINT "receipt_user_users_id_fk";
--> statement-breakpoint
ALTER TABLE "receipt" DROP CONSTRAINT "receipt_product_id_stock_id_fk";
--> statement-breakpoint
ALTER TABLE "receipt_details" ADD CONSTRAINT "receipt_details_receipt_id_receipt_id_fk" FOREIGN KEY ("receipt_id") REFERENCES "public"."receipt"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receipt_details" ADD CONSTRAINT "receipt_details_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receipt_details" ADD CONSTRAINT "receipt_details_product_id_stock_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."stock"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receipt" DROP COLUMN "user";--> statement-breakpoint
ALTER TABLE "receipt" DROP COLUMN "product_id";--> statement-breakpoint
ALTER TABLE "receipt" DROP COLUMN "quantity";--> statement-breakpoint
ALTER TABLE "receipt" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "receipt" DROP COLUMN "updated_at";