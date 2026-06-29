import type { JSX, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Display } from "./text";

/**
 * Cabeçalho de seção — DRY do ritmo kicker → manchete → lede. Fixa os
 * espaçamentos (kicker→título 20px, título→lede 24px) para a página inteira ter
 * a MESMA cadência. `tone` ajusta a cor do lede à superfície.
 */
export function SectionHeader({
  kicker,
  title,
  lede,
  tone = "dark",
  className,
}: {
  kicker?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}): JSX.Element {
  const ledeColor = tone === "light" ? "text-[color:var(--color-paper-mute)]" : "text-fog";
  return (
    <div className={cn("max-w-2xl", className)}>
      {kicker}
      <Display level={2} size="section" className={kicker ? "mt-5" : undefined}>
        {title}
      </Display>
      {lede ? <p className={cn("mt-6 text-lg leading-relaxed", ledeColor)}>{lede}</p> : null}
    </div>
  );
}
