import type { JSX, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Tag de bilhete — chip RETANGULAR chapado com canto cortado (stub), texto mono.
 * Selo de cupom; é a forma de "eyebrow" sobre superfície CLARA (bloco em vez de
 * texto magenta, que reprovaria contraste).
 */
export function Tag({
  children,
  className,
  tone = "magenta",
}: {
  children: ReactNode;
  className?: string;
  tone?: "magenta" | "ink" | "green";
}): JSX.Element {
  const bg = tone === "green" ? "bg-green" : tone === "ink" ? "bg-ink" : "bg-magenta";
  const fg = tone === "ink" ? "text-magenta" : "text-ink";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 font-[family-name:var(--font-geist-mono)] text-[11px] font-bold uppercase tracking-[0.2em]",
        bg,
        fg,
        className,
      )}
      style={{ clipPath: "var(--stub)" }}
    >
      {children}
    </span>
  );
}
