"use client";

import Image from "next/image";
import { Coins, Bell, Crown, Wallet, TrendingUp, Check, ChevronRight } from "lucide-react";
import { USERS } from "@/lib/avatars";
import { WellbetCoLogo, BoltMark } from "@/app/components/wellbet-logo";
import { Phone } from "./phone";
import { Chip } from "./primitives";
import { N, brl, brl0, odd, neonText } from "./tokens";

export function PhoneScreens() {
  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible">
      <div className="snap-center">
        <Phone label="Salão · banca" glow={N.magenta}>
          <LobbyScreen />
        </Phone>
      </div>
      <div className="snap-center">
        <Phone label="Mesa de roleta" glow={N.blue}>
          <TableScreen />
        </Phone>
      </div>
      <div className="snap-center">
        <Phone label="Deu green · payout" glow={N.green}>
          <PayoutScreen />
        </Phone>
      </div>
    </div>
  );
}

function LobbyScreen() {
  return (
    <div className="px-4 pb-8" style={{ background: N.groundDeep, minHeight: "100%" }}>
      <div className="flex items-center justify-between">
        <WellbetCoLogo size={24} tone="light" />
        <span className="grid h-9 w-9 place-items-center rounded-full" style={{ background: N.panelSoft }}>
          <Bell size={16} style={{ color: N.white }} />
        </span>
      </div>

      {/* banca de fichas */}
      <div
        className="mt-4 overflow-hidden rounded-3xl p-5"
        style={{
          background: `radial-gradient(circle at 80% 0%, ${N.magenta}33, ${N.indigo} 70%)`,
          boxShadow: `0 0 24px ${N.magenta}33`,
        }}
      >
        <span className="text-xs text-white/70">Banca de fichas</span>
        <p
          className="mt-1 font-[family-name:var(--font-mono)] text-3xl font-medium tabular-nums"
          style={{ color: N.green, textShadow: neonText(N.green) }}
        >
          {brl(1240.5)}
        </p>
        <div className="mt-3 flex gap-2">
          <span className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold" style={{ background: N.green, color: N.greenInk }}>
            <Wallet size={12} /> Depositar
          </span>
          <span className="rounded-full px-3 py-1.5 text-xs font-bold text-white" style={{ background: "rgba(255,255,255,.14)" }}>
            Sacar
          </span>
        </div>
      </div>

      {/* mesas ao vivo */}
      <p className="mt-5 font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: N.mute }}>
        Mesas ao vivo
      </p>
      <div className="mt-2 space-y-2">
        {[
          { n: "Roleta Neon", odd: 2.0, c: N.magenta },
          { n: "Blackjack 21", odd: 2.45, c: N.green },
          { n: "Dados 7+", odd: 1.85, c: N.blue },
        ].map((m) => (
          <div
            key={m.n}
            className="flex items-center justify-between rounded-2xl px-4 py-3"
            style={{ background: N.panel, border: `1px solid ${N.line}` }}
          >
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: m.c, boxShadow: `0 0 8px ${m.c}` }} />
              <span className="text-sm font-bold text-white">{m.n}</span>
            </div>
            <span className="font-[family-name:var(--font-mono)] text-sm tabular-nums" style={{ color: m.c }}>
              {odd(m.odd)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-2xl p-3" style={{ background: "rgba(244,201,93,.12)" }}>
        <Crown size={18} style={{ color: N.gold }} />
        <span className="text-xs font-bold" style={{ color: N.gold }}>
          Jackpot acumulado · {brl0(48200)}
        </span>
      </div>
    </div>
  );
}

function TableScreen() {
  return (
    <div className="px-4 pb-8" style={{ background: N.groundDeep, minHeight: "100%" }}>
      <div className="flex items-center gap-2">
        <BoltMark style={{ height: 16, width: "auto", color: N.magenta }} />
        <p
          className="font-[family-name:var(--font-mono)] text-sm font-bold uppercase tracking-[0.16em]"
          style={{ color: N.magenta, textShadow: neonText(N.magenta) }}
        >
          Mesa de roleta
        </p>
      </div>

      {/* roleta estilizada */}
      <div
        className="relative mx-auto mt-4 grid h-[180px] w-[180px] place-items-center rounded-full"
        style={{
          background: `conic-gradient(${N.green} 0 30deg, ${N.magenta} 30deg 60deg, ${N.green} 60deg 90deg, ${N.magenta} 90deg 120deg, ${N.green} 120deg 150deg, ${N.magenta} 150deg 180deg, ${N.green} 180deg 210deg, ${N.magenta} 210deg 240deg, ${N.green} 240deg 270deg, ${N.magenta} 270deg 300deg, ${N.green} 300deg 330deg, ${N.magenta} 330deg 360deg)`,
          border: `3px solid ${N.gold}`,
          boxShadow: `0 0 26px ${N.blue}55`,
        }}
      >
        <span className="grid h-16 w-16 place-items-center rounded-full" style={{ background: N.groundDeep, border: `2px solid ${N.gold}` }}>
          <span className="h-3 w-3 rounded-full" style={{ background: N.gold }} />
        </span>
      </div>

      {/* aposta */}
      <div className="mt-5 rounded-2xl p-4" style={{ background: N.panel, border: `1px solid ${N.line}` }}>
        <div className="flex items-center justify-between text-xs font-bold" style={{ color: N.mute }}>
          <span>Aposta · no green</span>
          <span className="font-[family-name:var(--font-mono)] tabular-nums" style={{ color: N.green }}>
            odd {odd(2.0)}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-center gap-3">
          <Chip value={25} ring={N.magenta} size={44} />
          <Chip value={25} ring={N.magenta} size={44} />
          <span className="font-[family-name:var(--font-mono)] text-lg tabular-nums text-white">{brl(50)}</span>
        </div>
      </div>

      <button
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold"
        style={{ background: N.magenta, color: "#fff", boxShadow: `0 0 18px ${N.magenta}77` }}
      >
        <Coins size={16} /> Girar a roleta <ChevronRight size={15} />
      </button>
    </div>
  );
}

function PayoutScreen() {
  const board = USERS.slice(0, 4);
  return (
    <div
      className="px-4 pb-8"
      style={{ background: `radial-gradient(circle at 50% 0%, ${N.green}22, ${N.groundDeep} 60%)`, minHeight: "100%" }}
    >
      <div className="mt-2 flex flex-col items-center text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full" style={{ background: N.green, boxShadow: `0 0 24px ${N.green}aa` }}>
          <Check size={30} strokeWidth={3.4} style={{ color: N.greenInk }} />
        </span>
        <p
          className="mt-3 font-[family-name:var(--font-archivo)] text-2xl font-black uppercase tracking-tight"
          style={{ color: N.green, textShadow: neonText(N.green) }}
        >
          Deu green!
        </p>
        <p
          className="font-[family-name:var(--font-mono)] text-3xl font-medium tabular-nums"
          style={{ color: N.white, textShadow: neonText(N.green) }}
        >
          +{brl(100)}
        </p>
        <span className="mt-1 text-xs" style={{ color: N.mute }}>
          Roleta · caiu no 7 · odd 2,00
        </span>
      </div>

      {/* recibo */}
      <div className="mt-5 rounded-2xl p-4" style={{ background: N.panel, border: `1px solid ${N.line}` }}>
        {[
          ["Stake", brl(50)],
          ["Cotação", odd(2.0)],
          ["Retorno", brl(100)],
        ].map(([k, v], i) => (
          <div
            key={k}
            className="flex items-center justify-between py-1.5"
            style={{ borderTop: i ? `1px dashed ${N.line}` : undefined }}
          >
            <span className="text-xs" style={{ color: N.mute }}>
              {k}
            </span>
            <span className="font-[family-name:var(--font-mono)] text-sm tabular-nums" style={{ color: i === 2 ? N.green : N.white }}>
              {v}
            </span>
          </div>
        ))}
      </div>

      {/* na mesa agora */}
      <div className="mt-4 flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: "rgba(255,255,255,.05)" }}>
        <div className="flex -space-x-3">
          {board.map((u) => (
            <span
              key={u.handle}
              className="relative inline-block h-8 w-8 overflow-hidden rounded-full"
              style={{ boxShadow: `0 0 0 2px ${N.groundDeep}, 0 0 0 3px ${N.green}66` }}
            >
              <Image src={u.avatar} alt={u.name} fill sizes="32px" className="object-cover" />
            </span>
          ))}
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: N.green }}>
          <TrendingUp size={13} /> +18 deram green
        </span>
      </div>

      <button
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold"
        style={{ background: N.green, color: N.greenInk, boxShadow: `0 0 18px ${N.green}77` }}
      >
        <Coins size={16} /> Resgatar {brl(100)}
      </button>
    </div>
  );
}
