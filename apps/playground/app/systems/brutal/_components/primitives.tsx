"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { B, BORDER, shadow, TWEEN } from "./tokens";

/**
 * Bloco brutalista: borda dura + sombra sólida offset (sem blur). Cantos retos.
 * É a caixa-base de tudo no system.
 */
export function Block({
  children,
  className,
  bg = B.white,
  off = 6,
  shadowColor = B.ink,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  bg?: string;
  off?: number;
  shadowColor?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("relative", className)}
      style={{
        background: bg,
        border: BORDER,
        boxShadow: shadow(off, shadowColor),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Botão MECÂNICO: no clique AFUNDA (translate no sentido da sombra) e a sombra
 * encolhe. Tween curto e seco — nunca spring. whileTap leva ao estado pressionado.
 */
export function BrutalButton({
  children,
  onClick,
  bg = B.magenta,
  fg = "#FFFFFF",
  off = 6,
  className,
  type = "button",
  disabled,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  bg?: string;
  fg?: string;
  off?: number;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      initial={false}
      animate={{ x: 0, y: 0, boxShadow: shadow(off) }}
      whileTap={{
        x: off,
        y: off,
        boxShadow: shadow(0),
      }}
      transition={TWEEN}
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 font-[family-name:var(--font-archivo)] text-sm font-black uppercase tracking-wide disabled:opacity-50",
        className,
      )}
      style={{
        background: bg,
        color: fg,
        border: BORDER,
        minHeight: 48,
        padding: "12px 18px",
        ...style,
      }}
    >
      {children}
    </motion.button>
  );
}

/** Tag/sticker levemente rotacionado, borda dura. */
export function Sticker({
  children,
  bg = B.green,
  fg = B.ink,
  rotate = -2,
  className,
}: {
  children: React.ReactNode;
  bg?: string;
  fg?: string;
  rotate?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-wider",
        className,
      )}
      style={{
        background: bg,
        color: fg,
        border: `2px solid ${B.ink}`,
        boxShadow: shadow(3),
        padding: "3px 8px",
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {children}
    </span>
  );
}

/** Divisor tipo ==== (estilo terminal). */
export function Rule({ char = "=", className }: { char?: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "overflow-hidden font-[family-name:var(--font-mono)] text-sm leading-none tracking-tighter",
        className,
      )}
      style={{ color: B.ink, opacity: 0.55 }}
    >
      {char.repeat(120)}
    </div>
  );
}

/** Ponto "REC" piscando (vermelho-magenta da casa). */
export function RecDot({ label = "REC", color = B.magenta }: { label?: string; color?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-widest" style={{ color: B.ink }}>
      <motion.span
        className="inline-block h-2.5 w-2.5"
        style={{ background: color, borderRadius: 9999 }}
        animate={{ opacity: [1, 0.15, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear", times: [0, 0.5, 1] }}
      />
      {label}
    </span>
  );
}

/** Cursor de terminal que pisca. */
export function Caret({ color = B.ink }: { color?: string }) {
  return (
    <motion.span
      aria-hidden
      className="ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-[0.12em]"
      style={{ background: color }}
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] }}
    />
  );
}

/** Label mono caixa-alta (cabeçalho de campo/tabela). */
export function MonoLabel({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn(
        "font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.18em]",
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}
