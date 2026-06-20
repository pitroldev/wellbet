"use client";

import { motion } from "framer-motion";
import { ISO } from "./tokens";
import { SPRING } from "./tokens";

/**
 * IsoTrophy — troféu 3D colecionável (badge da coleção / TOP 3).
 * Variantes de metal por cor; bounce no hover.
 */
export function IsoTrophy({
  size = 92,
  metal = ISO.yellow,
  metalDeep = ISO.yellowDeep,
  place,
}: {
  size?: number;
  metal?: string;
  metalDeep?: string;
  place?: number;
}) {
  return (
    <motion.div
      whileHover={{ y: -8, rotate: -3 }}
      transition={SPRING}
      className="relative inline-flex flex-col items-center"
      style={{ width: size }}
    >
      <svg width={size} height={size} viewBox="0 0 92 96" role="img" aria-label="Troféu">
        {/* sombra */}
        <ellipse cx="46" cy="90" rx="26" ry="6" fill={ISO.ink} opacity="0.85" />
        {/* base */}
        <rect
          x="32"
          y="74"
          width="28"
          height="10"
          rx="3"
          fill={metalDeep}
          stroke={ISO.ink}
          strokeWidth="3"
        />
        <rect x="38" y="62" width="16" height="14" fill={metal} stroke={ISO.ink} strokeWidth="3" />
        {/* taça */}
        <path
          d="M22 16 H70 V30 C70 48 60 60 46 60 C32 60 22 48 22 30 Z"
          fill={metal}
          stroke={ISO.ink}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* profundidade da taça */}
        <path d="M46 16 H70 V30 C70 48 60 60 46 60 Z" fill={metalDeep} opacity="0.5" />
        {/* alças */}
        <path d="M22 20 C8 20 8 40 24 42" fill="none" stroke={ISO.ink} strokeWidth="3.5" />
        <path d="M70 20 C84 20 84 40 68 42" fill="none" stroke={ISO.ink} strokeWidth="3.5" />
        {/* brilho sólido (sem glow) */}
        <circle cx="38" cy="28" r="4" fill="#FFFFFF" opacity="0.8" />
        {place && (
          <text
            x="46"
            y="44"
            textAnchor="middle"
            fontSize="22"
            fontWeight="800"
            fill={ISO.ink}
            fontFamily="var(--font-display)"
          >
            {place}
          </text>
        )}
      </svg>
    </motion.div>
  );
}
