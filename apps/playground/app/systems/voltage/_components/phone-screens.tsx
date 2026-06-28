"use client";

import Image from "next/image";
import { Zap, Check, Crown, Bell } from "lucide-react";
import { USERS } from "@/lib/avatars";
import { ProductWordmark, BoltMark } from "@/app/components/wellbet-logo";
import { Phone } from "./phone";
import { V, GRAD, brl, odd } from "./tokens";

export function PhoneScreens() {
  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible">
      <div className="snap-center">
        <Phone label="Home · banca & carga">
          <HomeScreen />
        </Phone>
      </div>
      <div className="snap-center">
        <Phone label="Montar cupom">
          <SlipScreen />
        </Phone>
      </div>
      <div className="snap-center">
        <Phone label="Deu green">
          <GreenScreen />
        </Phone>
      </div>
    </div>
  );
}

function Glass({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div
      className="rounded-3xl p-5"
      style={{
        background: accent ? "rgba(65,255,202,.08)" : "rgba(255,255,255,.05)",
        backdropFilter: "blur(10px)",
        boxShadow: accent ? "inset 0 0 0 1px rgba(65,255,202,.3)" : "inset 0 0 0 1px rgba(255,255,255,.10)",
      }}
    >
      {children}
    </div>
  );
}

function HomeScreen() {
  return (
    <div className="px-4 pb-8">
      <div className="flex items-center justify-between">
        <ProductWordmark brand="well" size={20} tone="light" />
        <span className="grid h-9 w-9 place-items-center rounded-full" style={{ background: "rgba(255,255,255,.08)" }}>
          <Bell size={16} style={{ color: V.white }} />
        </span>
      </div>

      {/* banca */}
      <div className="mt-4 overflow-hidden rounded-3xl p-5" style={{ background: GRAD.bolt, color: V.greenInk }}>
        <span className="text-xs font-bold opacity-80">Banca disponível</span>
        <p className="mt-1 font-[family-name:var(--font-mono)] text-3xl font-bold tabular-nums">{brl(347.5)}</p>
        <div className="mt-3 flex gap-2">
          <span className="rounded-full px-3 py-1.5 text-xs font-extrabold" style={{ background: "rgba(8,22,30,.85)", color: V.green }}>
            + Depositar
          </span>
          <span className="rounded-full px-3 py-1.5 text-xs font-extrabold" style={{ background: "rgba(8,22,30,.18)" }}>
            Sacar
          </span>
        </div>
      </div>

      {/* charge meter da semana */}
      <div className="mt-4">
        <Glass>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: V.white }}>
              <BoltMark style={{ height: 14, width: "auto", color: V.green }} /> Carga da semana
            </span>
            <span className="font-[family-name:var(--font-mono)] text-xs tabular-nums" style={{ color: V.green }}>
              64%
            </span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,.08)" }}>
            <div className="h-full rounded-full" style={{ width: "64%", background: GRAD.flow }} />
          </div>
          <p className="mt-2 text-xs" style={{ color: V.inkFaint }}>
            Mais 3 check-ins pra liberar a free bet.
          </p>
        </Glass>
      </div>

      {/* aposta da semana */}
      <div className="mt-4">
        <Glass accent>
          <div className="flex items-center gap-2">
            <BoltMark style={{ height: 16, width: "auto", color: V.green }} />
            <span className="text-sm font-extrabold" style={{ color: V.green }}>
              Aposta da semana
            </span>
          </div>
          <p className="mt-1 text-xs" style={{ color: V.inkSoft }}>
            Perca 2kg em 7 dias · odd {odd(1.85)} · retorno {brl(92.5)}
          </p>
        </Glass>
      </div>
    </div>
  );
}

function SlipScreen() {
  return (
    <div className="px-4 pb-8">
      <p className="text-sm font-extrabold" style={{ color: V.white }}>
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
          style={{
            background: x.on ? "rgba(65,255,202,.08)" : "rgba(255,255,255,.05)",
            boxShadow: x.on ? "inset 0 0 0 1.5px rgba(65,255,202,.5)" : "inset 0 0 0 1px rgba(255,255,255,.10)",
          }}
        >
          <div>
            <p className="text-sm font-bold" style={{ color: V.white }}>
              {x.g}
            </p>
            <p className="text-[11px]" style={{ color: V.inkFaint }}>
              {x.s}
            </p>
          </div>
          <span
            className="bg-clip-text font-[family-name:var(--font-mono)] text-sm font-semibold tabular-nums"
            style={x.on ? { backgroundImage: GRAD.flow, color: "transparent" } : { color: V.inkSoft }}
          >
            {odd(x.o)}
          </span>
        </div>
      ))}

      <div className="mt-4 rounded-2xl p-4" style={{ background: "rgba(255,255,255,.05)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.10)" }}>
        <div className="flex items-center justify-between text-xs font-bold" style={{ color: V.inkSoft }}>
          <span>Stake</span>
          <span className="font-[family-name:var(--font-mono)] tabular-nums">{brl(50)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: V.inkSoft }}>
            Retorno
          </span>
          <span className="font-[family-name:var(--font-mono)] text-xl font-bold tabular-nums" style={{ color: V.green, textShadow: "0 0 16px rgba(65,255,202,.4)" }}>
            {brl(122.5)}
          </span>
        </div>
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold" style={{ background: GRAD.bolt, color: V.greenInk }}>
        <Zap size={16} fill={V.greenInk} /> Fazer aposta
      </button>
    </div>
  );
}

function GreenScreen() {
  const board = USERS.slice(0, 5).map((u, i) => ({ ...u, volts: 920 - i * 70, me: i === 1 }));
  return (
    <div className="px-4 pb-8">
      {/* hero deu green */}
      <div className="relative overflow-hidden rounded-3xl p-6 text-center" style={{ background: "rgba(65,255,202,.10)", boxShadow: "inset 0 0 0 1.5px rgba(65,255,202,.4)" }}>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full" style={{ background: GRAD.bolt }}>
          <Check size={30} strokeWidth={3.4} style={{ color: V.greenInk }} />
        </span>
        <p className="mt-3 bg-clip-text text-2xl font-extrabold text-transparent" style={{ backgroundImage: GRAD.flow }}>
          DEU GREEN!
        </p>
        <p className="font-[family-name:var(--font-mono)] text-sm tabular-nums" style={{ color: V.green }}>
          +{brl(92.5)} na banca
        </p>
        <p className="mt-1 text-xs" style={{ color: V.inkFaint }}>
          Streak de 7 dias · cadeia completa
        </p>
      </div>

      {/* mini ranking */}
      <div className="mt-4 flex items-center gap-2">
        <Crown size={16} style={{ color: V.green }} />
        <p className="text-sm font-extrabold" style={{ color: V.white }}>
          Ranking de voltagem
        </p>
      </div>
      <div className="mt-3 space-y-2">
        {board.map((u, i) => (
          <div
            key={u.handle}
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5"
            style={{
              background: u.me ? "rgba(65,255,202,.10)" : "rgba(255,255,255,.05)",
              boxShadow: u.me ? "inset 0 0 0 1.5px rgba(65,255,202,.5)" : "inset 0 0 0 1px rgba(255,255,255,.10)",
            }}
          >
            <span className="w-5 text-center font-[family-name:var(--font-mono)] text-sm font-bold tabular-nums" style={{ color: i === 0 ? V.green : V.inkFaint }}>
              {i + 1}
            </span>
            <span className="relative h-9 w-9 overflow-hidden rounded-full" style={{ boxShadow: `0 0 0 2px ${V.ground}, 0 0 0 3px ${i === 0 ? V.green : "rgba(255,255,255,.18)"}` }}>
              <Image src={u.avatar} alt={u.name} fill sizes="36px" className="object-cover" />
            </span>
            <span className="flex-1 truncate text-sm font-bold" style={{ color: V.white }}>
              {u.me ? "Você" : u.name.split(" ")[0]}
            </span>
            <span className="inline-flex items-center gap-1 font-[family-name:var(--font-mono)] text-sm font-semibold tabular-nums" style={{ color: V.green }}>
              <BoltMark style={{ height: 12, width: "auto", color: V.green }} />
              {u.volts}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
