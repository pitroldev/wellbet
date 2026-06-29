"use client";

import { useEffect, useRef, useState, type JSX } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·/\\<>";

/**
 * Texto que "decodifica" (embaralha caracteres e revela a palavra final) ao
 * entrar na viewport. Dopamina de placar/decoder — usar com PARCIMÔNIA (1
 * palavra-herói). Reduce-motion / SSR → mostra o texto final direto.
 */
export function Scramble({ text, className }: { text: string; className?: string }): JSX.Element {
  const ref = useRef<HTMLSpanElement>(null);
  const [out, setOut] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let started = false;
    const run = () => {
      const start = performance.now();
      const dur = 850;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        const revealed = Math.floor(p * text.length);
        let s = "";
        for (let i = 0; i < text.length; i++) {
          s +=
            i < revealed || text[i] === " "
              ? text[i]
              : CHARS[
                  Math.floor(Math.sin(now / 30 + i) * 0.5 * CHARS.length + CHARS.length) %
                    CHARS.length
                ];
        }
        setOut(s);
        if (p < 1) raf = requestAnimationFrame(tick);
        else setOut(text);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started) {
          started = true;
          run();
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text]);

  return (
    <span ref={ref} className={className}>
      {out}
    </span>
  );
}
