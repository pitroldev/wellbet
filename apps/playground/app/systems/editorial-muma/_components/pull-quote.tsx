"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { USERS } from "@/lib/avatars";
import { M, SPRING, FRAUNCES_DISPLAY } from "./tokens";

type Quote = { who: number; line: string; meta: string };

const QUOTES: Quote[] = [
  { who: 8, line: "Apostei em mim e ganhei duas vezes: menos 9kg e a banca cheia.", meta: "-9kg em 8 semanas" },
  { who: 11, line: "A constância virou hábito quando passou a render. Quem continua, conquista.", meta: "streak de 41 dias" },
  { who: 12, line: "O dia que quase desisti, lembrei que tinha algo em jogo. Bora? Bora!", meta: "free bet resgatada" },
  { who: 9, line: "Sair do vermelho e ver o green cair foi o empurrão que faltava.", meta: "-6,5kg · pote da liga" },
];

export function PullQuote() {
  const [i, setI] = useState(0);
  const q = QUOTES[i];
  const u = USERS[q.who];

  return (
    <div className="relative overflow-hidden rounded-[6px] px-6 py-8 sm:px-10 sm:py-10" style={{ background: M.indigo, color: "#fff" }}>
      {/* aspas gigante serif */}
      <span
        className="pointer-events-none absolute -left-1 -top-12 select-none leading-none"
        style={{
          fontFamily: "var(--font-fraunces)",
          fontSize: "16rem",
          color: M.pink,
          fontVariationSettings: FRAUNCES_DISPLAY,
          opacity: 0.95,
        }}
        aria-hidden
      >
        “
      </span>

      <div className="relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.blockquote
            key={i}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={SPRING}
          >
            <p
              className="max-w-2xl font-[family-name:var(--font-fraunces)] leading-[1.05] tracking-[-0.01em]"
              style={{ fontSize: "clamp(1.5rem,5.5vw,2.6rem)", fontVariationSettings: FRAUNCES_DISPLAY, fontWeight: 400 }}
            >
              {q.line}
            </p>

            <figcaption className="mt-6 flex items-center gap-3">
              <span className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white/30">
                <Image src={u.avatar} alt={u.name} fill sizes="48px" className="object-cover" />
              </span>
              <span>
                <span className="block text-sm font-bold">{u.name}</span>
                <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-white/60">
                  {q.meta}
                </span>
              </span>
            </figcaption>
          </motion.blockquote>
        </AnimatePresence>

        <div className="mt-7 flex items-center gap-3 border-t border-white/15 pt-5">
          <div className="flex gap-1.5">
            {QUOTES.map((_, idx) => (
              <span
                key={idx}
                className="h-1.5 rounded-full transition-all"
                style={{ width: idx === i ? 20 : 6, background: idx === i ? M.pink : "rgba(255,255,255,.3)" }}
              />
            ))}
          </div>
          <motion.button
            type="button"
            onClick={() => setI((x) => (x + 1) % QUOTES.length)}
            whileTap={{ scale: 0.94 }}
            transition={SPRING}
            className="ml-auto inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold"
            style={{ background: M.pink, color: M.ink }}
          >
            Próximo depoimento <ArrowRight size={15} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
