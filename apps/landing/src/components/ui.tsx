import type { CSSProperties, JSX, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BoltMark } from "./brand";

/** Eyebrow esportivo (Archivo caixa-alta) com o raio como bullet. */
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
          ? "text-blue-soft"
          : "text-magenta";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-[family-name:var(--font-archivo)] text-xs font-extrabold uppercase tracking-[0.2em]",
        color,
        className,
      )}
    >
      <BoltMark className="h-3 w-auto" />
      {children}
    </span>
  );
}

/** Mancha de luz desfocada para o fundo (decorativa). Default magenta. */
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
 * Manchete da marca — Archivo black, CAIXA-ALTA itálico (energia gymbet-arena).
 * É o protagonista tipográfico da LP. `level` controla a tag semântica.
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
    "font-[family-name:var(--font-archivo)] font-black uppercase italic leading-[0.9] tracking-[-0.02em] text-white",
    className,
  );
  if (level === 1) return <h1 className={cls}>{children}</h1>;
  if (level === 3) return <h3 className={cls}>{children}</h3>;
  return <h2 className={cls}>{children}</h2>;
}

/** Palavra/trecho em texto-gradiente. Default: gymbet bright (magenta→rosa, alto contraste). */
export function GradText({
  children,
  gradient = "var(--gradient-gymbet-bright)",
  className,
}: {
  children: ReactNode;
  gradient?: string;
  className?: string;
}): JSX.Element {
  return (
    <span
      className={cn("bg-clip-text text-transparent", className)}
      style={{
        backgroundImage: gradient,
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
      }}
    >
      {children}
    </span>
  );
}
