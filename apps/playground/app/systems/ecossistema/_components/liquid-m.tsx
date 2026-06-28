"use client";

import { motion } from "framer-motion";
import { GRADIENT } from "./tokens";

/**
 * O "M" líquido — motivo-assinatura do masterbrand: um blob gradiente lavanda
 * com blur, oscilando suave em loop. Reage ao interagir (pulsa/incha) via `pulse`.
 *
 * REGRA: animação em loop usa 2 valores OU tween com `times` — NUNCA spring em
 * array de 3+ keyframes. Aqui os loops são tweens com times explícitos.
 */
export function LiquidM({
  size = 200,
  pulse = 0,
  gradient = GRADIENT.muma,
  className,
}: {
  size?: number;
  /** Muda este número para fazer o blob "inchar" a cada interação. */
  pulse?: number;
  gradient?: string;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{ position: "relative", display: "inline-block", width: size, height: size }}
      aria-hidden
    >
      {/* halo difuso atrás */}
      <motion.span
        className="absolute inset-0"
        style={{
          borderRadius: "42% 58% 56% 44% / 50% 44% 56% 50%",
          background: gradient,
          filter: "blur(26px)",
          opacity: 0.55,
        }}
        animate={{
          borderRadius: [
            "42% 58% 56% 44% / 50% 44% 56% 50%",
            "58% 42% 44% 56% / 44% 58% 42% 56%",
            "42% 58% 56% 44% / 50% 44% 56% 50%",
          ],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 9, ease: "easeInOut", times: [0, 0.5, 1], repeat: Infinity }}
      />

      {/* corpo líquido do M */}
      <motion.span
        className="absolute inset-[14%]"
        style={{
          background: gradient,
          filter: "blur(6px)",
          boxShadow: "inset 0 0 30px rgba(255,255,255,.35)",
        }}
        animate={{
          borderRadius: [
            "56% 44% 48% 52% / 46% 54% 46% 54%",
            "44% 56% 54% 46% / 56% 44% 56% 44%",
            "56% 44% 48% 52% / 46% 54% 46% 54%",
          ],
          rotate: [0, -8, 0],
        }}
        transition={{ duration: 7, ease: "easeInOut", times: [0, 0.5, 1], repeat: Infinity }}
      />

      {/* o "M" desenhado sobre o blob */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        animate={{ scale: [1, 1.015, 1] }}
        transition={{ duration: 5.5, ease: "easeInOut", times: [0, 0.5, 1], repeat: Infinity }}
      >
        <motion.path
          d="M22 74 V30 L50 58 L78 30 V74"
          fill="none"
          stroke="rgba(255,255,255,.92)"
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ pathLength: [0.92, 1, 0.92] }}
          transition={{ duration: 6, ease: "easeInOut", times: [0, 0.5, 1], repeat: Infinity }}
        />
      </motion.svg>

      {/* pulso de interação — sopra entre 2 valores (spring OK aqui) */}
      <motion.span
        key={pulse}
        className="absolute inset-0"
        style={{
          borderRadius: "50%",
          background: gradient,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
        initial={{ scale: 0.6, opacity: 0.5 }}
        animate={{ scale: 1.35, opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
    </span>
  );
}
