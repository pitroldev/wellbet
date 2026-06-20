"use client";

import { motion } from "framer-motion";
import { ISO } from "./tokens";

const COLORS = [ISO.purple, ISO.green, ISO.yellow, ISO.coral, ISO.purpleSoft];

/**
 * Pseudo-random determinístico por índice (sem Math.random) — evita
 * mismatch de hidratação e mantém o burst reproduzível.
 */
function rnd(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Confetti — burst colecionável: pedaços SÓLIDOS (sem brilho) que explodem
 * em todas as direções, giram e caem com easing de mola. Disparado por uma
 * `key` remontável no componente pai. Feito 100% à mão (sem lib externa).
 */
export function Confetti({ count = 28 }: { count?: number }) {
  const pieces = Array.from({ length: count });
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-visible">
      {pieces.map((_, i) => {
        const angle = (i / count) * Math.PI * 2 + rnd(i) * 0.6;
        const dist = 90 + rnd(i + 7) * 150;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 60;
        const color = COLORS[i % COLORS.length];
        const square = i % 3 === 0;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2"
            initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: dx,
              y: [dy, dy + 220],
              scale: [0, 1, 1, 0.6],
              rotate: rnd(i + 3) * 540 - 270,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 1.1 + rnd(i + 11) * 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              width: square ? 10 : 8,
              height: square ? 10 : 14,
              background: color,
              borderRadius: square ? 2 : 6,
              border: `1.5px solid ${ISO.ink}`,
            }}
          />
        );
      })}
    </div>
  );
}

/**
 * Burst — explosão pequena e RADIAL (estilo aplauso/curtida) que floresce
 * sobre um ponto. Usada nas reações de squad sobre os avatares reais.
 */
export function Burst({
  count = 12,
  color = ISO.green,
  radius = 40,
}: {
  count?: number;
  color?: string;
  radius?: number;
}) {
  const pieces = Array.from({ length: count });
  return (
    <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center overflow-visible">
      {pieces.map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const dist = radius + rnd(i) * radius * 0.6;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        return (
          <motion.span
            key={i}
            className="absolute"
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x: dx, y: dy, scale: [0, 1, 0], opacity: [1, 1, 0] }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: 9,
              height: 9,
              background: i % 2 === 0 ? color : ISO.yellow,
              borderRadius: i % 3 === 0 ? 2 : 9,
              border: `1.5px solid ${ISO.ink}`,
            }}
          />
        );
      })}
    </div>
  );
}
