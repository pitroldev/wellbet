"use client";

import type { JSX, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Reveal "premium": o conteúdo sobe de dentro de uma máscara (overflow-hidden).
 * Nível de LINHA (funciona com palavra em gradiente dentro). Respeita reduce-motion.
 */
export function RevealText({
  children,
  className,
  delay = 0,
  once = true,
  /** Anima no LOAD (acima da dobra) em vez de no scroll-into-view. */
  immediate = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  immediate?: boolean;
}): JSX.Element {
  const reduce = useReducedMotion();
  if (reduce) return <span className={cn("block", className)}>{children}</span>;

  const anim = immediate
    ? { initial: { y: "115%" }, animate: { y: "0%" } }
    : { initial: { y: "115%" }, whileInView: { y: "0%" }, viewport: { once, margin: "-80px" } };

  return (
    <span className="block overflow-hidden pb-[0.12em]">
      <motion.span
        className={cn("block", className)}
        {...anim}
        transition={{ duration: 0.8, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
