"use client";

import type { JSX } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, X } from "lucide-react";
import { BoltMark } from "@/ui";
import { AnimatedNumber, EASE, DUR } from "@/motion";
import { BRL } from "@/lib/formatters";
import { useStakeSimulator } from "./useStakeSimulator";

/**
 * O cupom como BILHETE de aposta honesto (entalhado/perfurado, tudo em mono).
 * Sem cotação 2,00 nem payout ×2 (promessa de dinheiro fácil que a marca renega):
 * o simulador mostra o que você PÕE EM JOGO e os dois desfechos reais — bateu
 * (de volta + sua fatia do bolo) ou não (vai pro bolo de quem bateu).
 */
export function BetTicket(): JSX.Element {
  const reduce = useReducedMotion();
  const { stake, setStake, min, max, step } = useStakeSimulator();

  return (
    <motion.div
      {...(reduce
        ? {}
        : {
            initial: { opacity: 0, y: 28 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: DUR.slow, ease: EASE, delay: 0.3 },
          })}
      className="relative mx-auto w-full max-w-sm text-white"
    >
      <div
        className="relative overflow-hidden bg-ink"
        style={{
          clipPath: "var(--ticket)",
          filter: "drop-shadow(10px 12px 0 rgba(10,13,22,0.14))",
        }}
      >
        {/* header — barra magenta chapada */}
        <div className="flex items-center justify-between bg-magenta px-5 py-3 text-ink">
          <span className="inline-flex items-center gap-2 font-[family-name:var(--font-geist-mono)] text-xs font-bold uppercase tracking-[0.18em]">
            <BoltMark className="h-3.5 w-auto" /> Cupom
          </span>
          <span className="font-[family-name:var(--font-geist-mono)] text-[10px] font-bold uppercase tracking-[0.2em]">
            Exemplo
          </span>
        </div>

        <div className="px-5 pb-6 pt-5 sm:px-6">
          {/* meta */}
          <p className="font-[family-name:var(--font-geist-mono)] text-[11px] font-bold uppercase tracking-[0.18em] text-fog-mute">
            Sua meta
          </p>
          <p className="mt-1.5 font-[family-name:var(--font-archivo)] text-4xl uppercase leading-[0.9] text-white">
            Perder 8&nbsp;kg
          </p>
          <p className="mt-1.5 font-[family-name:var(--font-geist-mono)] text-xs text-fog">
            4 meses · pesagem por vídeo
          </p>

          {/* simulador: arrasta o stake */}
          <div className="mt-5 border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-fog">Quanto você põe em jogo?</span>
              <span className="font-[family-name:var(--font-geist-mono)] text-base font-bold text-white">
                <AnimatedNumber value={stake} format={BRL} />
              </span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={stake}
              onChange={(e) => setStake(Number(e.target.value))}
              aria-label="Quanto você põe em jogo?"
              aria-valuetext={`R$ ${stake}`}
              className="mt-2.5 h-1 w-full cursor-pointer appearance-none bg-navy-line accent-magenta"
            />
            <div className="mt-1.5 flex items-center justify-between font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em] text-fog-mute">
              <span>mín R$ 50</span>
              <span>máx R$ 500</span>
            </div>
          </div>

          {/* perfuração — fio tracejado + furos cor de papel nas bordas */}
          <div className="relative my-5" aria-hidden>
            <span className="block h-px w-full border-t border-dashed border-white/20" />
            <span className="absolute left-0 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper" />
            <span className="absolute right-0 top-1/2 size-4 -translate-y-1/2 translate-x-1/2 rounded-full bg-paper" />
          </div>

          {/* os dois desfechos reais — honestidade = o mecanismo (aversão à perda) */}
          <ul className="flex flex-col gap-3">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center bg-green text-green-ink">
                <Check className="size-4" strokeWidth={3} aria-hidden />
              </span>
              <p className="text-sm leading-snug text-fog">
                <span className="font-bold text-green">Bateu a meta</span> — recebe seu valor de
                volta + sua fatia do bolo, no Pix.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center bg-white/10 text-fog">
                <X className="size-4" strokeWidth={3} aria-hidden />
              </span>
              <p className="text-sm leading-snug text-fog">
                <span className="font-bold text-white">Não bateu</span> — seu valor vai pro bolo de
                quem bateu. Por isso dói.
              </p>
            </li>
          </ul>

          <p className="mt-4 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase leading-relaxed tracking-[0.08em] text-fog-mute">
            Sem mágica: o prêmio vem de quem desistiu.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
