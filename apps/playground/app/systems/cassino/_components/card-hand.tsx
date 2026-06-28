"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Spade, Heart, Diamond, Club, RotateCcw } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { N, SPRING, seeded, neonText } from "./tokens";

/**
 * Mão de cartas (blackjack-ish). "Distribuir" -> as cartas viram com flip
 * (rotateY entre 2 valores, spring) -> soma a mão -> "deu green" se >= alvo.
 * Cartas determinísticas por rodada (seeded). Flip é entre 2 valores → spring OK.
 */

type Suit = "spade" | "heart" | "diamond" | "club";
const SUITS: { key: Suit; Icon: typeof Spade; red: boolean }[] = [
  { key: "spade", Icon: Spade, red: false },
  { key: "heart", Icon: Heart, red: true },
  { key: "diamond", Icon: Diamond, red: true },
  { key: "club", Icon: Club, red: false },
];
const RANKS = ["A", "K", "Q", "J", "10", "9", "8", "7"];
const RANK_VALUE: Record<string, number> = { A: 11, K: 10, Q: 10, J: 10, "10": 10, "9": 9, "8": 8, "7": 7 };
const TARGET = 18; // deu green se a mão >= 18 (e <= 21)

function dealCard(round: number, slot: number) {
  const r = seeded(round * 7.3 + slot * 2.9 + 0.5);
  const s = seeded(round * 3.1 + slot * 5.7 + 1.1);
  const rank = RANKS[Math.floor(r * RANKS.length) % RANKS.length];
  const suit = SUITS[Math.floor(s * SUITS.length) % SUITS.length];
  return { rank, suit };
}

export function CardHand() {
  const [round, setRound] = useState(0);
  const [dealt, setDealt] = useState(false);

  const cards = [0, 1, 2].map((slot) => dealCard(round, slot));
  let total = cards.reduce((sum, c) => sum + RANK_VALUE[c.rank], 0);
  // ajuste de Ás (11 -> 1) pra não estourar, blackjack clássico
  let aces = cards.filter((c) => c.rank === "A").length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  const green = dealt && total >= TARGET && total <= 21;
  const bust = dealt && total > 21;

  function deal() {
    setRound((r) => r + 1);
    setDealt(true);
  }

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-6"
      style={{
        background: `radial-gradient(circle at 50% 0%, ${N.green}14, transparent 60%), linear-gradient(180deg, ${N.panel}, ${N.ground})`,
        border: `1px solid ${N.line}`,
      }}
    >
      {green && <Confetti key={round} colors={[N.green, N.gold, "#fff"]} spread={150} />}

      <div className="flex items-center justify-between">
        <span
          className="font-[family-name:var(--font-mono)] text-sm font-bold uppercase tracking-[0.18em]"
          style={{ color: N.green, textShadow: neonText(N.green) }}
        >
          Mão · feche em {TARGET}+
        </span>
        <span className="font-[family-name:var(--font-mono)] text-sm tabular-nums" style={{ color: N.white }}>
          {dealt ? total : "—"}
        </span>
      </div>

      {/* feltro com cartas */}
      <div className="mt-5 flex items-end justify-center gap-3" style={{ perspective: 1000 }}>
        {cards.map((c, i) => (
          <motion.div
            key={`${round}-${i}`}
            className="relative h-[132px] w-[92px]"
            initial={{ rotateY: 180, y: -10, opacity: 0 }}
            animate={{ rotateY: dealt ? 0 : 180, y: 0, opacity: 1 }}
            transition={{ ...SPRING, delay: dealt ? i * 0.14 : 0 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* verso */}
            <CardFace back>
              <div
                className="grid h-full w-full place-items-center rounded-xl"
                style={{
                  background: `repeating-linear-gradient(45deg, ${N.indigo}, ${N.indigo} 6px, ${N.indigoSoft} 6px, ${N.indigoSoft} 12px)`,
                  border: `2px solid ${N.gold}`,
                }}
              >
                <span
                  className="font-[family-name:var(--font-fraunces)] text-2xl"
                  style={{ color: N.gold }}
                >
                  W
                </span>
              </div>
            </CardFace>
            {/* frente */}
            <CardFace>
              <div
                className="relative grid h-full w-full place-items-center rounded-xl"
                style={{ background: "#fff", border: `2px solid ${N.line}`, color: c.suit.red ? N.magenta : N.groundDeep }}
              >
                <span className="absolute left-2 top-1.5 font-[family-name:var(--font-mono)] text-sm font-bold">
                  {c.rank}
                </span>
                <c.suit.Icon size={34} fill="currentColor" />
                <span className="absolute bottom-1.5 right-2 rotate-180 font-[family-name:var(--font-mono)] text-sm font-bold">
                  {c.rank}
                </span>
              </div>
            </CardFace>
          </motion.div>
        ))}
      </div>

      {/* resultado */}
      <div
        className="mt-5 flex min-h-[48px] items-center justify-center rounded-2xl px-4 py-2 text-center"
        style={{ background: N.groundDeep, border: `1px solid ${N.line}` }}
      >
        {!dealt ? (
          <span className="text-sm" style={{ color: N.mute }}>
            Distribua e torça pra fechar a mão.
          </span>
        ) : green ? (
          <span
            className="font-[family-name:var(--font-archivo)] text-lg font-black uppercase tracking-tight"
            style={{ color: N.green, textShadow: neonText(N.green) }}
          >
            Deu green! Mão de {total}
          </span>
        ) : bust ? (
          <span className="text-base font-extrabold" style={{ color: N.pink }}>
            Estourou com {total}. Bora de novo!
          </span>
        ) : (
          <span className="text-base font-bold" style={{ color: N.mute }}>
            {total} na mão — faltou pra {TARGET}.
          </span>
        )}
      </div>

      <motion.button
        type="button"
        onClick={deal}
        whileTap={{ scale: 0.97 }}
        transition={SPRING}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-extrabold"
        style={{ background: N.green, color: N.greenInk, boxShadow: `0 0 20px ${N.green}66` }}
      >
        {dealt ? <RotateCcw size={18} /> : <Spade size={18} fill={N.greenInk} />}
        {dealt ? "Nova mão" : "Distribuir cartas"}
      </motion.button>
    </div>
  );
}

function CardFace({ children, back }: { children: React.ReactNode; back?: boolean }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: back ? "rotateY(180deg)" : undefined,
      }}
    >
      {children}
    </div>
  );
}
