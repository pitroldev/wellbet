"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE, DUR } from "./easing";

/**
 * Revela o conteúdo ao entrar na viewport (fade + sobe). Client island leve —
 * o resto da página continua estático (SSG). Respeita prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: DUR.base, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
