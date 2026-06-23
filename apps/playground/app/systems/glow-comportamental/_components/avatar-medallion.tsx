"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GLOW } from "./primitives";

/* ──────────────────────────────────────────────────────────────────────────
   AvatarMedallion — pessoa REAL (foto local) em medalhão com anel glow.
   Substitui o antigo "PersonPlaceholder" (silhueta SVG — proibido).
   O tratamento do sistema: foto recortada em círculo + anel neon roxo/verde
   + leve duotone de glow por cima para integrar à pele dark do painel.
   ────────────────────────────────────────────────────────────────────────── */

type Tone = "purple" | "green" | "risk" | "muted";

const RING: Record<Tone, string> = {
  purple: GLOW.purple,
  green: GLOW.green,
  risk: GLOW.risk,
  muted: GLOW.muted,
};

export function AvatarMedallion({
  src,
  alt,
  size = 56,
  tone = "purple",
  pulse = false,
  className,
}: {
  src: string;
  alt: string;
  size?: number;
  tone?: Tone;
  pulse?: boolean;
  className?: string;
}) {
  const ring = RING[tone];
  return (
    <motion.div
      className={cn("relative shrink-0 rounded-full", className)}
      style={{ width: size, height: size }}
      animate={
        pulse
          ? {
              boxShadow: [`0 0 0px ${ring}00`, `0 0 18px 1px ${ring}88`, `0 0 0px ${ring}00`],
            }
          : undefined
      }
      transition={pulse ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      {/* anel externo */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: `0 0 0 2px ${ring}, 0 0 14px -2px ${ring}aa`,
        }}
      />
      {/* foto recortada + leve duotone do sistema */}
      <span
        className="absolute inset-[3px] overflow-hidden rounded-full"
        style={{ boxShadow: "inset 0 0 0 1px rgba(14,11,26,0.7)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          style={{
            filter: "saturate(0.92) contrast(1.02) brightness(0.96)",
          }}
        />
        {/* glow duotone por cima — verde ou roxo translucido */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full mix-blend-soft-light"
          style={{
            background: `radial-gradient(120% 120% at 30% 18%, ${ring}55, transparent 62%)`,
          }}
        />
      </span>
    </motion.div>
  );
}

/* ── AvatarStack — pilha de avatares reais sobrepostos (squad / liga) ──────── */
export function AvatarStack({
  people,
  size = 36,
  tone = "purple",
  max = 5,
  className,
}: {
  people: { name: string; avatar: string }[];
  size?: number;
  tone?: Tone;
  max?: number;
  className?: string;
}) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <div className={cn("flex items-center", className)}>
      {shown.map((p, i) => (
        <div key={p.name} style={{ marginLeft: i === 0 ? 0 : -size * 0.32, zIndex: max - i }}>
          <AvatarMedallion src={p.avatar} alt={p.name} size={size} tone={tone} />
        </div>
      ))}
      {extra > 0 && (
        <span
          className="ml-1 grid place-items-center rounded-full border border-[rgba(139,131,168,0.3)] bg-[#0E0B1A] text-[10px] font-medium text-[#8B83A8]"
          style={{ width: size, height: size }}
        >
          +{extra}
        </span>
      )}
    </div>
  );
}
