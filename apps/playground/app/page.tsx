"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SYSTEMS } from "@/lib/systems";

export default function Hub() {
  return (
    <main className="min-h-screen bg-[#0a0a0b] text-zinc-100 selection:bg-zinc-700/60">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        {/* Top bar — neutral, technical */}
        <header className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-semibold tracking-tight text-zinc-50">CHARYA</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              design systems
            </span>
          </div>
          <span className="font-mono text-[11px] tabular-nums text-zinc-600">05 / 2026</span>
        </header>

        {/* Intro — descriptive, not marketing */}
        <div className="max-w-xl pt-10 sm:pt-14">
          <h1 className="text-2xl font-medium leading-snug tracking-tight text-zinc-100 sm:text-3xl">
            Cinco direções visuais para o mesmo produto.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Selecione um sistema para abrir a demo interativa — fundamentos, componentes
            dopaminérgicos e telas de exemplo. Mobile-first.
          </p>
        </div>

        {/* Index of systems */}
        <ul className="mt-10 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] sm:mt-12 sm:grid-cols-2">
          {SYSTEMS.map((system, i) => (
            <motion.li
              key={system.slug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: i * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                href={`/systems/${system.slug}`}
                className="group flex h-full flex-col bg-[#0a0a0b] p-6 transition-colors duration-200 hover:bg-white/[0.03] sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tabular-nums text-zinc-600">
                    {system.index}
                  </span>
                  <ArrowRight className="h-4 w-4 -translate-x-1 text-zinc-600 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-zinc-300 group-hover:opacity-100" />
                </div>

                <h2 className="mt-4 text-lg font-medium tracking-tight text-zinc-50">
                  {system.name}
                </h2>
                <p className="mt-1 text-sm italic text-zinc-500">{system.tagline}</p>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">{system.description}</p>

                <div className="mt-auto flex items-center justify-between pt-6">
                  <div className="flex items-center gap-1.5">
                    {system.swatches.map((hex) => (
                      <span
                        key={hex}
                        className="h-4 w-4 rounded-[3px] ring-1 ring-inset ring-white/15"
                        style={{ background: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[11px] text-zinc-600">
                    /systems/{system.slug}
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>

        <footer className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-zinc-600">
          <span>Next.js 16</span>
          <span aria-hidden>·</span>
          <span>React 19</span>
          <span aria-hidden>·</span>
          <span>Tailwind v4</span>
          <span aria-hidden>·</span>
          <span>Framer Motion</span>
          <span aria-hidden>·</span>
          <span className="text-zinc-700">DESIGN_SYSTEMS.md</span>
        </footer>
      </div>
    </main>
  );
}
