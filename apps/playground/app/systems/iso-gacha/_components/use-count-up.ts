"use client";

import { useEffect, useState } from "react";

/**
 * useCountUp — anima um número de `from` até `to` com easing suave.
 * Reinicia toda vez que `to` ou `runKey` mudam (pra repetir a microvitória).
 */
export function useCountUp(to: number, durationMs = 700, runKey: number = 0) {
  const [value, setValue] = useState(to);

  useEffect(() => {
    let raf = 0;
    const from = value;
    const start = performance.now();
    const delta = to - from;
    if (delta === 0) return;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + delta * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, runKey, durationMs]);

  return value;
}
