import type { CSSProperties, JSX, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BoltMark } from "./brand";

/** Eyebrow de bilhete — mono Space Mono, caixa-alta, raio como bullet. */
export function Eyebrow({
  children,
  tone = "magenta",
  className,
}: {
  children: ReactNode;
  tone?: "magenta" | "pink" | "green" | "blue";
  className?: string;
}): JSX.Element {
  const color =
    tone === "pink"
      ? "text-pink"
      : tone === "green"
        ? "text-green"
        : tone === "blue"
          ? "text-blue"
          : "text-magenta";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-[family-name:var(--font-geist-mono)] text-[11px] font-bold uppercase tracking-[0.28em]",
        color,
        className,
      )}
    >
      <BoltMark className="h-3 w-auto" />
      {children}
    </span>
  );
}

/**
 * Tag de bilhete — chip RETANGULAR chapado de magenta com texto ink mono.
 * Canto cortado (stub) opcional. Assinatura sportsbook (selo de cupom).
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

/** Fio duro — régua de 2px (divisória de placar). Herda a cor por currentColor. */
export function Rule({ className }: { className?: string }): JSX.Element {
  return <span aria-hidden className={cn("block h-0.5 w-full bg-current", className)} />;
}

/** Mancha de luz desfocada para o fundo (decorativa, parcimônia). Magenta GymBet. */
export function Glow({
  className,
  color = "#FF00FF",
  style,
}: {
  className?: string;
  color?: string;
  style?: CSSProperties;
}): JSX.Element {
  return (
    <span
      aria-hidden
      className={cn("pointer-events-none absolute rounded-full opacity-40 blur-[110px]", className)}
      style={{ background: color, ...style }}
    />
  );
}

/**
 * Manchete da marca — Anton condensada, CAIXA-ALTA (cartaz de boxe / placar).
 * Protagonista tipográfico. HERDA a cor do contexto (funciona em papel e ink).
 * `level` controla a tag semântica.
 */
export function Display({
  children,
  className,
  level = 2,
}: {
  children: ReactNode;
  className?: string;
  level?: 1 | 2 | 3;
}): JSX.Element {
  const cls = cn(
    "font-[family-name:var(--font-archivo)] font-normal uppercase leading-[0.92] tracking-[-0.005em]",
    className,
  );
  if (level === 1) return <h1 className={cls}>{children}</h1>;
  if (level === 3) return <h3 className={cls}>{children}</h3>;
  return <h2 className={cls}>{children}</h2>;
}

/**
 * Palavra/trecho em destaque — magenta CHAPADO (sem shimmer; o brutalismo pede
 * cor sólida, não gradiente fofo). `tone="green"` para win-states ("deu green").
 */
export function GradText({
  children,
  tone = "magenta",
  className,
}: {
  children: ReactNode;
  tone?: "magenta" | "green";
  className?: string;
}): JSX.Element {
  return (
    <span
      className={cn(className)}
      style={{ color: tone === "green" ? "var(--color-green)" : "var(--color-magenta)" }}
    >
      {children}
    </span>
  );
}

/**
 * Realce em BLOCO — a palavra fica dentro de um bloco chapado de magenta com
 * texto ink (grifo de placar). Quebra por linha via box-decoration clone.
 */
export function Slab({
  children,
  tone = "magenta",
  className,
}: {
  children: ReactNode;
  tone?: "magenta" | "green";
  className?: string;
}): JSX.Element {
  return (
    <span
      className={cn("px-[0.18em] py-[0.02em] text-ink", className)}
      style={{
        background: tone === "green" ? "var(--color-green)" : "var(--color-magenta)",
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
      }}
    >
      {children}
    </span>
  );
}
