ALTER TABLE "receipt_details" DROP CONSTRAINT "receipt_details_user_users_id_fk";
--> statement-breakpoint
ALTER TABLE "receipt" ADD COLUMN "user" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "receipt" ADD CONSTRAINT "receipt_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receipt_details" DROP COLUMN "user";