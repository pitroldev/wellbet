import type { JSX } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CTAProps {
  href: string;
  children: string;
  /** `primary` = bloco chapado de magenta; `secondary` = contorno (fio duro). */
  variant?: "primary" | "secondary";
  /** Em superfície escura: inverte cor do contorno/carimbo do secundário. */
  onDark?: boolean;
  className?: string;
}

/**
 * CTA da landing — `<a>` estilizado como bilhete de aposta (link real, sem JS).
 * SPORTSBOOK BRUTAL: zero pílula. Primário = BLOCO chapado de magenta, texto ink,
 * canto de bilhete cortado (stub) e CARIMBO offset duro (drop-shadow respeita o
 * recorte). Secundário = contorno de fio duro 2px (borda /45 p/ legibilidade).
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
          "inline-flex items-center justify-center gap-2 border-2 px-7 py-3.5 font-[family-name:var(--font-geist-mono)] text-sm font-bold uppercase tracking-[0.08em] transition-colors",
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
  // O clip-path fica no <span> interno (não no <a>): assim o outline de foco do
  // link não é recortado (clip-path corta todo o render, inclusive o outline).
  return (
    <a
      href={href}
      className={cn(
        "group inline-flex focus-visible:outline-2 focus-visible:outline-offset-2",
        onDark ? "focus-visible:outline-white" : "focus-visible:outline-ink",
        className,
      )}
    >
      <span
        className="inline-flex items-center justify-center gap-2 bg-magenta px-7 py-3.5 font-[family-name:var(--font-geist-mono)] text-sm font-bold uppercase tracking-[0.08em] text-ink transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
        style={{
          clipPath: "var(--stub)",
          filter: onDark ? "drop-shadow(5px 5px 0 #f1efe9)" : "drop-shadow(5px 5px 0 #0a0d16)",
        }}
      >
        {children}
        <ArrowRight
          className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </a>
  );
}
