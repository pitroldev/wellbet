"use client";

import Image from "next/image";
import { Zap, TrendingUp, Check, Trophy, Bell } from "lucide-react";
import { USERS } from "@/lib/avatars";
import { ProductWordmark, BoltMark } from "@/app/components/wellbet-logo";
import { Phone } from "./phone";
import { W, brl, odd } from "./tokens";

export function PhoneScreens() {
  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible">
      <div className="snap-center">
        <Phone label="Home · banca">
          <HomeScreen />
        </Phone>
      </div>
      <div className="snap-center">
        <Phone label="Montar cupom">
          <SlipScreen />
        </Phone>
      </div>
      <div className="snap-center">
        <Phone label="Ranking">
          <RankScreen />
        </Phone>
      </div>
    </div>
  );
}

function HomeScreen() {
  return (
    <div className="px-4 pb-8">
      <div className="flex items-center justify-between">
        <ProductWordmark brand="well" size={20} />
        <span className="grid h-9 w-9 place-items-center rounded-full" style={{ background: W.surfaceMute }}>
          <Bell size={16} style={{ color: W.ink }} />
        </span>
      </div>

      <div className="mt-4 rounded-3xl p-5" style={{ background: W.ink, color: "#fff" }}>
        <span className="text-xs opacity-60">Banca disponível</span>
        <p className="mt-1 font-[family-name:var(--font-mono)] text-3xl font-medium tabular-nums" style={{ color: W.green }}>
          {brl(347.5)}
        </p>
        <div className="mt-3 flex gap-2">
          <span className="rounded-full px-3 py-1.5 text-xs font-bold" style={{ background: W.green, color: W.greenInk }}>
            + Depositar
          </span>
          <span className="rounded-full px-3 py-1.5 text-xs font-bold" style={{ background: "rgba(255,255,255,.12)" }}>
            Sacar
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-3xl p-5" style={{ background: W.surface, boxShadow: "inset 0 0 0 1px " + W.line }}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold" style={{ color: W.ink }}>
            Evolução semanal
          </span>
          <span className="text-xs font-bold" style={{ color: W.greenDeep }}>
            -2,4 / -4kg
          </span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full" style={{ background: W.surfaceMute }}>
          <div className="h-full rounded-full" style={{ width: "60%", background: `linear-gradient(90deg,${W.blue},${W.green})` }} />
        </div>
        <p className="mt-2 text-xs" style={{ color: W.inkMute }}>
          Faltam 1,6kg pra liberar a free bet.
        </p>
      </div>

      <div className="mt-4 rounded-3xl p-4" style={{ background: W.blueWash }}>
        <div className="flex items-center gap-2">
          <BoltMark style={{ height: 16, width: "auto", color: W.blue }} />
          <span className="text-sm font-extrabold" style={{ color: W.blueDeep }}>
            Aposta da semana
          </span>
        </div>
        <p className="mt-1 text-xs" style={{ color: W.inkSoft }}>
          Perca 2kg em 7 dias · odd {odd(1.85)} · retorno {brl(92.5)}
        </p>
      </div>
    </div>
  );
}

function SlipScreen() {
  return (
    <div className="px-4 pb-8">
      <p className="text-sm font-extrabold" style={{ color: W.ink }}>
        Cupom
      </p>
      {[
        { g: "Perder 2kg", s: "7 dias", o: 1.85, on: false },
        { g: "Perder 4kg", s: "14 dias", o: 2.45, on: true },
        { g: "Treinar 5×", s: "semana", o: 1.6, on: false },
      ].map((x) => (
        <div
          key={x.g}
          className="mt-2 flex items-center justify-between rounded-2xl px-4 py-3"
          style={{ background: x.on ? W.blueWash : W.surface, boxShadow: x.on ? `inset 0 0 0 2px ${W.blue}` : "inset 0 0 0 1px " + W.line }}
        >
          <div>
            <p className="text-sm font-bold" style={{ color: W.ink }}>
              {x.g}
            </p>
            <p className="text-[11px]" style={{ color: W.inkMute }}>
              {x.s}
            </p>
          </div>
          <span className="font-[family-name:var(--font-mono)] text-sm font-semibold tabular-nums" style={{ color: x.on ? W.blue : W.inkSoft }}>
            {odd(x.o)}
          </span>
        </div>
      ))}

      <div className="mt-4 rounded-2xl p-4" style={{ background: W.surfaceMute }}>
        <div className="flex items-center justify-between text-xs font-bold" style={{ color: W.inkSoft }}>
          <span>Stake</span>
          <span className="font-[family-name:var(--font-mono)] tabular-nums">{brl(50)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: W.inkSoft }}>
            Retorno
          </span>
          <span className="font-[family-name:var(--font-mono)] text-xl font-medium tabular-nums" style={{ color: W.greenDeep }}>
            {brl(122.5)}
          </span>
        </div>
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold" style={{ background: W.blue, color: "#fff" }}>
        <Zap size={16} fill="#fff" /> Fazer aposta
      </button>
    </div>
  );
}

function RankScreen() {
  const board = USERS.slice(0, 6).map((u, i) => ({
    ...u,
    kg: (4.2 - i * 0.5).toFixed(1),
    me: i === 2,
  }));
  return (
    <div className="px-4 pb-8">
      <div className="flex items-center gap-2">
        <Trophy size={18} style={{ color: W.pink }} />
        <p className="text-sm font-extrabold" style={{ color: W.ink }}>
          Ranking · sua liga
        </p>
      </div>
      <p className="text-xs" style={{ color: W.inkMute }}>
        Quem mais evoluiu fatura o pote.
      </p>

      <div className="mt-3 space-y-2">
        {board.map((u, i) => (
          <div
            key={u.handle}
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5"
            style={{
              background: u.me ? W.blue : W.surface,
              boxShadow: u.me ? "none" : "inset 0 0 0 1px " + W.line,
            }}
          >
            <span
              className="w-5 text-center font-[family-name:var(--font-mono)] text-sm font-bold tabular-nums"
              style={{ color: u.me ? "#fff" : W.inkMute }}
            >
              {i + 1}
            </span>
            <span className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white">
              <Image src={u.avatar} alt={u.name} fill sizes="36px" className="object-cover" />
            </span>
            <span className="flex-1 truncate text-sm font-bold" style={{ color: u.me ? "#fff" : W.ink }}>
              {u.me ? "Você" : u.name.split(" ")[0]}
            </span>
            <span
              className="inline-flex items-center gap-1 font-[family-name:var(--font-mono)] text-sm font-semibold tabular-nums"
              style={{ color: u.me ? "#fff" : W.greenDeep }}
            >
              {i === 0 && <Check size={13} />}
              -{u.kg}kg
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: W.greenWash }}>
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold" style={{ color: W.greenDeep }}>
          <TrendingUp size={14} /> Pote da liga
        </span>
        <span className="font-[family-name:var(--font-mono)] text-lg font-medium tabular-nums" style={{ color: W.greenDeep }}>
          {brl(1840)}
        </span>
      </div>
    </div>
  );
}
