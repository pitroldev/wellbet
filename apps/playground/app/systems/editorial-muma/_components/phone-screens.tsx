"use client";

import Image from "next/image";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { USERS } from "@/lib/avatars";
import { WellbetCoLogo, BoltMark } from "@/app/components/wellbet-logo";
import { Phone } from "./phone";
import { M, odd, FRAUNCES_DISPLAY } from "./tokens";

export function PhoneScreens() {
  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible">
      <div className="snap-center">
        <Phone label="Campanha · pink" bg={M.pink}>
          <CampaignPink />
        </Phone>
      </div>
      <div className="snap-center">
        <Phone label="Campanha · indigo" bg={M.indigo} statusDark>
          <CampaignIndigo />
        </Phone>
      </div>
      <div className="snap-center">
        <Phone label="App · cupom editorial" bg={M.paper}>
          <AppScreen />
        </Phone>
      </div>
    </div>
  );
}

/** Prancha muma 01 — fundo pink, manchete serif. */
function CampaignPink() {
  return (
    <div className="flex h-full min-h-full flex-col px-6 pb-8" style={{ color: M.ink }}>
      <div className="flex items-center justify-between pt-2">
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.24em]">muma · ed.01</span>
        <BoltMark style={{ height: 14, width: "auto", color: M.ink }} />
      </div>

      <div className="mt-8">
        <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em]" style={{ color: M.indigo }}>
          A capa
        </span>
        <h3
          className="mt-3 font-[family-name:var(--font-fraunces)] leading-[0.92] tracking-[-0.02em]"
          style={{ fontSize: "2.8rem", fontVariationSettings: FRAUNCES_DISPLAY, fontWeight: 500 }}
        >
          Quem
          <br />
          continua,
          <br />
          <span style={{ color: M.white }}>conquista.</span>
        </h3>
      </div>

      <p className="mt-5 max-w-[88%] text-sm leading-relaxed" style={{ color: M.inkSoft }}>
        A melhor aposta é na sua mudança. Stake na meta, constância no jogo, green na banca.
      </p>

      <div className="mt-auto pt-8">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold"
          style={{ background: M.ink, color: "#fff" }}
        >
          Baixe agora <ArrowRight size={16} />
        </button>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="flex -space-x-2">
            {USERS.slice(0, 4).map((u) => (
              <span key={u.handle} className="relative h-6 w-6 overflow-hidden rounded-full ring-2" style={{ ["--tw-ring-color" as string]: M.pink }}>
                <Image src={u.avatar} alt={u.name} fill sizes="24px" className="object-cover" />
              </span>
            ))}
          </div>
          <span className="font-[family-name:var(--font-mono)] text-[10px]" style={{ color: M.inkSoft }}>
            +1.284 na liga
          </span>
        </div>
      </div>
    </div>
  );
}

/** Prancha muma 02 — fundo indigo, manchete serif branca + vírgula rosa. */
function CampaignIndigo() {
  return (
    <div className="relative flex h-full min-h-full flex-col px-6 pb-8 text-white">
      {/* vírgula gigante de fundo */}
      <span
        className="pointer-events-none absolute -right-4 top-24 select-none leading-none"
        style={{ fontFamily: "var(--font-fraunces)", fontSize: "14rem", color: M.pink, fontVariationSettings: FRAUNCES_DISPLAY, opacity: 0.9 }}
        aria-hidden
      >
        ,
      </span>

      <div className="flex items-center justify-between pt-2">
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.24em] text-white/70">muma · ed.02</span>
        <BoltMark style={{ height: 14, width: "auto", color: M.pink }} />
      </div>

      <div className="relative mt-10">
        <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em]" style={{ color: M.pink }}>
          O editorial
        </span>
        <h3
          className="mt-3 font-[family-name:var(--font-fraunces)] leading-[0.94] tracking-[-0.02em]"
          style={{ fontSize: "2.6rem", fontVariationSettings: FRAUNCES_DISPLAY, fontWeight: 500 }}
        >
          Sua disciplina
          <br />
          agora vale{" "}
          <span style={{ color: M.pink }}>mais.</span>
        </h3>
      </div>

      <div className="relative mt-6 rounded-[6px] border border-white/15 p-4">
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-white/60">
          Cotação da semana
        </span>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-sm font-semibold">Perder 4kg · 14 dias</span>
          <span className="font-[family-name:var(--font-mono)] text-lg tabular-nums" style={{ color: M.pink }}>
            {odd(2.45)}
          </span>
        </div>
      </div>

      <div className="relative mt-auto pt-8">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold"
          style={{ background: M.pink, color: M.ink }}
        >
          Baixe agora <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  );
}

/** Tela do app clara — cupom editorial. */
function AppScreen() {
  const goals = [
    { g: "Perder 2kg", s: "7 dias", o: 1.85, on: false },
    { g: "Perder 4kg", s: "14 dias", o: 2.45, on: true },
    { g: "Treinar 5×", s: "semana", o: 1.6, on: false },
  ];
  return (
    <div className="px-5 pb-8">
      <div className="flex items-center justify-between">
        <WellbetCoLogo size={22} tone="ink" />
      </div>

      <div className="mt-6 border-b pb-4" style={{ borderColor: M.hair }}>
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.24em]" style={{ color: M.inkMute }}>
          O cupom · você
        </span>
        <h3
          className="mt-1 font-[family-name:var(--font-fraunces)] leading-[0.95]"
          style={{ color: M.ink, fontSize: "2.2rem", fontVariationSettings: FRAUNCES_DISPLAY, fontWeight: 500 }}
        >
          A sua meta<span style={{ color: M.pink }}>.</span>
        </h3>
      </div>

      <div className="mt-3 divide-y" style={{ borderColor: M.hair }}>
        {goals.map((x) => (
          <div key={x.g} className="flex items-center justify-between py-3" style={{ borderColor: M.hair }}>
            <span className="flex items-center gap-2.5">
              <span
                className="grid h-5 w-5 place-items-center rounded-full"
                style={{ background: x.on ? M.indigo : "transparent", boxShadow: x.on ? "none" : `inset 0 0 0 1.5px ${M.hair}` }}
              >
                {x.on && <Check size={12} strokeWidth={3} color="#fff" />}
              </span>
              <span>
                <span
                  className="block font-[family-name:var(--font-fraunces)] text-base leading-none"
                  style={{ color: M.ink, fontVariationSettings: '"SOFT" 40,"WONK" 1,"opsz" 80', fontWeight: x.on ? 600 : 400 }}
                >
                  {x.g}
                </span>
                <span className="text-[11px]" style={{ color: M.inkMute }}>
                  {x.s}
                </span>
              </span>
            </span>
            <span className="font-[family-name:var(--font-mono)] text-sm tabular-nums" style={{ color: x.on ? M.indigo : M.inkMute }}>
              {odd(x.o)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t pt-4" style={{ borderColor: M.hair }}>
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.24em]" style={{ color: M.inkMute }}>
          Retorno possível
        </span>
        <div className="mt-0.5 flex items-end gap-1">
          <span className="mb-1 font-[family-name:var(--font-mono)] text-sm" style={{ color: M.inkMute }}>
            R$
          </span>
          <span
            className="font-[family-name:var(--font-fraunces)] leading-[0.8] tabular-nums"
            style={{ color: M.indigo, fontSize: "3rem", fontVariationSettings: FRAUNCES_DISPLAY, fontWeight: 500 }}
          >
            122,50
          </span>
        </div>
      </div>

      <button
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold"
        style={{ background: M.indigo, color: "#fff" }}
      >
        Apostar em mim <ArrowRight size={15} />
      </button>
      <p className="mt-2 text-center text-[11px]" style={{ color: M.inkMute }}>
        Bora? Bora!
      </p>
    </div>
  );
}
