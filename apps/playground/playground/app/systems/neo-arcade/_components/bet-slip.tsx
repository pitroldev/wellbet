"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HudLabel, PixelCoin, PixelShield } from "./primitives";
import { CoinRain } from "./coin-rain";
import { useCountUp, brl, odds } from "./use-count-up";

/**
 * CUPOM DE APOSTA — the core dopamine widget.
 * Pick a goal (each carries its own odds), feed the STAKE with arcade
 * "+R$" coin buttons (INSERT COIN), and watch the COTAÇÃO and RETORNO POTENCIAL
 * slam upward in a live 8-bit odds board. Hit FAZER APOSTA for a coin pop +
 * LEVEL UP "APOSTA FEITA!" toast. Reset to play again.
 *
 * Money + odds are rendered in the legible body font, never pixel.
 */

type Goal = {
  id: string;
  label: string;
  prazo: string;
  baseOdds: number;
};

const GOALS: Goal[] = [
  {
    id: "peso",
    label: "Perder 8 kg em 4 meses",
    prazo: "13/10/2026",
    baseOdds: 2.4,
  },
  {
    id: "corrida",
    label: "Correr 5 km em 30 min",
    prazo: "01/09/2026",
    baseOdds: 1.85,
  },
  {
    id: "treino",
    label: "Treinar 5x/semana por 90 dias",
    prazo: "11/09/2026",
    baseOdds: 3.1,
  },
];

const STEPS = [10, 25, 50];
const MIN = 20;
const MAX = 500;

export function BetSlip() {
  const [goalId, setGoalId] = useState<string>(GOALS[0].id);
  const [stake, setStake] = useState(50);
  const [placed, setPlaced] = useState(false);
  const [burst, setBurst] = useState(0);

  const goal = useMemo(() => GOALS.find((g) => g.id === goalId)!, [goalId]);

  // odds nudge down a touch as the stake climbs (more skin in the game => the
  // engine tightens it) — keeps the board feeling alive when you feed coins.
  const liveOdds = useMemo(() => {
    const nudge = Math.min(0.35, ((stake - MIN) / (MAX - MIN)) * 0.45);
    return Math.max(1.2, goal.baseOdds - nudge);
  }, [goal, stake]);

  const payout = stake * liveOdds;

  const animatedOdds = useCountUp(liveOdds, 500);
  const animatedPayout = useCountUp(payout, 600);

  const reset = () => {
    setPlaced(false);
    setBurst(0);
  };

  return (
    <div
      className="relative overflow-hidden bg-[#1C1140] p-5 sm:p-6"
      style={{ boxShadow: "0 0 0 4px #6D28D9, 10px 10px 0 0 #2E1065" }}
    >
      <CoinRain burstKey={burst} mode="pop" count={30} />

      {/* header */}
      <div className="flex items-center justify-between">
        <HudLabel className="text-[11px] text-[#9D8FC7]">CUPOM · WELLBET</HudLabel>
        <span className="flex items-center gap-1.5 bg-[#120A24] px-2.5 py-1.5">
          <PixelCoin size={14} />
          <span className="font-[family-name:var(--font-body)] text-xs font-semibold tabular-nums text-[#EDE9FE]">
            Banca R$ 340,00
          </span>
        </span>
      </div>

      {/* 1 · escolher a meta (cada uma = uma cotação) */}
      <HudLabel className="mt-5 block text-[10px] text-[#8B5CF6]">1 · SEU PALPITE</HudLabel>
      <div className="mt-2 grid gap-2">
        {GOALS.map((g) => {
          const active = g.id === goalId;
          return (
            <motion.button
              key={g.id}
              onClick={() => !placed && setGoalId(g.id)}
              disabled={placed}
              whileTap={{ x: 2, y: 2 }}
              className="flex items-center justify-between gap-3 px-3 py-3 text-left disabled:opacity-60"
              style={{
                background: active ? "#2E1065" : "#120A24",
                boxShadow: active ? "0 0 0 2px #8B5CF6" : "0 0 0 2px #2E1065",
              }}
            >
              <span className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="h-3.5 w-3.5 shrink-0"
                  style={{
                    background: active ? "#22E06B" : "transparent",
                    boxShadow: `0 0 0 2px ${active ? "#22E06B" : "#4A3A7A"}`,
                  }}
                />
                <span className="font-[family-name:var(--font-body)] text-sm leading-tight text-[#EDE9FE]">
                  {g.label}
                  <span className="mt-0.5 block text-[11px] text-[#9D8FC7]">Prazo {g.prazo}</span>
                </span>
              </span>
              <span
                className="shrink-0 px-2 py-1 font-[family-name:var(--font-body)] text-sm font-bold tabular-nums"
                style={{
                  color: active ? "#22E06B" : "#9D8FC7",
                  background: "#1C1140",
                  boxShadow: `0 0 0 2px ${active ? "#22E06B" : "#2E1065"}`,
                }}
              >
                {odds(g.baseOdds)}x
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* 2 · stake = INSERT COIN */}
      <HudLabel className="mt-5 block text-[10px] text-[#FFD60A]">2 · INSERT COIN · STAKE</HudLabel>
      <div className="mt-2 bg-[#120A24] p-3" style={{ boxShadow: "inset 0 0 0 2px #2E1065" }}>
        <div className="flex items-end justify-between">
          <span className="font-[family-name:var(--font-body)] text-xs text-[#9D8FC7]">
            Você aposta
          </span>
          <span className="font-[family-name:var(--font-body)] text-3xl font-bold tabular-nums leading-none text-[#FFD60A]">
            R$ {brl(stake)}
          </span>
        </div>
        {/* stepped stake meter */}
        <div className="mt-3 flex h-3 gap-[2px] bg-[#2E1065] p-[2px]">
          {Array.from({ length: 20 }).map((_, i) => {
            const frac = (stake - MIN) / (MAX - MIN);
            const lit = i < Math.round(frac * 20);
            return (
              <span
                key={i}
                className="h-full flex-1"
                style={{ background: lit ? "#FFD60A" : "transparent" }}
              />
            );
          })}
        </div>
        {/* coin buttons (touch-friendly >=44px) */}
        <div className="mt-3 flex flex-wrap gap-2">
          {STEPS.map((s) => (
            <motion.button
              key={s}
              onClick={() => !placed && setStake((v) => Math.min(MAX, v + s))}
              disabled={placed}
              whileTap={{ x: 2, y: 2 }}
              className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 bg-[#FFD60A] px-3 font-[family-name:var(--font-body)] text-sm font-bold text-[#120A24] disabled:opacity-50"
              style={{ boxShadow: "3px 3px 0 0 #B8860B" }}
            >
              <PixelCoin size={16} /> +R${s}
            </motion.button>
          ))}
          <motion.button
            onClick={() => !placed && setStake(MIN)}
            disabled={placed}
            whileTap={{ x: 2, y: 2 }}
            className="min-h-[44px] bg-[#1C1140] px-4 font-[family-name:var(--font-hud)] text-[10px] uppercase tracking-[0.16em] text-[#9D8FC7] disabled:opacity-50"
            style={{ boxShadow: "0 0 0 2px #2E1065" }}
          >
            zerar
          </motion.button>
        </div>
      </div>

      {/* 3 · odds board (live) */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="bg-[#120A24] p-3 text-center" style={{ boxShadow: "0 0 0 2px #8B5CF6" }}>
          <HudLabel className="block text-[9px] text-[#8B5CF6]">COTAÇÃO</HudLabel>
          <motion.span
            key={Math.round(liveOdds * 100)}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 600, damping: 18 }}
            className="mt-1 block font-[family-name:var(--font-body)] text-2xl font-bold tabular-nums text-[#EDE9FE]"
          >
            {odds(animatedOdds)}x
          </motion.span>
        </div>
        <div className="bg-[#120A24] p-3 text-center" style={{ boxShadow: "0 0 0 2px #22E06B" }}>
          <HudLabel className="block text-[9px] text-[#22E06B]">SE DER GREEN</HudLabel>
          <span className="mt-1 block font-[family-name:var(--font-body)] text-2xl font-bold tabular-nums text-[#22E06B]">
            R$ {brl(animatedPayout)}
          </span>
        </div>
      </div>

      {/* CTA / toast */}
      <div className="relative mt-5 min-h-[60px]">
        <AnimatePresence mode="wait">
          {!placed ? (
            <motion.button
              key="cta"
              onClick={() => {
                setPlaced(true);
                setBurst((b) => b + 1);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileTap={{ x: 4, y: 4, boxShadow: "1px 1px 0 0 #047857" }}
              className="block w-full bg-[#22E06B] px-5 py-4 font-[family-name:var(--font-display)] text-xs text-[#06140C]"
              style={{ boxShadow: "5px 5px 0 0 #047857" }}
            >
              ▶ FAZER APOSTA
            </motion.button>
          ) : (
            <motion.div
              key="done"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, x: [0, -3, 3, -2, 0] }}
              transition={{
                scale: { type: "spring", stiffness: 700, damping: 15 },
                x: { duration: 0.18, ease: "linear" },
              }}
              className="bg-[#120A24] px-4 py-4 text-center"
              style={{ boxShadow: "0 0 0 4px #22E06B, 6px 6px 0 0 #047857" }}
            >
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.1, repeat: 2 }}
                className="font-[family-name:var(--font-display)] text-base text-[#22E06B]"
              >
                APOSTA FEITA!
              </motion.div>
              <p className="mt-2 font-[family-name:var(--font-body)] text-sm text-[#EDE9FE]">
                R$ {brl(stake)} em <strong>{goal.label}</strong> · retorno potencial{" "}
                <strong className="text-[#22E06B]">R$ {brl(payout)}</strong>
              </p>
              <button
                onClick={reset}
                className="mt-2 inline-flex min-h-[44px] items-center justify-center px-3 font-[family-name:var(--font-hud)] text-[10px] uppercase tracking-[0.18em] text-[#9D8FC7] underline underline-offset-4 transition-colors hover:text-[#EDE9FE] active:text-[#EDE9FE]"
              >
                ↺ apostar de novo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-4 flex items-start gap-2 font-[family-name:var(--font-body)] text-[11px] leading-relaxed text-[#9D8FC7]">
        <span className="mt-0.5 shrink-0">
          <PixelShield size={14} />
        </span>
        O retorno vem de quem desistiu, dividido entre quem cumpriu. Sem casa, sem azar — depende
        100% de você.
      </p>
    </div>
  );
}
