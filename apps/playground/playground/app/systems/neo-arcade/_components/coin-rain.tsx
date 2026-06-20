"use client";

import { motion } from "framer-motion";
import { seeded } from "./primitives";

/**
 * Hand-made pixel coin/confetti rain for "deu green" / payout moments.
 * Particles are derived deterministically from index (no Math.random in render)
 * and re-fire on every `burstKey` change. Render INSIDE a relative container.
 *
 * Two flavors:
 *  - "rain": coins fall from the top (payout / chuva de moedas)
 *  - "pop":  confetti bursts outward from center (FAZER APOSTA slam)
 */
const COLORS = ["#FFD60A", "#22E06B", "#8B5CF6", "#EDE9FE"];

export function CoinRain({
  burstKey,
  count = 26,
  mode = "rain",
}: {
  burstKey: number;
  count?: number;
  mode?: "rain" | "pop";
}) {
  if (burstKey === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const isCoin = i % 3 === 0;
        const color = COLORS[i % COLORS.length];
        const size = isCoin ? 10 : 6 + Math.round(seeded(i + 4) * 5);

        if (mode === "pop") {
          const ang = (i / count) * Math.PI * 2 + seeded(i) * 0.7;
          const dist = 70 + seeded(i + 9) * 120;
          return (
            <motion.span
              key={`${burstKey}-${i}`}
              className="absolute left-1/2 top-1/2"
              style={{
                width: size,
                height: size,
                background: color,
                borderRadius: 0,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
              animate={{
                x: Math.cos(ang) * dist,
                y: Math.sin(ang) * dist - 20,
                opacity: 0,
                scale: 0.4,
                rotate: (seeded(i + 3) - 0.5) * 360,
              }}
              transition={{
                duration: 0.7 + seeded(i + 2) * 0.4,
                ease: "easeOut",
                delay: seeded(i + 7) * 0.08,
              }}
            />
          );
        }

        // rain
        const left = `${Math.round(seeded(i) * 100)}%`;
        const fall = 220 + seeded(i + 11) * 180;
        const drift = (seeded(i + 5) - 0.5) * 60;
        return (
          <motion.span
            key={`${burstKey}-${i}`}
            className="absolute top-0"
            style={{
              left,
              width: size,
              height: size,
              background: color,
              borderRadius: 0,
              boxShadow: isCoin ? `inset 0 0 0 2px #B8860B` : undefined,
            }}
            initial={{ y: -30, opacity: 0, rotate: 0 }}
            animate={{
              y: fall,
              x: drift,
              opacity: [0, 1, 1, 0],
              rotate: (seeded(i + 8) - 0.5) * 540,
            }}
            transition={{
              duration: 1 + seeded(i + 6) * 0.7,
              ease: "easeIn",
              delay: seeded(i + 1) * 0.4,
              times: [0, 0.1, 0.8, 1],
            }}
          />
        );
      })}
    </div>
  );
}
