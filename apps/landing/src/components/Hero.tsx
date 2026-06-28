"use client";

import type { JSX } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { CTA } from "@/components/CTA";
import { Glow, Eyebrow, Display, GradText } from "@/components/ui";
import { Wordmark, BoltMark } from "@/components/brand";
import { appUrl, ctaLabel } from "@/config";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Hero — direção GYMBET ARENA (magenta/rosa/roxo, neon, dopamina). Ground navy,
 * glows magenta+roxo, manchete Archivo black caixa-alta itálica, e o CUPOM DE
 * APOSTA como peça-herói. Pop máximo, mas premium — uma bet de verdade.
 */
export function Hero(): JSX.Element {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: EASE, delay },
        };

  return (
    <section className="relative w-full overflow-hidden bg-navy px-6 pb-20 pt-6 sm:pb-28">
      {/* glows de fundo (magenta + roxo) */}
      <Glow
        className="left-[-12%] top-[-6%] h-[36rem] w-[36rem]"
        color="#FF00FF"
        style={{ opacity: 0.3 }}
      />
      <Glow
        className="right-[-14%] top-[14%] h-[32rem] w-[32rem]"
        color="#7A1BD6"
        style={{ opacity: 0.32 }}
      />
      <Glow
        className="bottom-[-10%] left-[30%] h-[24rem] w-[28rem]"
        color="#41FFCA"
        style={{ opacity: 0.14 }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-navy-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-navy-line) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)",
        }}
      />

      {/* nav */}
      <nav className="relative mx-auto flex w-full max-w-6xl items-center justify-between py-2">
        <Wordmark size={30} />
        <a
          href={appUrl}
          className="hidden rounded-full px-5 py-2.5 text-sm font-bold text-white ring-1 ring-inset ring-white/15 transition hover:bg-white/5 sm:inline-flex"
        >
          Entrar
        </a>
      </nav>

      <div className="relative mx-auto mt-12 grid w-full max-w-6xl items-center gap-12 sm:mt-20 lg:grid-cols-[1.05fr_0.95fr]">
        {/* coluna de texto */}
        <div>
          <motion.div {...rise(0)}>
            <Eyebrow>A bet que você torce pra ganhar</Eyebrow>
          </motion.div>

          <motion.div {...rise(0.08)}>
            <Display level={1} className="mt-5 text-[clamp(3rem,9vw,5.6rem)]">
              A melhor aposta
              <br />é <GradText>em você.</GradText>
            </Display>
          </motion.div>

          <motion.p
            {...rise(0.18)}
            className="mt-6 max-w-xl text-lg leading-relaxed text-fog sm:text-xl"
          >
            Coloque dinheiro real na sua meta de peso. Bateu no prazo?{" "}
            <strong className="font-semibold text-green">Deu green</strong> — recebe de volta com
            recompensa. Não bateu, o preço de desistir agora dói de verdade.
          </motion.p>

          <motion.div
            {...rise(0.28)}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <CTA href={appUrl}>{ctaLabel}</CTA>
            <CTA href="#como-funciona" variant="secondary">
              Ver como funciona
            </CTA>
          </motion.div>

          <motion.div {...rise(0.4)} className="mt-9 flex items-center gap-4">
            <AvatarStack />
            <p className="text-sm text-fog">
              <span className="font-[family-name:var(--font-geist-mono)] font-semibold text-white">
                +2.140
              </span>{" "}
              pessoas com algo em jogo agora
            </p>
          </motion.div>
        </div>

        {/* coluna do cupom */}
        <motion.div
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 30, rotate: 0 },
                animate: { opacity: 1, y: 0, rotate: -2 },
                transition: { duration: 0.8, ease: EASE, delay: 0.2 },
              })}
          className="relative mx-auto w-full max-w-sm pt-3"
        >
          <BetSlip />
        </motion.div>
      </div>
    </section>
  );
}

/** Pilha de avatares faux (gradientes) — prova social + personalidade. */
function AvatarStack(): JSX.Element {
  const grads = [
    "var(--gradient-gymbet)",
    "var(--gradient-jackpot)",
    "var(--gradient-muma)",
    "var(--gradient-voltage)",
    "var(--gradient-gymbet-bright)",
  ];
  return (
    <div className="flex -space-x-3">
      {grads.map((g, i) => (
        <span
          key={i}
          className="size-9 rounded-full ring-2 ring-navy"
          style={{ background: g }}
          aria-hidden
        />
      ))}
    </div>
  );
}

/** Cupom de aposta — a peça-herói. Bet slip premium gymbet, "deu green". */
function BetSlip(): JSX.Element {
  return (
    <div
      className="relative rounded-[1.75rem] border border-navy-line bg-navy-soft p-6 sm:p-7"
      style={{ boxShadow: "var(--glow-magenta)", animation: "float 7s ease-in-out infinite" }}
    >
      {/* header do cupom */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 font-[family-name:var(--font-archivo)] text-xs font-extrabold uppercase tracking-[0.18em] text-fog">
          <BoltMark className="h-3.5 w-auto text-magenta" /> Cupom
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-magenta">
          <span
            className="size-2 rounded-full bg-magenta"
            style={{ animation: "float 2.5s ease-in-out infinite" }}
          />
          Ativo
        </span>
      </div>

      {/* meta */}
      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-wide text-fog-mute">Sua meta</p>
        <p className="mt-1 font-[family-name:var(--font-archivo)] text-4xl font-black uppercase italic leading-none text-white">
          Perder 8&nbsp;kg
        </p>
        <p className="mt-1.5 text-sm text-fog">em 4 meses · pesagem por vídeo</p>
      </div>

      {/* linhas mono (stake / cotação) */}
      <div className="mt-5 space-y-2.5">
        <Row label="Stake" value="R$ 200,00" />
        <Row label="Cotação" value="2,00" accent />
      </div>

      {/* perfuração */}
      <div className="my-5 flex items-center gap-1" aria-hidden>
        <span className="size-4 rounded-full bg-navy" />
        <span className="h-px flex-1 border-t border-dashed border-navy-line" />
        <span className="size-4 rounded-full bg-navy" />
      </div>

      {/* retorno + selo deu green */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-fog-mute">Se der green</p>
          <p className="font-[family-name:var(--font-geist-mono)] text-4xl font-medium tabular-nums text-green">
            R$&nbsp;400
          </p>
          <p className="text-xs text-fog-mute">seu stake de volta + recompensa</p>
        </div>
        <span
          className="grid size-14 shrink-0 place-items-center rounded-full text-green-ink"
          style={{ background: "var(--gradient-voltage)", boxShadow: "var(--glow-green)" }}
        >
          <Check className="size-7" strokeWidth={3} aria-hidden />
        </span>
      </div>

      {/* carimbo deu green — assentado na borda */}
      <span
        aria-hidden
        className="absolute right-4 top-4 rotate-6 rounded-lg border-2 border-green px-2.5 py-1 font-[family-name:var(--font-archivo)] text-[11px] font-black uppercase italic tracking-wider text-green"
        style={{ background: "rgba(65,255,202,0.08)" }}
      >
        Deu green
      </span>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}): JSX.Element {
  return (
    <div className="flex items-center justify-between rounded-xl bg-navy/70 px-4 py-2.5">
      <span className="text-sm text-fog">{label}</span>
      <span
        className={`font-[family-name:var(--font-geist-mono)] text-sm font-semibold tabular-nums ${
          accent ? "text-magenta" : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
