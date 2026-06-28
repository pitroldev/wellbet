"use client";

/**
 * Faíscas elétricas — rajada de BoltMarks a partir do centro ao interagir.
 * Determinístico (seeded por índice, sem Math.random em render), multi-keyframe = tween.
 * Use com uma `key` que muda a cada disparo.
 */
import { motion } from "framer-motion";
import { BoltMark } from "@/app/components/wellbet-logo";
import { V, seeded } from "./tokens";

export function Sparks({
  count = 12,
  spread = 120,
  colors = [V.green, V.blue, V.blueSoft, V.white],
}: {
  count?: number;
  spread?: number;
  colors?: string[];
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-visible">
      <div className="absolute left-1/2 top-1/2">
        {Array.from({ length: count }).map((_, i) => {
          const a = seeded(i) * Math.PI * 2;
          const dist = spread * (0.5 + seeded(i + 40) * 0.8);
          const x = Math.cos(a) * dist;
          const y = Math.sin(a) * dist;
          const rot = (seeded(i + 9) - 0.5) * 360;
          const s = 10 + seeded(i + 3) * 12;
          const c = colors[i % colors.length];
          return (
            <motion.span
              key={i}
              className="absolute block -translate-x-1/2 -translate-y-1/2"
              style={{ color: c, width: s, height: s, filter: `drop-shadow(0 0 6px ${c})` }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.2, rotate: 0 }}
              animate={{
                x: [0, x * 0.55, x],
                y: [0, y * 0.55, y],
                opacity: [0, 1, 0],
                scale: [0.2, 1, 0.5],
                rotate: [0, rot * 0.6, rot],
              }}
              transition={{
                duration: 0.65 + seeded(i + 2) * 0.35,
                ease: [0.2, 0.7, 0.3, 1],
                times: [0, 0.45, 1],
              }}
            >
              <BoltMark style={{ width: "100%", height: "100%", color: "currentColor" }} />
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}

/** Linha elétrica fininha que cruza um card (decorativa, animada por loop tween). */
export function ElectricLine({ className }: { className?: string }) {
  return (
    <div className={"pointer-events-none absolute inset-x-0 overflow-hidden " + (className ?? "")}>
      <motion.div
        className="h-px w-1/3"
        style={{ background: "linear-gradient(90deg,transparent,#41FFCA,#3945FF,transparent)" }}
        animate={{ x: ["-40%", "340%"] }}
        transition={{ duration: 3.6, ease: "linear", repeat: Infinity }}
      />
    </div>
  );
}
