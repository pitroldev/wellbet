"use client";

import { motion } from "framer-motion";
import { J } from "./tokens";

/**
 * MarqueeFrame — bulbos de luz (marquee de cassino) perseguindo a borda da
 * moldura. Pontos que piscam em sequência: anima opacity entre 2 valores com
 * delay por índice (regra: 2 keyframes -> tween/repeat ok; nunca spring 3+).
 * Decorativo (pointer-events-none). Use como filho posicionado no card.
 */
export function MarqueeFrame({
  count = 28,
  color = J.pink,
  glow = J.magenta,
  inset = 8,
  size = 7,
}: {
  count?: number;
  color?: string;
  glow?: string;
  inset?: number;
  /** diâmetro do bulbo em px */
  size?: number;
}) {
  // distribui os bulbos pelo perímetro de um retângulo arredondado
  const half = Math.ceil(count / 2);
  const bulbs = Array.from({ length: count }, (_, i) => {
    const onTop = i < half;
    const t = (onTop ? i : i - half) / Math.max(1, half - 1); // 0..1
    const left = `${t * 100}%`;
    return { i, onTop, left };
  });

  return (
    <div className="pointer-events-none absolute z-20" style={{ inset }}>
      {bulbs.map(({ i, onTop, left }) => (
        <motion.span
          key={i}
          className="absolute block rounded-full"
          style={{
            width: size,
            height: size,
            left,
            top: onTop ? 0 : "auto",
            bottom: onTop ? "auto" : 0,
            marginLeft: -size / 2,
            background: color,
            boxShadow: `0 0 ${size}px ${size / 2}px ${glow}`,
          }}
          animate={{ opacity: [0.25, 1] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: (i % 6) * 0.12, // perseguição em sequência
          }}
        />
      ))}
    </div>
  );
}

/** Fileira horizontal de bulbos (rodapé/topo de painel). */
export function BulbRow({
  count = 12,
  color = J.gold,
  glow = J.goldDeep,
  size = 6,
}: {
  count?: number;
  color?: string;
  glow?: string;
  size?: number;
}) {
  return (
    <div className="flex items-center justify-between">
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          className="block rounded-full"
          style={{
            width: size,
            height: size,
            background: color,
            boxShadow: `0 0 ${size + 2}px ${glow}`,
          }}
          animate={{ opacity: [0.3, 1] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: (i % 5) * 0.1,
          }}
        />
      ))}
    </div>
  );
}
