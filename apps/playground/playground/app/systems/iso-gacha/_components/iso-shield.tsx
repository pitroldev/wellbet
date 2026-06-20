"use client";

import { motion } from "framer-motion";
import { ISO } from "./tokens";

/**
 * IsoShield — escudo 3D tátil (drop da roleta / proteção da ofensiva).
 * Volume por faces sólidas + check, com leve flutuação contínua.
 */
export function IsoShield({ size = 96, active = true }: { size?: number; active?: boolean }) {
  const main = active ? ISO.green : ISO.baseDeep;
  const deep = active ? ISO.greenDeep : "#B9AFD4";
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 96 110"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      role="img"
      aria-label={active ? "Shield ativo" : "Shield inativo"}
    >
      {/* sombra sólida deslocada */}
      <path
        d="M48 14 L84 26 V58 C84 84 66 98 48 106 C30 98 12 84 12 58 V26 Z"
        transform="translate(5 6)"
        fill={ISO.ink}
        opacity="0.9"
      />
      {/* corpo */}
      <path
        d="M48 8 L84 20 V52 C84 78 66 92 48 100 C30 92 12 78 12 52 V20 Z"
        fill={main}
        stroke={ISO.ink}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* faceta direita (profundidade) */}
      <path d="M48 8 L84 20 V52 C84 78 66 92 48 100 Z" fill={deep} opacity="0.55" />
      {/* check */}
      <path
        d="M33 54 L44 66 L66 38"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}
