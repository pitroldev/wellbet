"use client";

import { useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { FOIL, FOIL_CONIC, HOLO } from "./tokens";

/**
 * HOLOGRÁFICO — primitivos.
 * O coração é o FOIL reativo a ponteiro/tilt: arrastar/inclinar o cartão move o
 * gradiente iridescente + parallax de profundidade. Tudo runtime-safe:
 * nada de Math.random/Date/window no render; offsets de partículas derivam do
 * index ou são gerados em handlers.
 */

/* ──────────────────────────────────────────────────────────────────────────
 * GlassLabel — micro label mono, contraste AA sobre vidro
 * ────────────────────────────────────────────────────────────────────────── */
export function GlassLabel({
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
        "font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em]",
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * GlassPanel — superfície de vidro fosco com backdrop-blur + borda iridescente
 * ────────────────────────────────────────────────────────────────────────── */
export function GlassPanel({
  children,
  className,
  glow = "purple",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: "purple" | "green" | "cyan" | "none";
  style?: React.CSSProperties;
}) {
  const ring =
    glow === "green"
      ? "0 0 0 1px rgba(52, 245, 160,0.30), 0 18px 50px -24px rgba(52, 245, 160,0.30)"
      : glow === "cyan"
        ? "0 0 0 1px rgba(34,211,238,0.30), 0 18px 50px -24px rgba(34,211,238,0.30)"
        : glow === "none"
          ? "0 0 0 1px rgba(255,255,255,0.06)"
          : "0 0 0 1px rgba(168, 85, 247,0.28), 0 18px 50px -24px rgba(168, 85, 247,0.35)";
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[20px] border border-white/10 backdrop-blur-xl",
        className,
      )}
      style={{
        background: "linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.015))",
        boxShadow: ring,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * useFoil — o motor da assinatura. Rastreia ponteiro/tilt e devolve:
 *  - bind: handlers para o cartão
 *  - rotX/rotY: tilt 3D (spring)
 *  - foilX/foilY: posição do gradiente foil (0..100%)
 *  - glare: posição do brilho especular
 * Tudo via useMotionValue (não causa render); pointer só em handlers.
 * ────────────────────────────────────────────────────────────────────────── */
export function useFoil(maxTilt = 12) {
  const px = useMotionValue(0.5); // 0..1 normalizado
  const py = useMotionValue(0.5);
  const active = useMotionValue(0); // 0 repouso, 1 tocando

  const sx = useSpring(px, { stiffness: 200, damping: 22 });
  const sy = useSpring(py, { stiffness: 200, damping: 22 });
  const sActive = useSpring(active, { stiffness: 200, damping: 26 });

  const rotY = useTransform(sx, [0, 1], [-maxTilt, maxTilt]);
  const rotX = useTransform(sy, [0, 1], [maxTilt, -maxTilt]);

  const ref = useRef<HTMLElement | null>(null);

  const move = useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const nx = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      const ny = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
      px.set(nx);
      py.set(ny);
    },
    [px, py],
  );

  const bind = {
    ref: (node: HTMLElement | null) => {
      ref.current = node;
    },
    onPointerMove: (e: React.PointerEvent) => {
      active.set(1);
      move(e.clientX, e.clientY);
    },
    onPointerDown: (e: React.PointerEvent) => {
      active.set(1);
      move(e.clientX, e.clientY);
    },
    onPointerLeave: () => {
      active.set(0);
      px.set(0.5);
      py.set(0.5);
    },
    onPointerUp: () => {
      active.set(0);
    },
  };

  // sx/sy/sActive são MotionValue<number> normalizados (0..1) — FoilSheen
  // deriva todas as strings CSS a partir deles (tipagem simples e estável).
  return { bind, rotX, rotY, sx, sy, sActive };
}

/* ──────────────────────────────────────────────────────────────────────────
 * FoilSheen — camada de foil iridescente que se move com foilX/foilY.
 * Recebe MotionValues; usa blend-mode para parecer foil de verdade.
 * ────────────────────────────────────────────────────────────────────────── */
export function FoilSheen({
  sx,
  sy,
  sActive,
  intensity = 0.55,
}: {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  sActive: MotionValue<number>;
  intensity?: number;
}) {
  // foil desliza com o ponteiro (faixa exagerada p/ sensação tátil)
  const bgPos = useTransform(
    [sx, sy] as MotionValue<number>[],
    ([x, y]: number[]) => `${12 + x * 76}% ${18 + y * 64}%`,
  );
  // glare especular segue o dedo
  const glare = useTransform(
    [sx, sy] as MotionValue<number>[],
    ([x, y]: number[]) =>
      `radial-gradient(280px circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.85), transparent 60%)`,
  );
  const glareOpacity = useTransform(sActive, [0, 1], [0, 0.5]);
  return (
    <>
      {/* foil iridescente */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: FOIL,
          backgroundSize: "260% 260%",
          backgroundPosition: bgPos,
          mixBlendMode: "color-dodge",
          opacity: intensity,
        }}
      />
      {/* trama holográfica fina */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 7px)",
          mixBlendMode: "overlay",
        }}
      />
      {/* glare especular segue o dedo */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: glare,
          opacity: glareOpacity,
          mixBlendMode: "soft-light",
        }}
      />
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Shimmer — varredura iridescente animada em loop (TWEEN, 3+ keyframes OK)
 * ────────────────────────────────────────────────────────────────────────── */
export function Shimmer({ className, duration = 6 }: { className?: string; duration?: number }) {
  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{ background: FOIL, backgroundSize: "300% 300%", opacity: 0.5 }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{ duration, ease: "linear", repeat: Infinity }}
    />
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * IridText — texto com fill iridescente (gradiente animado em loop)
 * ────────────────────────────────────────────────────────────────────────── */
export function IridText({
  children,
  className,
  animate = true,
}: {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}) {
  return (
    <motion.span
      className={cn("bg-clip-text text-transparent", className)}
      style={{
        backgroundImage: FOIL,
        backgroundSize: "260% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
      }}
      animate={animate ? { backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] } : undefined}
      transition={animate ? { duration: 8, ease: "linear", repeat: Infinity } : undefined}
    >
      {children}
    </motion.span>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * ScanSweep — varredura de validação (passa uma vez ao validar o passe)
 * key controla replay; tween de 3 keyframes.
 * ────────────────────────────────────────────────────────────────────────── */
export function ScanSweep({ run, tone = "cyan" }: { run: number; tone?: "cyan" | "green" }) {
  if (run <= 0) return null;
  const color = tone === "green" ? HOLO.green : HOLO.cyan;
  return (
    <motion.div
      key={run}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute inset-y-0 w-1/3"
        initial={{ x: "-120%" }}
        animate={{ x: "320%" }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          filter: "blur(6px)",
          opacity: 0.9,
        }}
      />
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * IridBurst — explosão de partículas iridescentes (offsets derivados do index)
 * disparada por mudança de key. Para celebrações (GREEN / validado).
 * ────────────────────────────────────────────────────────────────────────── */
export function IridBurst({
  burstKey,
  count = 16,
  colors = [HOLO.purple, HOLO.cyan, HOLO.green],
}: {
  burstKey: number;
  count?: number;
  colors?: string[];
}) {
  if (burstKey <= 0) return null;
  return (
    <div
      key={burstKey}
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-0 w-0"
    >
      {Array.from({ length: count }).map((_, i) => {
        const ang = (i / count) * Math.PI * 2;
        const dist = 70 + (i % 4) * 26;
        const size = 5 + (i % 3) * 3;
        const color = colors[i % colors.length];
        return (
          <motion.span
            key={i}
            className="absolute rounded-[2px]"
            style={{ width: size, height: size, background: color }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
            animate={{
              x: Math.cos(ang) * dist,
              y: Math.sin(ang) * dist,
              opacity: 0,
              scale: 0.3,
              rotate: (i % 2 === 0 ? 1 : -1) * 180,
            }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          />
        );
      })}
      {/* flash central */}
      <motion.span
        className="absolute -left-12 -top-12 h-24 w-24 rounded-full"
        style={{ background: FOIL_CONIC, filter: "blur(14px)" }}
        initial={{ opacity: 0.9, scale: 0.3 }}
        animate={{ opacity: 0, scale: 1.8 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * HoloCheck — selo de check com anel iridescente (validado / green)
 * ────────────────────────────────────────────────────────────────────────── */
export function HoloCheck({ size = 56 }: { size?: number }) {
  return (
    <motion.div
      className="relative grid place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background: "rgba(52, 245, 160,0.10)",
      }}
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 16 }}
    >
      <span
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: `0 0 0 2px ${HOLO.green}, 0 0 24px -2px ${HOLO.green}`,
        }}
      />
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
        <motion.path
          d="M4 12.5l5 5 11-12"
          stroke={HOLO.green}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        />
      </svg>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * AvatarHolo — avatar real com anel iridescente
 * ────────────────────────────────────────────────────────────────────────── */
export function AvatarHolo({
  src,
  alt,
  size = 40,
  ring = true,
}: {
  src: string;
  alt: string;
  size?: number;
  ring?: boolean;
}) {
  if (!ring) {
    return (
      <img
        src={src}
        alt={alt}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
        loading="lazy"
      />
    );
  }
  return (
    <span
      className="inline-grid shrink-0 place-items-center rounded-full"
      style={{ width: size, height: size, background: FOIL, padding: 2 }}
    >
      <img
        src={src}
        alt={alt}
        className="rounded-full object-cover"
        style={{
          width: size - 4,
          height: size - 4,
          boxShadow: `0 0 0 2px ${HOLO.bg}`,
        }}
        loading="lazy"
      />
    </span>
  );
}
