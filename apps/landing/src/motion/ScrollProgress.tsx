"use client";

import type { JSX } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Barra de progresso de leitura — régua no gradiente da marca que enche
 * conforme a página rola. Spring suave; decorativa (aria-hidden).
 */
export function ScrollProgress(): JSX.Element {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[70] h-1 origin-left"
      style={{ scaleX, background: "var(--gradient-brand)" }}
    />
  );
}
