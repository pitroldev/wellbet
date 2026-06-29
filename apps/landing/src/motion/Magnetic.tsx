"use client";

import { useRef, type JSX, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Efeito magnético — o filho é puxado levemente em direção ao cursor no hover
 * (toque premium de site award). Força sutil (0.25). Respeita reduced-motion.
 */
export function Magnetic({
  children,
  className,
  strength = 0.25,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}): JSX.Element {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  if (reduce) return <span className={cn("inline-block", className)}>{children}</span>;

  return (
    <motion.span
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
