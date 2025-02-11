CREATE TABLE "bills" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"link" varchar,
	"currency_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "currency_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"currency_code" text NOT NULL,
	"currency_name" text NOT NULL,
	"name" text NOT NULL,
	"country_code" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendor" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" integer,
	"profile_picture" varchar,
	"address" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"token" text NOT NULL,
	"decInitVector" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "vendor_email_unique" UNIQUE("email"),
	CONSTRAINT "vendor_phone_unique" UNIQUE("phone"),
	CONSTRAINT "vendor_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "stock" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"supplier" integer,
	"vendor" integer,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"currency_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"units" integer NOT NULL,
	"unit" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" integer,
	"profile_picture" varchar,
	"address" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"token" text NOT NULL,
	"decInitVector" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "supplier_email_unique" UNIQUE("email"),
	CONSTRAINT "supplier_phone_unique" UNIQUE("phone"),
	CONSTRAINT "supplier_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "units_name_unique" UNIQUE("name"),
	CONSTRAINT "units_value_unique" UNIQUE("value")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"password" varchar NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"username" varchar NOT NULL,
	"profile_picture" varchar,
	"type" text DEFAULT 'user' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"decInitVector" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_token_unique" UNIQUE("token"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "bills" ADD CONSTRAINT "bills_currency_id_currency_table_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currency_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "stock_supplier_supplier_id_fk" FOREIGN KEY ("supplier") REFERENCES "public"."supplier"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "stock_vendor_vendor_id_fk" FOREIGN KEY ("vendor") REFERENCES "public"."vendor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "stock_currency_id_currency_table_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currency_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "stock_unit_units_id_fk" FOREIGN KEY ("unit") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;