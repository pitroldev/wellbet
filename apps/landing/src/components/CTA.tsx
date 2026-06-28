import type { JSX } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CTAProps {
  href: string;
  children: string;
  /** `primary` = gradiente voltage com glow; `secondary` = contorno claro. */
  variant?: "primary" | "secondary";
  className?: string;
}

/**
 * CTA da landing — `<a>` estilizado como botão (link real, sem JS de cliente).
 * Primário usa o gradiente voltage (menta→azul) com texto `ink` (BRAND.md:
 * texto sobre menta usa ink) e glow azul.
 */
export function CTA({ href, children, variant = "primary", className }: CTAProps): JSX.Element {
  if (variant === "secondary") {
    return (
      <a
        href={href}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-bold text-white ring-1 ring-inset ring-white/20 transition hover:bg-white/5",
          className,
        )}
      >
        {children}
      </a>
    );
  }
  return (
    <a
      href={href}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-extrabold text-white transition-transform duration-200 hover:-translate-y-0.5",
        className,
      )}
      style={{ background: "var(--gradient-gymbet)", boxShadow: "var(--glow-magenta)" }}
    >
      {children}
      <ArrowRight
        className="size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
        aria-hidden
      />
    </a>
  );
}
