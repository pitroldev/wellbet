"use client";

import { useState, type JSX, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";
import { FlameMark } from "@/ui";
import { AnimatedNumber, EASE, DUR } from "@/motion";
import { BRL } from "@/lib/formatters";
import {
  META_OPCOES,
  PRAZO_OPCOES,
  STAKE_MAX,
  STAKE_MIN,
  prazoMinimoSaudavel,
  useAposta,
  useApostaHref,
} from "@/state/aposta";
import { StakeLever } from "./StakeLever";

/** Rótulo de campo do cupom — mono, caixa-alta: a gramática de slip que o apostador já conhece. */
function Campo({ children }: { children: string }): JSX.Element {
  return (
    <p className="font-[family-name:var(--font-geist-mono)] text-[11px] font-bold uppercase tracking-[0.18em] text-fog-mute">
      {children}
    </p>
  );
}

/**
 * Chip-pílula do montador (meta/prazo) — alvo ≥44px, aria-pressed, selecionado
 * = bloco violeta com texto BRANCO (violeta nunca vira texto sobre o escuro).
 * Estados exaustivos (cn não faz merge): selecionado / desabilitado / neutro.
 */
function Chip({
  pressed,
  disabled = false,
  onPress,
  ariaLabel,
  title,
  children,
}: {
  pressed: boolean;
  disabled?: boolean;
  onPress: () => void;
  ariaLabel: string;
  title?: string;
  children: ReactNode;
}): JSX.Element {
  const visual = pressed
    ? "border-violet bg-violet text-white"
    : disabled
      ? "cursor-not-allowed border-white/10 text-fog-mute opacity-50"
      : "border-white/15 bg-white/[0.04] text-fog hover:border-white/40 hover:text-white";
  return (
    <button
      type="button"
      onClick={onPress}
      aria-pressed={pressed}
      aria-label={ariaLabel}
      disabled={disabled}
      title={title}
      className={`min-h-11 min-w-11 rounded-full border px-3 font-[family-name:var(--font-geist-mono)] text-xs font-bold tabular-nums transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${visual}`}
    >
      {children}
    </button>
  );
}

/** Linha de desfecho — as DUAS com a mesma produção (a perda não é letra miúda). */
function Desfecho({ icon, children }: { icon: ReactNode; children: ReactNode }): JSX.Element {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-white/10 text-white">
        {icon}
      </span>
      <p className="text-sm leading-snug text-fog">{children}</p>
    </li>
  );
}

/**
 * O MONTADOR DE BILHETE — a "prize calculator" honesta vestida de slip: meta,
 * prazo e valor editáveis NO próprio bilhete, com o desfecho (os dois lados,
 * mesma produção) rolando em NumberFlow a cada toque. Tag "simulação" no
 * header porque ainda não é uma aposta real — honestidade antes da conversão.
 * Sem verde aqui (o clímax do green vive no fim, rotulado) e sem prêmio
 * inventado: bateu = valor de volta + fatia do bolo (varia). A regra de
 * plausibilidade da aposta (≤ ~1 kg/semana) desabilita prazos agressivos e,
 * quando sobe o prazo sozinha, avisa em aria-live. A moeda 3D espia por trás
 * do canto superior — o pr-12 do header reserva o espaço pra ela não cobrir
 * a tag, em todos os breakpoints.
 */
export function BetTicket(): JSX.Element {
  const reduce = useReducedMotion();
  const { stake, metaKg, setMetaKg, prazoMeses, setPrazoMeses } = useAposta();
  const href = useApostaHref();
  // aviso do bump de prazo — detectado ANTES do setMetaKg (o provider não expõe flag)
  const [avisoPrazo, setAvisoPrazo] = useState(false);
  const pct = (stake - STAKE_MIN) / (STAKE_MAX - STAKE_MIN);
  const tilt = reduce ? 0 : (pct - 0.5) * 2.2;
  const prazoMinimo = prazoMinimoSaudavel(metaKg);

  const escolherMeta = (kg: number) => {
    setAvisoPrazo(prazoMinimoSaudavel(kg) > prazoMeses);
    setMetaKg(kg);
  };

  const escolherPrazo = (meses: number) => {
    setAvisoPrazo(false); // escolha manual de prazo dispensa o aviso
    setPrazoMeses(meses);
  };

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
        className="relative overflow-hidden rounded-2xl border border-navy-line bg-surface shadow-panel transition-transform duration-300 ease-out"
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        {/* header — barra violeta: título à esquerda, tag de honestidade à direita
            (pr-12 reserva o canto pra moeda 3D não cobrir a tag) */}
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 bg-violet py-2.5 pl-5 pr-12 text-white">
          <span className="inline-flex items-center gap-2 font-[family-name:var(--font-geist-mono)] text-[11px] font-bold uppercase tracking-[0.16em]">
            <FlameMark className="h-3.5 w-auto" /> Seu bilhete
          </span>
          <span className="rounded-full bg-ink/40 px-2.5 py-1 font-[family-name:var(--font-geist-mono)] text-[10px] font-bold uppercase tracking-[0.14em]">
            Simulação
          </span>
        </div>

        <div className="px-5 pb-6 pt-5 sm:px-6">
          {/* META — chips editáveis: o bilhete responde ao dedo */}
          <Campo>Meta</Campo>
          <div className="mt-2.5 flex flex-wrap gap-2" role="group" aria-label="Meta: quantos quilos você aposta que perde">
            {META_OPCOES.map((kg) => (
              <Chip
                key={kg}
                pressed={metaKg === kg}
                onPress={() => escolherMeta(kg)}
                ariaLabel={`menos ${kg} quilos`}
              >
                &minus;{kg}&nbsp;kg
              </Chip>
            ))}
          </div>

          {/* PRAZO — prazos agressivos demais pra meta atual ficam desabilitados */}
          <div className="mt-4">
            <Campo>Prazo</Campo>
            <div className="mt-2.5 flex flex-wrap gap-2" role="group" aria-label="Prazo em meses">
              {PRAZO_OPCOES.map((meses) => {
                const agressivo = meses < prazoMinimo;
                return (
                  <Chip
                    key={meses}
                    pressed={prazoMeses === meses}
                    disabled={agressivo}
                    onPress={() => escolherPrazo(meses)}
                    ariaLabel={
                      agressivo ? `${meses} meses — curto demais pra essa meta` : `${meses} meses`
                    }
                    title={agressivo ? "Curto demais pra essa meta" : undefined}
                  >
                    {meses}&nbsp;meses
                  </Chip>
                );
              })}
            </div>
            {/* microcopy do bump — sempre no DOM pro aria-live anunciar; min-h evita pulo */}
            <p aria-live="polite" className="mt-2 min-h-4 text-xs leading-4 text-fog-mute">
              {avisoPrazo ? "ajustamos o prazo pra uma meta saudável" : ""}
            </p>
          </div>

          {/* EM JOGO — a alavanca tátil (o mt interno dela encosta no rótulo) */}
          <div className="mt-3 [&>div]:mt-2">
            <Campo>Em jogo</Campo>
            <StakeLever />
          </div>

          {/* perfuração — costura pontilhada + furos na cor do fundo do hero */}
          <div className="relative my-5" aria-hidden>
            <span className="block h-px w-full border-t border-dashed border-white/20" />
            <span className="absolute left-0 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" />
            <span className="absolute right-0 top-1/2 size-4 -translate-y-1/2 translate-x-1/2 rounded-full bg-ink" />
          </div>

          {/* DESFECHO — o payoff da calculadora: os números rolam quando o stake muda */}
          <Campo>Desfecho</Campo>
          <ul className="mt-3 flex flex-col gap-3">
            <Desfecho icon={<Check className="size-4" strokeWidth={3} aria-hidden />}>
              <span className="font-bold text-white">bateu:</span>{" "}
              <span className="font-[family-name:var(--font-geist-mono)] font-bold text-white">
                <AnimatedNumber value={stake} format={BRL} />
              </span>{" "}
              de volta + sua fatia do bolo (varia)
            </Desfecho>
            <Desfecho icon={<X className="size-4" strokeWidth={3} aria-hidden />}>
              <span className="font-bold text-white">não bateu:</span>{" "}
              <span className="font-[family-name:var(--font-geist-mono)] font-bold text-white">
                <AnimatedNumber value={stake} format={BRL} />
              </span>{" "}
              vai pro bolo de quem bateu
            </Desfecho>
          </ul>

          {/* CTA do bilhete — leva meta+prazo+valor no href (useApostaHref, o destino único) */}
          <a
            href={href}
            className="group mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-violet py-3 font-[family-name:var(--font-geist-mono)] text-sm font-bold uppercase tracking-[0.08em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Fechar meu bilhete
            <ArrowRight
              className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            />
          </a>
        </div>
      </div>

      {/* moeda 3D da marca — espia por trás do canto do cupom, flutuação leve
          (1 asset por viewport; a flutuação só sobe, nunca desce sobre o header) */}
      <Image
        src="/brand/3d-coin-simbolo-azul.png"
        alt=""
        aria-hidden
        width={783}
        height={1054}
        sizes="72px"
        priority
        className="pointer-events-none absolute -right-8 -top-14 z-10 h-auto w-[4.5rem] rotate-12 select-none animate-[float_7s_ease-in-out_infinite] drop-shadow-[0_18px_28px_rgba(5,13,19,0.35)] motion-reduce:animate-none"
      />
    </motion.div>
  );
}
