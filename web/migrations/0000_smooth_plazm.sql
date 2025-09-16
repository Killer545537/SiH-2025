CREATE TYPE "public"."education_level" AS ENUM('10th', '12th', 'diploma', 'graduation', 'postgraduation');--> statement-breakpoint
CREATE TYPE "public"."education_marks_type" AS ENUM('percentage', 'cgpa', 'grade');--> statement-breakpoint
CREATE TYPE "public"."ekyc_method" AS ENUM('aadhaar', 'digilocker');--> statement-breakpoint
CREATE TYPE "public"."ekyc_status" AS ENUM('pending', 'verified', 'failed');--> statement-breakpoint
CREATE TYPE "public"."language_proficiency" AS ENUM('basic', 'intermediate', 'advanced', 'native');--> statement-breakpoint
CREATE TYPE "public"."reservation_category" AS ENUM('general', 'obc', 'sc', 'st');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ekyc_verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"method" "ekyc_method" NOT NULL,
	"status" "ekyc_status" DEFAULT 'pending' NOT NULL,
	"transaction_id" text,
	"aadhaar_last_four" text,
	"digilocker_reference" text,
	"consent_given" boolean DEFAULT false NOT NULL,
	"verification_data" jsonb,
	"verified_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_bank_details" (
	"profile_id" text PRIMARY KEY NOT NULL,
	"is_aadhaar_seeded" boolean DEFAULT false NOT NULL,
	"account_number" text NOT NULL,
	"ifsc" text NOT NULL,
	"bank_name" text NOT NULL,
	"branch" text NOT NULL,
	"account_holder_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_educations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" text NOT NULL,
	"level" "education_level" NOT NULL,
	"subject" text,
	"board" text NOT NULL,
	"institute" text NOT NULL,
	"year_of_passing" smallint NOT NULL,
	"marks_type" "education_marks_type" NOT NULL,
	"marks_value" text NOT NULL,
	"certificate_url" text,
	"certificate_file_name" text,
	"certificate_file_size" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_languages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" text NOT NULL,
	"name" text NOT NULL,
	"proficiency" "language_proficiency" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" text NOT NULL,
	"skill" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"name" text,
	"dob" date,
	"gender" text,
	"father_name" text,
	"category" "reservation_category",
	"has_disability" boolean DEFAULT false NOT NULL,
	"disability_type" text,
	"permanent_address_line1" text,
	"permanent_address_line2" text,
	"permanent_state" text,
	"permanent_district" text,
	"permanent_block" text,
	"permanent_village" text,
	"permanent_pin" text,
	"current_address_same_as_permanent" boolean DEFAULT false NOT NULL,
	"current_address_line1" text,
	"current_address_line2" text,
	"current_state" text,
	"current_district" text,
	"current_block" text,
	"current_village" text,
	"current_pin" text,
	"is_email_verified" boolean DEFAULT false NOT NULL,
	"email_verified_at" timestamp,
	"email" text,
	"primary_mobile" text,
	"alternate_mobile" text,
	"photo_url" text,
	"is_complete" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ekyc_verifications" ADD CONSTRAINT "ekyc_verifications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_bank_details" ADD CONSTRAINT "profile_bank_details_profile_id_profiles_user_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_educations" ADD CONSTRAINT "profile_educations_profile_id_profiles_user_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_languages" ADD CONSTRAINT "profile_languages_profile_id_profiles_user_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_skills" ADD CONSTRAINT "profile_skills_profile_id_profiles_user_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "profile_languages_profile_id_name_unique" ON "profile_languages" USING btree ("profile_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "profile_skills_profile_id_skill_unique" ON "profile_skills" USING btree ("profile_id","skill");