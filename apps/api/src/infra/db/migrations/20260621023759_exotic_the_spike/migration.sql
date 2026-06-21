CREATE TYPE "bet_status" AS ENUM('pending_payment', 'open', 'settling', 'won', 'lost', 'voided');--> statement-breakpoint
CREATE TYPE "review_verdict" AS ENUM('approved', 'pending', 'rejected');--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('user', 'reviewer', 'admin');--> statement-breakpoint
CREATE TYPE "weighin_kind" AS ENUM('baseline', 'mid', 'final');--> statement-breakpoint
CREATE TYPE "weighin_status" AS ENUM('pending', 'blocked', 'in_review', 'approved', 'rejected', 'recapture');--> statement-breakpoint
CREATE TABLE "bets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"start_weight_kg" real,
	"target_weight_kg" real NOT NULL,
	"stake_amount" numeric(12,2) NOT NULL,
	"payout_amount" numeric(12,2),
	"currency" text DEFAULT 'BRL' NOT NULL,
	"status" "bet_status" DEFAULT 'pending_payment'::"bet_status" NOT NULL,
	"stake_charge_id" text,
	"payout_transfer_id" text,
	"settled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"word" text NOT NULL,
	"number" integer NOT NULL,
	"gesture" text NOT NULL,
	"nonce" text NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "idempotency_keys" (
	"key" text PRIMARY KEY,
	"request_hash" text NOT NULL,
	"response_body" jsonb,
	"status_code" integer NOT NULL,
	"locked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"weighin_id" uuid NOT NULL,
	"reviewer_id" uuid,
	"verdict" "review_verdict",
	"reason" text,
	"failed_checks" jsonb,
	"decided_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" text NOT NULL,
	"name" text,
	"role" "user_role" DEFAULT 'user'::"user_role" NOT NULL,
	"tax_id" text,
	"pix_key" text,
	"auth_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weighins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"bet_id" uuid,
	"challenge_id" uuid,
	"kind" "weighin_kind" NOT NULL,
	"weight_kg" real NOT NULL,
	"video_object_key" text NOT NULL,
	"status" "weighin_status" DEFAULT 'pending'::"weighin_status" NOT NULL,
	"loss_per_week_kg" real,
	"captured_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "bets_user_idx" ON "bets" ("user_id");--> statement-breakpoint
CREATE INDEX "bets_status_idx" ON "bets" ("status");--> statement-breakpoint
CREATE INDEX "bets_stake_charge_idx" ON "bets" ("stake_charge_id");--> statement-breakpoint
CREATE UNIQUE INDEX "challenges_nonce_uq" ON "challenges" ("nonce");--> statement-breakpoint
CREATE INDEX "challenges_user_idx" ON "challenges" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "reviews_weighin_uq" ON "reviews" ("weighin_id");--> statement-breakpoint
CREATE INDEX "reviews_verdict_idx" ON "reviews" ("verdict");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_uq" ON "users" ("email");--> statement-breakpoint
CREATE INDEX "weighins_user_idx" ON "weighins" ("user_id");--> statement-breakpoint
CREATE INDEX "weighins_status_idx" ON "weighins" ("status");--> statement-breakpoint
CREATE INDEX "weighins_bet_idx" ON "weighins" ("bet_id");--> statement-breakpoint
ALTER TABLE "bets" ADD CONSTRAINT "bets_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_weighin_id_weighins_id_fkey" FOREIGN KEY ("weighin_id") REFERENCES "weighins"("id");--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewer_id_users_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "weighins" ADD CONSTRAINT "weighins_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "weighins" ADD CONSTRAINT "weighins_challenge_id_challenges_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id");