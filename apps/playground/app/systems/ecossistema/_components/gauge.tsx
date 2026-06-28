"use client";

import { motion } from "framer-motion";
import { SPRING } from "./tokens";

/**
 * Gauge em arco SVG (instrumento de dado elegante). Arco de 270° vidro periwinkle,
 * progresso na cor passada. Anima entre 2 valores (offset) — sem keyframes.
 */
export function ArcGauge({
  value,
  color,
  size = 132,
  stroke = 11,
  label,
  sub,
}: {
  value: number; // 0..1
  color: string;
  size?: number;
  stroke?: number;
  label?: React.ReactNode;
  sub?: string;
}) {
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const GAP = 90; // graus de abertura na base
  const sweep = 360 - GAP;
  const circ = 2 * Math.PI * r;
  const arcLen = (sweep / 360) * circ;
  const dash = `${arcLen} ${circ}`;
  const v = Math.max(0, Math.min(1, value));
  // rotaciona pra abrir o gap embaixo (centrado)
  const rot = 90 + GAP / 2;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: `rotate(${rot}deg)` }}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(204,209,255,.18)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={dash}
        />
        <motion.circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={dash}
          initial={false}
          animate={{ strokeDashoffset: arcLen * (1 - v) }}
          transition={SPRING}
          style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center text-center">
        {label}
        {sub && (
          <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: "rgba(204,209,255,.7)" }}>
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}
