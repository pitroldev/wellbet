import type { JSX } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CTAProps {
  /** Destino do botão (URL do app por padrão). */
  href: string;
  /** Rótulo do botão. */
  children: string;
  /** Aparência: primário (âmbar) ou secundário (contorno claro). */
  variant?: "primary" | "secondary";
  /** Classe extra. */
  className?: string;
}

const variantClasses: Record<NonNullable<CTAProps["variant"]>, string> = {
  // Acento âmbar terroso — destaque sóbrio, NÃO dourado de cassino.
  primary: "bg-accent-500 text-neutral-950 hover:bg-accent-400 focus-visible:ring-accent-300",
  secondary:
    "border border-neutral-300 bg-transparent text-current hover:bg-[var(--color-muted)] focus-visible:ring-neutral-400",
};

/**
 * Call-to-action da landing — um `<a>` estilizado como botão (link real, sem
 * estado de cliente). Mantém o JS no mínimo para SEO/LCP.
 */
export function CTA({ href, children, variant = "primary", className }: CTAProps): JSX.Element {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        variantClasses[variant],
        className,
      )}
    >
      {children}
      <ArrowRight className="size-5 shrink-0" aria-hidden />
    </a>
  );
}
