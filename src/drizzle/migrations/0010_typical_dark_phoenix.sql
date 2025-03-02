CREATE TABLE "report_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"date of the month" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
