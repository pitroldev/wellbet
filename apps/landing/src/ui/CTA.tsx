import type { JSX } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CTAProps {
  href: string;
  children: string;
  /** `primary` = pílula violeta chapada; `secondary` = contorno arredondado. */
  variant?: "primary" | "secondary";
  /** Em superfície escura: inverte cor do contorno/foco do secundário. */
  onDark?: boolean;
  className?: string;
}

/**
 * CTA da landing — `<a>` estilizado (link real, sem JS). Primário = pílula
 * violeta com texto branco, hover escurece pro violet-deep com glow violeta
 * sutil (parcimônia: só aqui e no momento de recompensa). Secundário =
 * contorno arredondado discreto.
 */
export function CTA({
  href,
  children,
  variant = "primary",
  onDark = false,
  className,
}: CTAProps): JSX.Element {
  if (variant === "secondary") {
    return (
      <a
        href={href}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3.5 font-[family-name:var(--font-geist-mono)] text-sm font-bold uppercase tracking-[0.08em] transition-colors",
          onDark
            ? "border-white/45 text-white hover:bg-white/10"
            : "border-ink/45 text-ink hover:bg-ink/[0.06]",
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
        "group inline-flex items-center justify-center gap-2 rounded-full bg-violet px-7 py-3.5 font-[family-name:var(--font-geist-mono)] text-sm font-bold uppercase tracking-[0.08em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-deep hover:shadow-[0_18px_44px_-16px_var(--glow-violet)] focus-visible:outline-2 focus-visible:outline-offset-2",
        onDark ? "focus-visible:outline-white" : "focus-visible:outline-violet",
        className,
      )}
    >
      {children}
      <ArrowRight
        className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
        aria-hidden
      />
    </a>
  );
}
