"use client";

import type { JSX } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";
import { BoltMark } from "@/ui";
import { EASE, DUR } from "@/motion";
import { BRL } from "@/lib/formatters";
import { appUrl } from "@/config";
import { useStakeSimulator } from "./useStakeSimulator";
import { StakeLever } from "./StakeLever";
import { GreenPreview } from "./GreenPreview";

const brl = (n: number) => new Intl.NumberFormat("pt-BR", BRL).format(n);

/**
 * O cupom = BILHETE de aposta honesto E tátil. O stake vira uma alavanca
 * (StakeLever): arrastar enche a barra magenta (risco exato), rola o número,
 * troca o tier e INCLINA o bilhete (metáfora de peso). Os dois desfechos reais
 * continuam à mostra; "ver como é o green" entrega o pico de dopamina rotulado.
 */
export function BetTicket(): JSX.Element {
  const reduce = useReducedMotion();
  const sim = useStakeSimulator();
  const tilt = reduce ? 0 : (sim.pct - 0.5) * 2.2;

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
        className="relative overflow-hidden bg-ink transition-transform duration-300 ease-out"
        style={{
          clipPath: "var(--ticket)",
          filter: "drop-shadow(10px 12px 0 rgba(10,13,22,0.14))",
          transform: `rotate(${tilt}deg)`,
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

          {/* a alavanca tátil */}
          <StakeLever {...sim} />

          {/* perfuração — fio tracejado + furos cor de papel nas bordas */}
          <div className="relative my-5" aria-hidden>
            <span className="block h-px w-full border-t border-dashed border-white/20" />
            <span className="absolute left-0 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper" />
            <span className="absolute right-0 top-1/2 size-4 -translate-y-1/2 translate-x-1/2 rounded-full bg-paper" />
          </div>

          {/* os dois desfechos reais */}
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

          {/* preview honesto do green (clique → carimbo + confete + auto-reset) */}
          <GreenPreview stake={sim.stake} />

          {/* CTA viva — responde à pergunta do hero com o SEU número */}
          <a
            href={`${appUrl}?valor=${sim.stake}`}
            className="group mt-3 flex w-full items-center justify-center gap-2 bg-magenta py-3 font-[family-name:var(--font-geist-mono)] text-sm font-bold uppercase tracking-[0.08em] text-ink transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
            style={{ clipPath: "var(--stub)" }}
          >
            Apostar {brl(sim.stake)} em mim
            <ArrowRight
              className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
