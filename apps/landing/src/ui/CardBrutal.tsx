import type { JSX, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Accent = "none" | "magenta" | "green";

/**
 * Casca de card de CANTO VIVO — base compartilhada de Problema/ComoFunciona/
 * Confiança. `surface` define fundo+borda; `accent` desenha a barra de topo
 * (2px); `interactive` adiciona o hover (carimbo magenta no claro, borda viva
 * no escuro). Conteúdo livre (use IconTile + numeral no header).
 */
export function CardBrutal({
  children,
  surface = "paper",
  accent = "none",
  interactive = false,
  className,
}: {
  children: ReactNode;
  surface?: "paper" | "ink";
  accent?: Accent;
  interactive?: boolean;
  className?: string;
}): JSX.Element {
  const surfaceCls =
    surface === "paper" ? "border-2 border-ink bg-paper" : "border border-navy-line bg-navy-soft";
  const interactiveCls = interactive
    ? surface === "paper"
      ? "transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[8px_8px_0_0_#ff00ff]"
      : "transition-all duration-200 hover:-translate-y-1.5 hover:border-magenta hover:shadow-[8px_8px_0_0_#ff00ff]"
    : "";
  const accentCls = accent === "green" ? "bg-green" : "bg-magenta";

  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden p-6",
        surfaceCls,
        interactiveCls,
        className,
      )}
    >
      {accent !== "none" ? (
        <span
          aria-hidden
          className={cn("pointer-events-none absolute inset-x-0 top-0 h-[3px]", accentCls)}
        />
      ) : null}
      {children}
    </article>
  );
}

const TILE_TONE = {
  magenta: "bg-magenta text-ink",
  green: "bg-green text-ink",
  pink: "bg-pink text-ink",
  muted: "bg-white/5 text-fog-mute ring-1 ring-white/10",
} as const;

/** Selo quadrado de ícone (canto vivo). `muted` = card de dor (dessaturado). */
export function IconTile({
  children,
  tone = "magenta",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof TILE_TONE;
  className?: string;
}): JSX.Element {
  return (
    <span className={cn("grid size-11 shrink-0 place-items-center", TILE_TONE[tone], className)}>
      {children}
    </span>
  );
}
