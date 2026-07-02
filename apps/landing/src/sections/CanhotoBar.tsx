"use client";

import { useState, type JSX } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FlameMark } from "@/ui";
import { useAposta, useApostaHref } from "@/state/aposta";
import { BRL } from "@/lib/formatters";

const brl = (n: number) => new Intl.NumberFormat("pt-BR", BRL).format(n);

/**
 * Canhoto sticky — o bilhete montado no hero, sempre à mão. Desliza do topo
 * quando o hero sai de cena carregando o RESUMO DA APOSTA em mono
 * (−kg · meses · R$) + CTA de fechar o bilhete. Nada pra decodificar: é a
 * gramática de slip que o apostador já conhece, com os números que a própria
 * pessoa escolheu. O CTA fica SEMPRE ativo — apostar está a um toque em
 * qualquer ponto da página, nunca bloqueado por progresso de leitura. Em telas
 * estreitas o resumo abrevia pro valor em jogo. Respeita reduced-motion.
 */
export function CanhotoBar(): JSX.Element {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  const { stake, metaKg, prazoMeses } = useAposta();
  const href = useApostaHref();

  useMotionValueEvent(scrollY, "change", (y) => {
    const threshold = typeof window !== "undefined" ? window.innerHeight * 0.85 : 700;
    setShow(y > threshold);
  });

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-[60] bg-ink/95 backdrop-blur"
      initial={false}
      animate={{ y: show ? 0 : "-105%" }}
      transition={reduce ? { duration: 0 } : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <a
            href="#topo"
            aria-label="WellBet — voltar ao topo"
            className="grid size-11 shrink-0 place-items-center text-violet-soft"
          >
            <FlameMark className="h-5 w-auto" />
          </a>

          {/* resumo do bilhete — os números que a própria pessoa escolheu no hero */}
          <p
            title="Seu bilhete: meta · prazo · valor em jogo"
            className="min-w-0 font-[family-name:var(--font-geist-mono)] text-xs font-bold uppercase tracking-[0.12em] text-white"
          >
            <span className="sr-only">
              Seu bilhete: menos {metaKg} quilos em {prazoMeses} meses, com {brl(stake)} em jogo.
            </span>
            <span aria-hidden className="flex items-baseline gap-1.5 whitespace-nowrap tabular-nums">
              <span className="hidden sm:inline">−{metaKg} kg</span>
              <span className="hidden text-fog-mute sm:inline">·</span>
              <span className="hidden sm:inline">{prazoMeses} meses</span>
              <span className="hidden text-fog-mute sm:inline">·</span>
              <span>{brl(stake)}</span>
            </span>
          </p>
        </div>

        {/* CTA sempre ativo — fecha o bilhete montado com meta+prazo+valor no href */}
        <a
          href={href}
          className="group inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-violet px-4 font-[family-name:var(--font-geist-mono)] text-xs font-bold uppercase tracking-[0.08em] text-white transition-all hover:-translate-y-0.5 hover:bg-violet-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:gap-2 sm:px-5"
        >
          Fechar meu bilhete
          <ArrowRight
            className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </a>
      </div>

      {/* hairline da marca — fecha o canhoto no gradiente violeta→ciano */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-0.5"
        style={{ background: "var(--gradient-brand)" }}
      />
    </motion.header>
  );
}
