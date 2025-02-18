CREATE TABLE "receipt" (
	"id" serial PRIMARY KEY NOT NULL,
	"user" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "receipt" ADD CONSTRAINT "receipt_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receipt" ADD CONSTRAINT "receipt_product_id_stock_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."stock"("id") ON DELETE cascade ON UPDATE no action;