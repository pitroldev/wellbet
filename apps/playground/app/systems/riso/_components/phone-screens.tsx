"use client";

import Image from "next/image";
import { Zap, Trophy, Crown, Gift, Bell, Download } from "lucide-react";
import { USERS } from "@/lib/avatars";
import { ProductWordmark } from "@/app/components/wellbet-logo";
import { Phone } from "./phone";
import { R, brl, brl0, odd, halftone, halftoneBar } from "./tokens";
import { MisprintTitle, Stamp } from "./print-kit";

export function PhoneScreens() {
  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible">
      <div className="snap-center">
        <Phone label="capa · banca">
          <CoverScreen />
        </Phone>
      </div>
      <div className="snap-center">
        <Phone label="cupom impresso">
          <SlipScreen />
        </Phone>
      </div>
      <div className="snap-center">
        <Phone label="ranking · zine">
          <RankScreen />
        </Phone>
      </div>
    </div>
  );
}

/** Tela 1 — capa pôster: tipo gigante misprint, banca, halftone, "Baixe agora". */
function CoverScreen() {
  return (
    <div className="relative px-4 pb-10">
      <div className="flex items-center justify-between pt-1">
        <ProductWordmark brand="well" size={18} />
        <span className="grid h-8 w-8 place-items-center" style={{ background: R.paper, border: `2px solid ${R.ink}` }}>
          <Bell size={14} style={{ color: R.ink }} />
        </span>
      </div>

      <div className="mt-3">
        <Stamp color={R.magenta} rotate={-6} style={{ fontSize: 10 }}>
          edição limitada
        </Stamp>
      </div>

      <MisprintTitle ink1={R.magenta} ink2={R.blue} size="clamp(2.2rem,15vw,3.2rem)" className="mt-3">
        Impressa na sua mudança
      </MisprintTitle>

      <div className="relative mt-4 overflow-hidden p-4" style={{ background: R.ink, color: R.paper, border: `2.5px solid ${R.ink}` }}>
        <span aria-hidden className="pointer-events-none absolute inset-0" style={{ ...halftone(R.blue, 8, 0.3), mixBlendMode: "screen", opacity: 0.35 }} />
        <span className="relative font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider opacity-60">banca disponível</span>
        <p className="relative font-[family-name:var(--font-mono)] text-3xl font-medium tabular-nums" style={{ color: R.green }}>
          {brl(347.5)}
        </p>
        <div className="relative mt-2 flex gap-2">
          <span className="px-3 py-1 text-[11px] font-extrabold uppercase" style={{ background: R.green, color: R.greenInk, fontFamily: "var(--font-archivo)" }}>+ Depositar</span>
          <span className="px-3 py-1 text-[11px] font-extrabold uppercase" style={{ background: "transparent", color: R.paper, border: `2px solid ${R.paper}`, fontFamily: "var(--font-archivo)" }}>Sacar</span>
        </div>
      </div>

      <div className="relative mt-3 overflow-hidden p-4" style={{ background: R.green, border: `2.5px solid ${R.ink}` }}>
        <span aria-hidden className="pointer-events-none absolute inset-0" style={{ ...halftone(R.ink, 6, 0.32), mixBlendMode: "multiply", opacity: 0.18 }} />
        <p className="relative font-[family-name:var(--font-archivo)] text-base font-extrabold uppercase" style={{ color: R.greenInk }}>
          Faltam 1,6kg pra free bet
        </p>
        <div className="relative mt-2 h-3 w-full" style={{ border: `2px solid ${R.greenInk}` }}>
          <span aria-hidden className="absolute inset-y-0 left-0" style={{ width: "60%", ...halftoneBar(R.greenInk, 5) }} />
        </div>
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-2 py-3 text-sm font-extrabold uppercase" style={{ background: R.magenta, color: "#fff", border: `2.5px solid ${R.ink}`, boxShadow: "3px 3px 0 0 " + R.ink, fontFamily: "var(--font-archivo)" }}>
        <Download size={15} strokeWidth={3} /> Baixe agora
      </button>
    </div>
  );
}

/** Tela 2 — cupom impresso. */
function SlipScreen() {
  const goals = [
    { g: "Perder 2kg", s: "7 dias", o: 1.85, on: false },
    { g: "Perder 4kg", s: "14 dias", o: 2.45, on: true },
    { g: "Treinar 5×", s: "semana", o: 1.6, on: false },
  ];
  return (
    <div className="relative px-4 pb-10">
      <p className="pt-1 font-[family-name:var(--font-archivo)] text-2xl font-extrabold uppercase" style={{ color: R.ink }}>
        Cupom
      </p>
      <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider" style={{ color: R.ink }}>
        #RISO-2026 · aposte em você
      </p>

      <div className="mt-3 space-y-2">
        {goals.map((x) => (
          <div
            key={x.g}
            className="flex items-center justify-between px-3 py-2.5"
            style={{ background: x.on ? R.blue : R.paper, color: x.on ? "#fff" : R.ink, border: `2.5px solid ${R.ink}`, boxShadow: x.on ? "3px 3px 0 0 " + R.ink : "none" }}
          >
            <div>
              <p className="text-sm font-extrabold uppercase" style={{ fontFamily: "var(--font-archivo)" }}>{x.g}</p>
              <p className="font-[family-name:var(--font-mono)] text-[10px]" style={{ opacity: 0.8 }}>{x.s}</p>
            </div>
            <span className="font-[family-name:var(--font-mono)] text-base font-semibold tabular-nums">{odd(x.o)}</span>
          </div>
        ))}
      </div>

      <div className="relative my-3 h-4">
        <span className="absolute left-3 right-3 top-1/2 -translate-y-1/2 border-t-2" style={{ borderColor: R.ink, borderStyle: "dashed" }} />
      </div>

      <div className="p-3" style={{ background: R.paperDeep, border: `2.5px solid ${R.ink}` }}>
        <div className="flex items-center justify-between font-[family-name:var(--font-mono)] text-[11px] uppercase" style={{ color: R.ink }}>
          <span>stake</span>
          <span className="tabular-nums">{brl(50)}</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase" style={{ color: R.ink }}>retorno</span>
          <span className="font-[family-name:var(--font-mono)] text-xl font-medium tabular-nums" style={{ color: R.indigo }}>{brl(122.5)}</span>
        </div>
      </div>

      <button className="mt-3 flex w-full items-center justify-center gap-2 py-3 text-sm font-extrabold uppercase" style={{ background: R.magenta, color: "#fff", border: `2.5px solid ${R.ink}`, boxShadow: "3px 3px 0 0 " + R.ink, fontFamily: "var(--font-archivo)" }}>
        <Zap size={15} fill="#fff" /> Imprimir cupom
      </button>

      <div className="mt-3 grid place-items-center p-4" style={{ background: R.pink, border: `2.5px solid ${R.ink}` }}>
        <Gift size={20} style={{ color: R.ink }} />
        <p className="mt-1 font-[family-name:var(--font-archivo)] text-sm font-extrabold uppercase" style={{ color: R.ink }}>
          raspe e ganhe {brl0(25)} de free bet
        </p>
      </div>
    </div>
  );
}

/** Tela 3 — ranking zine. */
function RankScreen() {
  const board = USERS.slice(0, 6).map((u, i) => ({ ...u, kg: +(4.2 - i * 0.5).toFixed(1), me: i === 2 }));
  const maxKg = board[0].kg;
  const inks = [R.magenta, R.blue, R.indigo, R.pink, R.green, R.magenta];
  return (
    <div className="relative px-4 pb-10">
      <p className="inline-flex items-center gap-2 pt-1 font-[family-name:var(--font-archivo)] text-2xl font-extrabold uppercase" style={{ color: R.ink }}>
        <Trophy size={18} style={{ color: R.magenta }} /> Ranking
      </p>
      <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider" style={{ color: R.ink }}>
        quem mais evoluiu fatura o pote
      </p>

      <div className="mt-3 space-y-2">
        {board.map((u, i) => (
          <div
            key={u.handle}
            className="flex items-center gap-2.5 px-2.5 py-2"
            style={{ background: u.me ? R.green : R.paper, border: `2.5px solid ${R.ink}`, boxShadow: u.me ? "3px 3px 0 0 " + R.ink : "none" }}
          >
            <span className="w-4 text-center font-[family-name:var(--font-archivo)] text-base font-extrabold tabular-nums" style={{ color: R.ink }}>{i + 1}</span>
            <span className="relative h-8 w-8 shrink-0 overflow-hidden" style={{ border: `2px solid ${R.ink}`, background: R.paperDeep }}>
              <Image src={u.avatar} alt={u.name} fill sizes="32px" className="object-cover" style={{ filter: "grayscale(1) contrast(1.1)", mixBlendMode: "multiply" }} />
            </span>
            <div className="min-w-0 flex-1">
              <span className="flex items-center gap-1 truncate text-xs font-extrabold uppercase" style={{ color: R.ink, fontFamily: "var(--font-archivo)" }}>
                {i === 0 && <Crown size={11} fill={R.magenta} style={{ color: R.magenta }} />}
                {u.me ? "Você" : u.name.split(" ")[0]}
              </span>
              <span className="relative mt-0.5 block h-2 w-full" style={{ border: `1.5px solid ${R.ink}` }}>
                <span aria-hidden className="absolute inset-y-0 left-0" style={{ width: `${(u.kg / maxKg) * 100}%`, ...halftoneBar(u.me ? R.ink : inks[i], 5) }} />
              </span>
            </div>
            <span className="font-[family-name:var(--font-mono)] text-xs font-semibold tabular-nums" style={{ color: R.ink }}>-{u.kg}kg</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between px-3 py-2.5" style={{ background: R.ink, color: R.paper }}>
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">pote da liga</span>
        <span className="font-[family-name:var(--font-mono)] text-lg font-medium tabular-nums" style={{ color: R.green }}>{brl0(1840)}</span>
      </div>
    </div>
  );
}
