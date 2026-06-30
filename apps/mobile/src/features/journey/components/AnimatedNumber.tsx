/**
 * Número que SOBE (count-up) — metade do "juice" do Duolingo. JS-driven via rAF
 * (easeOutCubic), barato pra valores que mudam de vez em quando. Respeita
 * reduce-motion (mostra o valor final na hora). Inteiros (stake/dias/streak/prêmio).
 */
import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/shared/motion";
import { Text, type TextProps } from "@/shared/ui";

export interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  /** Se definido, anima a partir deste valor já na montagem (ex.: 0 → prêmio). */
  mountFrom?: number;
  variant?: TextProps["variant"];
  className?: string;
}

export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  durationMs = 700,
  mountFrom,
  variant = "mono",
  className,
}: AnimatedNumberProps) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(mountFrom ?? value);
  const fromRef = useRef(mountFrom ?? value);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (reduced || from === to || durationMs <= 0) {
      setDisplay(to);
      fromRef.current = to;
      return;
    }
    const start = Date.now();
    let raf = 0;
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs, reduced]);

  return (
    <Text variant={variant} className={className}>
      {prefix}
      {Math.round(display)}
      {suffix}
    </Text>
  );
}
