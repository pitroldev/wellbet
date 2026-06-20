import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", {
  variants: {
    variant: {
      default: "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]",
      approved: "bg-[var(--color-verdict-approved)]/15 text-[var(--color-verdict-approved)]",
      pending: "bg-[var(--color-verdict-pending)]/15 text-[var(--color-verdict-pending)]",
      rejected: "bg-[var(--color-verdict-rejected)]/15 text-[var(--color-verdict-rejected)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps): React.JSX.Element {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
