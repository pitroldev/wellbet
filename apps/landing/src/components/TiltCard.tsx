"use client";

import type { JSX, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Cartão holográfico/tátil (técnica pokemon-cards-css): inclina em 3D seguindo o
 * cursor + brilho iridescente (sheen) que acompanha o ponteiro via mix-blend.
 * O cupom de aposta vira objeto desejável. Reduce-motion → estático.
 */
export function TiltCard({
  children,
  className,
  max = 9,
}: {
  children: ReactNode;
  className?: string;
  /** Inclinação máxima (graus). */
  max?: number;
}): JSX.Element {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 150, damping: 16 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 150, damping: 16 });
  const sheen = useTransform(
    [mx, my],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${(x ?? 0.5) * 100}% ${(y ?? 0.5) * 100}%, rgba(255,128,225,0.55), rgba(255,0,255,0.16) 38%, transparent 68%)`,
  );

  if (reduce) return <div className={cn("relative", className)}>{children}</div>;

  return (
    <motion.div
      className={cn("relative", className)}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
    >
      {children}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-45 mix-blend-color-dodge"
        style={{ background: sheen }}
      />
    </motion.div>
  );
}
