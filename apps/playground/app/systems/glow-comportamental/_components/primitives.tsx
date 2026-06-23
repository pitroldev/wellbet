"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────────────
   GLOW COMPORTAMENTAL — primitivos compartilhados
   Tokens locais do sistema (dark data-driven / wearable premium):
     bg #0E0B1A · surface #171327 · roxo-glow #8B5CF6 · verde-glow #34F5A0
     risk #FF5470 · texto #EDEAF7 · muted #8B83A8
   ────────────────────────────────────────────────────────────────────────── */

export const GLOW = {
  bg: "#0E0B1A",
  surface: "#171327",
  surfaceHi: "#1F1933",
  purple: "#8B5CF6",
  green: "#34F5A0",
  risk: "#FF5470",
  text: "#EDEAF7",
  muted: "#8B83A8",
  line: "rgba(139,131,168,0.16)",
} as const;

export const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

/** Texto em fonte de dados (mono) com numerais tabulares. */
export function mono(extra?: string) {
  return cn("font-[family-name:var(--font-mono-data)] tabular-nums", extra);
}

/* ── Count-up: anima um número de 0 (ou from) até `value` quando entra na tela ── */
export function CountUp({
  value,
  decimals = 0,
  duration = 1.4,
  prefix = "",
  suffix = "",
  className,
  from = 0,
}: {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  from?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const mv = useMotionValue(from);
  const [display, setDisplay] = useState(from);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(mv, value, {
      duration,
      ease: EASE_SOFT,
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [inView, value, duration, mv, reduceMotion]);

  const rendered = reduceMotion ? value : display;

  return (
    <span ref={ref} className={cn(mono(), className)}>
      {prefix}
      {rendered.toLocaleString("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ── Surface card: a "placa" base do painel, com hairline e glow opcional ── */
export function Panel({
  children,
  className,
  glow,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  glow?: "purple" | "green" | "risk" | "none";
  as?: "div" | "section" | "article";
}) {
  const ring =
    glow === "purple"
      ? "shadow-[0_0_0_1px_rgba(139,92,246,0.25),0_24px_60px_-30px_rgba(139,92,246,0.55)]"
      : glow === "green"
        ? "shadow-[0_0_0_1px_rgba(52,245,160,0.22),0_24px_60px_-30px_rgba(52,245,160,0.45)]"
        : glow === "risk"
          ? "shadow-[0_0_0_1px_rgba(255,84,112,0.25),0_24px_60px_-30px_rgba(255,84,112,0.5)]"
          : "shadow-[0_20px_50px_-32px_rgba(0,0,0,0.9)]";
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-[rgba(139,131,168,0.16)] bg-[#171327]",
        ring,
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/* ── Label de HUD discreto (kicker mono uppercase) ── */
export function HudLabel({
  children,
  className,
  tone = "muted",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "muted" | "purple" | "green" | "risk";
}) {
  const color =
    tone === "purple"
      ? "text-[#8B5CF6]"
      : tone === "green"
        ? "text-[#34F5A0]"
        : tone === "risk"
          ? "text-[#FF5470]"
          : "text-[#8B83A8]";
  return (
    <span
      className={cn(
        mono(),
        "text-[10px] font-medium uppercase tracking-[0.26em]",
        color,
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ── Anel de progresso SVG via pathLength (preenche ao entrar na tela) ── */
export function ProgressRing({
  size = 220,
  stroke = 14,
  progress, // 0..1
  color = GLOW.purple,
  trackColor = "rgba(139,131,168,0.16)",
  children,
  delay = 0.1,
  glow = true,
}: {
  size?: number;
  stroke?: number;
  progress: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
  delay?: number;
  glow?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const r = (size - stroke) / 2;
  const c = size / 2;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle cx={c} cy={c} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <motion.circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          pathLength={1}
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: progress } : { pathLength: 0 }}
          transition={{ duration: 1.6, ease: EASE_SOFT, delay }}
          style={glow ? { filter: `drop-shadow(0 0 6px ${color}aa)` } : undefined}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}

/* ── Barra de medidor horizontal (saúde do compromisso etc.) ── */
export function MeterBar({
  value, // 0..1
  color = GLOW.green,
  delay = 0.15,
  height = 10,
}: {
  value: number;
  color?: string;
  delay?: number;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div
      ref={ref}
      className="w-full overflow-hidden rounded-full bg-[rgba(139,131,168,0.16)]"
      style={{ height }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          boxShadow: `0 0 12px ${color}88`,
        }}
        initial={{ width: 0 }}
        animate={inView ? { width: `${Math.round(value * 100)}%` } : { width: 0 }}
        transition={{ duration: 1.2, ease: EASE_SOFT, delay }}
      />
    </div>
  );
}

/* ── OddsTick: número "ao vivo" controlado (cotação/retorno). Anima de from→value
   a cada mudança de `value` — ideal para count-up reativo em onClick/slider. ── */
export function OddsTick({
  value,
  decimals = 2,
  prefix = "",
  suffix = "",
  duration = 0.5,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const mv = useMotionValue(value);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reduceMotion) return;
    const controls = animate(mv, value, {
      duration,
      ease: EASE_SOFT,
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [value, duration, mv, reduceMotion]);

  const rendered = reduceMotion ? value : display;

  return (
    <span className={cn(mono(), className)}>
      {prefix}
      {rendered.toLocaleString("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ── Chip de cotação (odds) — a unidade visual de bet do sistema ───────────── */
export function OddsChip({
  children,
  tone = "purple",
  active = false,
  className,
}: {
  children: React.ReactNode;
  tone?: "purple" | "green" | "muted";
  active?: boolean;
  className?: string;
}) {
  const c = tone === "green" ? GLOW.green : tone === "muted" ? GLOW.muted : GLOW.purple;
  return (
    <span
      className={cn(
        mono(),
        "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-sm font-semibold leading-none",
        className,
      )}
      style={{
        borderColor: active ? c : `${c}55`,
        background: active ? `${c}22` : `${c}10`,
        color: c,
        boxShadow: active ? `0 0 14px -2px ${c}aa` : undefined,
      }}
    >
      {children}
    </span>
  );
}

/* ── Burst de partículas A MÃO: N partículas radiais derivadas do index ────── */
export function ParticleBurst({
  show,
  count = 16,
  radius = 90,
  colors = [GLOW.green, GLOW.purple],
  size = 6,
}: {
  show: boolean;
  count?: number;
  radius?: number;
  colors?: string[];
  size?: number;
}) {
  if (!show) return null;
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        // variação determinística por index (sem Math.random no render)
        const dist = radius * (0.7 + ((i * 37) % 30) / 100);
        const c = colors[i % colors.length];
        const isStar = i % 3 === 0;
        return (
          <motion.span
            key={i}
            aria-hidden
            className={cn("absolute", isStar ? "rounded-[1px]" : "rounded-full")}
            style={{
              width: size,
              height: isStar ? size * 1.6 : size,
              background: c,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              opacity: 0,
              scale: 0.2,
              rotate: isStar ? 180 : 0,
            }}
            transition={{
              duration: 0.9,
              ease: "easeOut",
              delay: (i % 4) * 0.02,
            }}
          />
        );
      })}
    </div>
  );
}
