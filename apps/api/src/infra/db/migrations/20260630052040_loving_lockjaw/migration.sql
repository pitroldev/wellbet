ALTER TABLE "approval_criteria" ALTER COLUMN "applies_when" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "approval_criteria" ALTER COLUMN "applies_when" DROP DEFAULT;--> statement-breakpoint
DROP TYPE "criterion_condition";--> statement-breakpoint
CREATE TYPE "criterion_condition" AS ENUM('always', 'has_comparison', 'has_previous_weight');--> statement-breakpoint
ALTER TABLE "approval_criteria" ALTER COLUMN "applies_when" SET DATA TYPE "criterion_condition" USING "applies_when"::"criterion_condition";--> statement-breakpoint
ALTER TABLE "approval_criteria" ALTER COLUMN "applies_when" SET DEFAULT 'always'::"criterion_condition";