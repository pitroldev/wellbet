import type { JSX, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BoltMark } from "./brand";

/**
 * Eyebrow de bilhete — mono Space Mono, caixa-alta, raio como bullet. `tone`
 * controla a cor (em superfície CLARA use "indigo" ou "ink": magenta puro
 * reprova contraste em texto sobre papel).
 */
export function Eyebrow({
  children,
  tone = "magenta",
  className,
}: {
  children: ReactNode;
  tone?: "magenta" | "pink" | "green" | "indigo" | "ink";
  className?: string;
}): JSX.Element {
  const color = {
    magenta: "text-magenta",
    pink: "text-pink",
    green: "text-green",
    indigo: "text-indigo",
    ink: "text-ink",
  }[tone];
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

const DISPLAY_SIZE = {
  hero: "text-hero leading-[1.2]",
  display: "text-display leading-[1.18]",
  section: "text-[clamp(2rem,5.2vw,3.4rem)] leading-[1.18]",
} as const;

/**
 * Manchete da marca — Anton condensada, CAIXA-ALTA (cartaz de boxe / placar).
 * HERDA a cor do contexto (funciona em papel e ink). `size` fixa a escala;
 * `level` controla a tag semântica.
 */
export function Display({
  children,
  className,
  level = 2,
  size = "display",
}: {
  children: ReactNode;
  className?: string;
  level?: 1 | 2 | 3;
  size?: keyof typeof DISPLAY_SIZE;
}): JSX.Element {
  const cls = cn(
    "font-[family-name:var(--font-archivo)] font-normal uppercase tracking-[-0.005em]",
    DISPLAY_SIZE[size],
    className,
  );
  if (level === 1) return <h1 className={cls}>{children}</h1>;
  if (level === 3) return <h3 className={cls}>{children}</h3>;
  return <h2 className={cls}>{children}</h2>;
}

/**
 * Palavra em destaque sobre superfície ESCURA — cor sólida (magenta/green puros
 * passam contraste em ink). NÃO usar em papel (use Slab).
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
 * Palavra em destaque sobre superfície CLARA — BLOCO chapado + texto ink (grifo
 * de placar, contraste 6:1). É a forma de enfatizar em papel. Quebra por linha.
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
  // inline-block + padding vertical: o bloco huga o texto E cobre os acentos
  // (circunflexo do Ê, cedilha do ç) sem colidir com a linha de cima quando a
  // manchete quebra. A frase grifada fica inteira numa linha só.
  return (
    <span
      className={cn("inline-block px-[0.16em] py-[0.16em] leading-[1.0] text-ink", className)}
      style={{ background: tone === "green" ? "var(--color-green)" : "var(--color-magenta)" }}
    >
      {children}
    </span>
  );
}
