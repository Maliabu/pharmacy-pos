CREATE TABLE "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"date of the month" text,
	"month" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
