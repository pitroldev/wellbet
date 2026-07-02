import type { JSX, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FlameMark } from "./brand";

/**
 * Eyebrow de bilhete — mono, caixa-alta, símbolo da chama como bullet. `tone`
 * controla a cor: sobre ESCURO use "violet-soft"/"cyan"/"green" (violeta puro
 * reprova AA no ink); sobre PAPEL use "violet" ou "ink".
 */
export function Eyebrow({
  children,
  tone = "violet-soft",
  className,
}: {
  children: ReactNode;
  tone?: "violet" | "violet-soft" | "blue" | "cyan" | "green" | "ink";
  className?: string;
}): JSX.Element {
  const color = {
    violet: "text-violet",
    "violet-soft": "text-violet-soft",
    blue: "text-blue",
    cyan: "text-cyan",
    green: "text-green",
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
      <FlameMark className="h-3.5 w-auto" />
      {children}
    </span>
  );
}

const DISPLAY_SIZE = {
  hero: "text-hero leading-[1.08]",
  display: "text-display leading-[1.1]",
  section: "text-[clamp(1.7rem,4.2vw,2.7rem)] leading-[1.12]",
} as const;

/**
 * Manchete da marca — Outfit 900, bold arredondada, sentence case (caixa-alta
 * vira recurso pontual de eyebrow/palavra-herói). HERDA a cor do contexto
 * (funciona em papel e ink). `size` fixa a escala; `level` a tag semântica.
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
    "font-[family-name:var(--font-archivo)] font-black tracking-[-0.02em]",
    DISPLAY_SIZE[size],
    className,
  );
  if (level === 1) return <h1 className={cls}>{children}</h1>;
  if (level === 3) return <h3 className={cls}>{children}</h3>;
  return <h2 className={cls}>{children}</h2>;
}

/**
 * Palavra em destaque sobre superfície ESCURA — cor sólida que passa contraste
 * em ink: cyan (default), violet-soft ("violet") ou green. NÃO usar em papel
 * (use Slab).
 */
export function GradText({
  children,
  tone = "cyan",
  className,
}: {
  children: ReactNode;
  tone?: "cyan" | "violet" | "green";
  className?: string;
}): JSX.Element {
  const color = {
    cyan: "var(--color-cyan)",
    violet: "var(--color-violet-soft)",
    green: "var(--color-green)",
  }[tone];
  return (
    <span className={cn(className)} style={{ color }}>
      {children}
    </span>
  );
}

/**
 * Palavra em destaque sobre superfície CLARA — bloco arredondado violeta com
 * texto BRANCO (6.6:1); no tone "green", texto green-ink (nunca branco sobre
 * verde). É a forma de enfatizar em papel. Quebra por linha.
 */
export function Slab({
  children,
  tone = "violet",
  className,
}: {
  children: ReactNode;
  tone?: "violet" | "green";
  className?: string;
}): JSX.Element {
  const green = tone === "green";
  // inline-block + padding vertical: o bloco huga o texto E cobre os acentos
  // (circunflexo do Ê, cedilha do ç) sem colidir com a linha de cima quando a
  // manchete quebra. A frase grifada fica inteira numa linha só.
  return (
    <span
      className={cn(
        "inline-block rounded-lg px-[0.16em] py-[0.16em] leading-[1.0]",
        green ? "text-green-ink" : "text-white",
        className,
      )}
      style={{ background: green ? "var(--color-green)" : "var(--color-violet)" }}
    >
      {children}
    </span>
  );
}
