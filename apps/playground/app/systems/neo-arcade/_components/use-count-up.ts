"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animate a number from its previous value to `target` with a stepped,
 * arcade-y feel. Returns the current animated value. Money/odds count-up that
 * always lands exactly on `target` (no float drift in the final frame).
 *
 * Snappy by default (short duration) — this is a fliperama, not a slow dial.
 */
export function useCountUp(target: number, durationMs = 650): number {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // easeOutQuart — fast then settle, reads as a counter slamming up
      const eased = 1 - Math.pow(1 - t, 4);
      const next = from + (target - from) * eased;
      setValue(t >= 1 ? target : next);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      fromRef.current = target;
    };
  }, [target, durationMs]);

  return value;
}

/** Format BRL money with no decimals drift (e.g. 1234.5 -> "1.234,50"). */
export function brl(n: number): string {
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Format odds like 2.40 -> "2,40". */
export function odds(n: number): string {
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
