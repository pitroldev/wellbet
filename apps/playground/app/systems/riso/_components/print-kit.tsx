"use client";

import { R, halftone, PRINT_SHADOW } from "./tokens";

/**
 * GRAIN — overlay de ruído/grão via SVG feTurbulence, opacidade baixa, multiply.
 * Coloca uma vez por superfície (position relative no pai). pointer-events:none.
 */
export function Grain({ opacity = 0.32 }: { opacity?: number }) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ mixBlendMode: "multiply", opacity }}
      preserveAspectRatio="none"
    >
      <filter id="riso-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#riso-grain)" />
    </svg>
  );
}

/**
 * HalftoneField — campo de meio-tom como fundo decorativo de uma seção/cartão.
 * `blend="multiply"` por padrão para se misturar com a tinta de baixo.
 */
export function HalftoneField({
  color,
  size = 8,
  dot = 0.36,
  opacity = 1,
  blend = "multiply",
  className,
  style,
}: {
  color: string;
  size?: number;
  dot?: number;
  opacity?: number;
  blend?: React.CSSProperties["mixBlendMode"];
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={"pointer-events-none absolute inset-0 " + (className ?? "")}
      style={{ ...halftone(color, size, dot), mixBlendMode: blend, opacity, ...style }}
    />
  );
}

/**
 * PaperCard — cartão de papel com borda dura de tinta e sombra de print (offset duro).
 * É o "card" do system (substitui o cartão arredondado da casa).
 */
export function PaperCard({
  children,
  className,
  style,
  border = R.ink,
  bg = R.paper,
  shadow = PRINT_SHADOW,
  tilt = 0,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  border?: string;
  bg?: string;
  shadow?: string | false;
  tilt?: number;
}) {
  return (
    <div
      className={"relative " + (className ?? "")}
      style={{
        background: bg,
        border: `2.5px solid ${border}`,
        boxShadow: shadow || undefined,
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * MisprintTitle — manchete pôster com "erro de registro": a palavra é impressa
 * duas/três vezes deslocada 2–3px em tintas diferentes (overprint multiply).
 * Camadas de baixo herdam blend multiply; a de cima é o ink legível.
 */
export function MisprintTitle({
  children,
  size = "clamp(2.4rem,12vw,5.5rem)",
  inkTop = R.ink,
  ink1 = R.magenta,
  ink2 = R.blue,
  font = "var(--font-archivo)",
  weight = 900,
  shift = 3,
  className,
  style,
}: {
  children: React.ReactNode;
  size?: string;
  inkTop?: string;
  ink1?: string;
  ink2?: string;
  font?: string;
  weight?: number;
  /** desalinho de registro em px (offset das tintas de baixo). */
  shift?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const base: React.CSSProperties = {
    fontFamily: font,
    fontWeight: weight,
    fontSize: size,
    lineHeight: 0.92,
    letterSpacing: "-0.02em",
    textTransform: "uppercase",
    margin: 0,
  };
  const s = shift;
  return (
    <div className={"relative " + (className ?? "")} style={{ ...style }}>
      <span
        aria-hidden
        className="block select-none"
        style={{ ...base, color: ink2, transform: `translate(${s}px,${s}px)`, mixBlendMode: "multiply" }}
      >
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block select-none"
        style={{ ...base, color: ink1, transform: `translate(${-Math.round(s * 0.7)}px,${-Math.round(s * 0.35)}px)`, mixBlendMode: "multiply" }}
      >
        {children}
      </span>
      <span className="absolute inset-0 block" style={{ ...base, color: inkTop }}>
        {children}
      </span>
    </div>
  );
}

/**
 * Stamp — carimbo de tinta rotacionado com grão e borda dupla (selo "edição limitada").
 */
export function Stamp({
  children,
  color = R.magenta,
  rotate = -8,
  className,
  style,
}: {
  children: React.ReactNode;
  color?: string;
  rotate?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={"relative inline-flex items-center gap-1.5 px-3 py-1.5 " + (className ?? "")}
      style={{
        color,
        border: `2.5px solid ${color}`,
        outline: `1px solid ${color}`,
        outlineOffset: "2px",
        transform: `rotate(${rotate}deg)`,
        fontFamily: "var(--font-archivo)",
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        ...style,
      }}
    >
      <span className="relative z-10 inline-flex items-center gap-1.5">{children}</span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ ...halftone(color, 5, 0.3), mixBlendMode: "multiply", opacity: 0.5 }}
      />
    </span>
  );
}
