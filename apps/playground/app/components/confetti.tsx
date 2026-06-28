"use client";

import { motion } from "framer-motion";
import { seeded } from "@/lib/brand";

/**
 * Confetti — explosão de pedacinhos coloridos a partir do centro.
 * Determinístico (seeded por índice, sem Math.random em render) e recolorível.
 * Use com uma `key` que muda a cada disparo. Multi-keyframe usa tween (não spring).
 */
export function Confetti({
  count = 28,
  colors = ["#41FFCA", "#3945FF", "#FF80E1", "#FF00FF"],
  spread = 160,
  size = 9,
}: {
  count?: number;
  colors?: string[];
  spread?: number;
  size?: number;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-visible">
      <div className="absolute left-1/2 top-1/2">
        {Array.from({ length: count }).map((_, i) => {
          const a = seeded(i) * Math.PI * 2;
          const dist = spread * (0.55 + seeded(i + 100) * 0.7);
          const x = Math.cos(a) * dist;
          const y = Math.sin(a) * dist - 40;
          const rot = (seeded(i + 7) - 0.5) * 540;
          const c = colors[i % colors.length];
          const round = i % 3 === 0;
          const w = size * (0.7 + seeded(i + 5) * 0.9);
          return (
            <motion.span
              key={i}
              className="absolute block"
              style={{
                width: w,
                height: round ? w : w * 1.7,
                background: c,
                borderRadius: round ? "9999px" : "2px",
              }}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
              animate={{
                x: [0, x * 0.5, x],
                y: [0, y * 0.5, y + 120],
                opacity: [1, 1, 0],
                rotate: [0, rot * 0.6, rot],
                scale: [1, 1, 0.6],
              }}
              transition={{
                duration: 1.05 + seeded(i + 3) * 0.5,
                ease: [0.22, 0.61, 0.36, 1],
                times: [0, 0.5, 1],
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
