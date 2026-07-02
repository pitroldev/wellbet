import type { JSX, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Tag de cupom — pílula chapada com texto mono. É a forma de "eyebrow" sobre
 * superfície CLARA (bloco em vez de texto violeta solto). Texto sobre violeta
 * = branco; sobre verde = green-ink (nunca branco).
 */
export function Tag({
  children,
  className,
  tone = "violet",
}: {
  children: ReactNode;
  className?: string;
  tone?: "violet" | "ink" | "green";
}): JSX.Element {
  const bg = tone === "green" ? "bg-green" : tone === "ink" ? "bg-ink" : "bg-violet";
  const fg = tone === "ink" ? "text-violet-soft" : tone === "green" ? "text-green-ink" : "text-white";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-[family-name:var(--font-geist-mono)] text-[11px] font-bold uppercase tracking-[0.2em]",
        bg,
        fg,
        className,
      )}
    >
      {children}
    </span>
  );
}
