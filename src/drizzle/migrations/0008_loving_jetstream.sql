CREATE TABLE "prescriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"age" text,
	"phone" text,
	"male_female" text,
	"address" text,
	"tests_done" text,
	"diagnosis" text,
	"prescription" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "prescriptions_age_unique" UNIQUE("age"),
	CONSTRAINT "prescriptions_phone_unique" UNIQUE("phone")
);
