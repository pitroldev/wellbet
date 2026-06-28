"use client";

import { N, neonText } from "./tokens";

/**
 * Ficha de cassino (disco com listras nas cores da marca). Tamanho ajustável.
 * Usada na pilha de stake e como ornamento. Determinística (sem random).
 */
export function Chip({
  value,
  size = 56,
  ring = N.magenta,
  face = N.panel,
  fg = N.white,
}: {
  value: number | string;
  size?: number;
  ring?: string;
  face?: string;
  fg?: string;
}) {
  const dashes = Array.from({ length: 8 });
  return (
    <span
      className="relative inline-grid shrink-0 place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 50% 38%, ${face} 0%, ${face} 58%, ${ring} 58%, ${ring} 100%)`,
        boxShadow: `0 4px 10px rgba(0,0,0,.5), 0 0 14px ${ring}55, inset 0 0 0 ${size * 0.05}px ${ring}`,
      }}
    >
      {/* listras de borda */}
      {dashes.map((_, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            width: size * 0.1,
            height: size * 0.16,
            background: i % 2 === 0 ? N.white : ring,
            borderRadius: 2,
            top: size * 0.02,
            left: "50%",
            transform: `translateX(-50%) rotate(${i * 45}deg)`,
            transformOrigin: `center ${size * 0.48}px`,
            opacity: 0.85,
          }}
        />
      ))}
      {/* miolo */}
      <span
        className="relative grid place-items-center rounded-full"
        style={{
          width: size * 0.62,
          height: size * 0.62,
          background: face,
          boxShadow: `inset 0 0 0 ${size * 0.018}px ${ring}88`,
        }}
      >
        <span
          className="font-[family-name:var(--font-mono)] font-bold tabular-nums"
          style={{ color: fg, fontSize: size * 0.26 }}
        >
          {value}
        </span>
      </span>
    </span>
  );
}

/** Letreiro neon de seção — texto com glow. */
export function NeonLabel({
  children,
  color = N.magenta,
  className,
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={
        "font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-[0.3em] " +
        (className ?? "")
      }
      style={{ color, textShadow: neonText(color) }}
    >
      {children}
    </span>
  );
}

/** Cartão do salão — superfície escura com borda fina e glow opcional. */
export function FeltCard({
  children,
  className,
  glow,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={"relative overflow-hidden rounded-[28px] " + (className ?? "")}
      style={{
        background: `linear-gradient(180deg, ${N.panel}, ${N.ground})`,
        boxShadow: glow
          ? `0 2px 8px rgba(0,0,0,.4), 0 30px 70px -30px rgba(0,0,0,.8), 0 0 30px ${glow}33`
          : "0 2px 8px rgba(0,0,0,.4), 0 30px 70px -30px rgba(0,0,0,.8)",
        border: `1px solid ${N.line}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
