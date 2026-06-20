"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ISO } from "./tokens";

/**
 * IsoRing — anel de progresso com "cara 3D": dois aros sólidos deslocados
 * (sombra tátil) e o arco de progresso por cima, com count-up no scroll.
 */
export function IsoRing({
  value,
  max = 1000,
  size = 200,
  label = "CHARYA Score",
  color = ISO.purple,
}: {
  value: number;
  max?: number;
  size?: number;
  label?: string;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const r = size / 2 - 16;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);

  const display = useMotionValue(0);
  const spring = useSpring(display, { stiffness: 60, damping: 18 });
  const rounded = useTransform(spring, (v) => Math.round(v));
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (inView) display.set(value);
  }, [inView, value, display]);
  useEffect(() => rounded.on("change", (v) => setShown(v)), [rounded]);

  return (
    <div ref={ref} className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0">
        {/* aro de "sombra" deslocado pra dar volume */}
        <circle
          cx={size / 2 + 5}
          cy={size / 2 + 6}
          r={r}
          fill="none"
          stroke={ISO.ink}
          strokeWidth="16"
          opacity="0.9"
        />
        {/* trilho */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={ISO.baseDeep}
          strokeWidth="16"
        />
        {/* progresso */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={inView ? { strokeDashoffset: circ * (1 - pct) } : {}}
          transition={{ type: "spring", stiffness: 40, damping: 16 }}
        />
        {/* contorno do progresso (linha escura interna pra leitura tátil) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={ISO.ink}
          strokeWidth="2"
          opacity="0.18"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-[family-name:var(--font-display)] text-5xl font-bold leading-none tabular-nums"
          style={{ color: ISO.ink }}
        >
          {shown}
        </span>
        <span className="text-xs font-semibold" style={{ color: ISO.inkSoft }}>
          / {max}
        </span>
        <span className="mt-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color }}>
          {label}
        </span>
      </div>
    </div>
  );
}
