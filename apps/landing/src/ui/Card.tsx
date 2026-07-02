import type { JSX, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Accent = "none" | "violet" | "green";

/**
 * Casca de card arredondada — base compartilhada das seções da landing.
 * `surface` define fundo+borda hairline; `accent` desenha a barra
 * de topo (3px); `interactive` adiciona o hover (lift leve + borda violeta).
 * Sombra de painel suave (--shadow-panel), nunca colorida dura. Conteúdo livre
 * (use IconTile + numeral no header).
 */
export function Card({
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
    surface === "paper"
      ? "border border-paper-line bg-paper shadow-panel"
      : "border border-navy-line bg-surface shadow-panel";
  const interactiveCls = interactive
    ? "transition-all duration-200 hover:-translate-y-1.5 hover:border-violet"
    : "";
  const accentCls = accent === "green" ? "bg-green" : "bg-violet";

  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl p-6",
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
  violet: "bg-violet text-white",
  blue: "bg-blue text-ink",
  cyan: "bg-cyan text-ink",
  green: "bg-green text-green-ink",
  muted: "bg-white/5 text-fog-mute ring-1 ring-white/10",
} as const;

/** Selo arredondado de ícone. `muted` = card de dor (dessaturado). */
export function IconTile({
  children,
  tone = "violet",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof TILE_TONE;
  className?: string;
}): JSX.Element {
  return (
    <span
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-xl",
        TILE_TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
