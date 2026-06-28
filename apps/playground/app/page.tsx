"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SYSTEMS } from "@/lib/systems";
import { C, GRADIENT } from "@/lib/brand";
import { BoltMark, WellbetCoLogo } from "@/app/components/wellbet-logo";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hub() {
  return (
    <main
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: C.indigo, color: "#FFFFFF" }}
    >
      {/* "M" líquido de fundo — assinatura do masterbrand */}
      <LiquidM />

      <div className="relative mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {/* topo institucional */}
        <header className="flex items-center justify-between gap-4">
          <WellbetCoLogo size={30} tone="light" />
          <span className="hidden font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-white/45 sm:block">
            identidade · 2026
          </span>
        </header>

        {/* hero editorial */}
        <section className="pt-16 sm:pt-24">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.22em] text-white/55"
          >
            5 direções · 1 marca
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.05 }}
            className="mt-4 max-w-4xl font-[family-name:var(--font-fraunces)] leading-[0.96] tracking-[-0.02em]"
            style={{ fontSize: "clamp(2.6rem,9vw,5.6rem)", fontVariationSettings: '"SOFT" 50,"WONK" 1,"opsz" 144' }}
          >
            Mudanças reais acontecem quando existe{" "}
            <span style={{ color: C.pink }}>algo em jogo.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
          >
            Cinco playgrounds, cada um uma leitura distinta da identidade{" "}
            <strong className="text-white">wellbet&nbsp;&amp;&nbsp;Co.</strong> — WellBet, GymBet e o
            masterbrand. Abra um: fundamentos, componentes de bet dopaminérgicos e telas. Mobile-first.
          </motion.p>
        </section>

        {/* grade de systems */}
        <ul className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2">
          {SYSTEMS.map((s, i) => (
            <motion.li
              key={s.slug}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.1 + i * 0.07 }}
              className={i === 0 ? "sm:col-span-2" : ""}
            >
              <Link
                href={`/systems/${s.slug}`}
                className="group relative flex h-full min-h-[200px] flex-col justify-between overflow-hidden rounded-[28px] p-6 ring-1 ring-inset ring-black/5 transition-transform duration-300 hover:-translate-y-1 sm:p-8"
                style={{ background: s.cardBg, color: s.cardFg }}
              >
                {/* faixa de swatches no topo */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-[family-name:var(--font-mono)] text-xs tabular-nums opacity-50"
                    >
                      {s.index}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] opacity-55">
                      {s.world}
                    </span>
                  </div>
                  <span
                    className="grid h-9 w-9 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-12"
                    style={{ background: s.accent, color: s.cardBg }}
                  >
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2.6} />
                  </span>
                </div>

                <div className="mt-8">
                  <h2
                    className="font-[family-name:var(--font-fraunces)] leading-[1] tracking-[-0.01em]"
                    style={{ fontSize: i === 0 ? "clamp(2rem,6vw,3.4rem)" : "1.9rem" }}
                  >
                    {s.name}
                  </h2>
                  <p
                    className="mt-1 font-[family-name:var(--font-fraunces)] italic opacity-70"
                    style={{ fontSize: "1.05rem" }}
                  >
                    {s.tagline}
                  </p>
                  <p
                    className="mt-3 max-w-prose text-sm leading-relaxed"
                    style={{ color: s.cardFg, opacity: 0.72 }}
                  >
                    {s.description}
                  </p>

                  <div className="mt-5 flex items-center gap-1.5">
                    {s.swatches.map((hex) => (
                      <span
                        key={hex}
                        className="h-5 w-5 rounded-md ring-1 ring-inset ring-black/10"
                        style={{ background: hex }}
                        title={hex}
                      />
                    ))}
                    <span className="ml-2 font-[family-name:var(--font-mono)] text-[11px] opacity-40">
                      /systems/{s.slug}
                    </span>
                  </div>
                </div>

                <BoltMark
                  className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 opacity-[0.07] transition-opacity duration-300 group-hover:opacity-[0.14]"
                  style={{ color: s.cardFg }}
                />
              </Link>
            </motion.li>
          ))}
        </ul>

        <footer className="mt-14 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/10 pt-6 font-[family-name:var(--font-mono)] text-[11px] text-white/40">
          <span className="inline-flex items-center gap-1.5">
            <BoltMark className="h-3 w-auto" style={{ color: C.green }} /> wellbet &amp; Co.®
          </span>
          <span aria-hidden>·</span>
          <span>Next.js 16</span>
          <span aria-hidden>·</span>
          <span>React 19</span>
          <span aria-hidden>·</span>
          <span>Tailwind v4</span>
          <span aria-hidden>·</span>
          <span>Framer Motion</span>
          <span aria-hidden>·</span>
          <span className="text-white/30">BRAND.md</span>
        </footer>
      </div>
    </main>
  );
}

/** "M" líquido translúcido no canto — referência ao motivo do masterbrand. */
function LiquidM() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden" aria-hidden>
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease }}
        className="absolute -right-[10%] -top-[12%] h-[70vh] w-[70vh] rounded-full blur-[20px]"
        style={{ background: GRADIENT.iris, opacity: 0.35 }}
      />
      <div
        className="absolute -left-[15%] bottom-[-10%] h-[50vh] w-[50vh] rounded-full blur-[60px]"
        style={{ background: C.pink, opacity: 0.12 }}
      />
    </div>
  );
}
