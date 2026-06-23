"use client";

import { motion } from "framer-motion";
import { Home, Ticket, Trophy, User, Flame, Zap, TrendingUp, CheckCircle2 } from "lucide-react";
import { USERS } from "@/lib/avatars";
import { ISO, brl, odd } from "./tokens";
import { IsoCube } from "./iso-primitives";
import { IsoAvatarCircle } from "./iso-avatar";
import { IsoShield } from "./iso-shield";

/* ───────── barra de navegação inferior comum ───────── */
function TabBar({ active }: { active: "home" | "bet" | "rank" | "me" }) {
  const tabs = [
    { id: "home", Icon: Home, label: "Início" },
    { id: "bet", Icon: Ticket, label: "Cupom" },
    { id: "rank", Icon: Trophy, label: "Ranking" },
    { id: "me", Icon: User, label: "Perfil" },
  ] as const;
  return (
    <div
      className="sticky bottom-0 z-20 mt-auto flex items-stretch justify-around px-2 py-2"
      style={{ background: "#FFFFFF", borderTop: `3px solid ${ISO.ink}` }}
    >
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <div key={t.id} className="flex flex-1 flex-col items-center gap-0.5 py-1">
            <span
              className="grid h-9 w-9 place-items-center rounded-xl"
              style={{
                background: on ? ISO.purple : "transparent",
                color: on ? "#FFFFFF" : ISO.inkSoft,
                border: on ? `2px solid ${ISO.ink}` : "none",
              }}
            >
              <t.Icon size={18} strokeWidth={2.5} />
            </span>
            <span className="text-[9px] font-bold" style={{ color: on ? ISO.ink : ISO.inkSoft }}>
              {t.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ScreenHeader({ name, avatar }: { name: string; avatar: string }) {
  return (
    <div className="flex items-center justify-between px-4 pb-3 pt-1">
      <div className="flex items-center gap-2.5">
        <IsoAvatarCircle src={avatar} alt={name} size={40} ring={ISO.green} />
        <div>
          <p className="text-[11px] leading-none" style={{ color: ISO.inkSoft }}>
            Bom treino,
          </p>
          <p
            className="font-[family-name:var(--font-display)] text-base font-bold leading-tight"
            style={{ color: ISO.ink }}
          >
            {name.split(" ")[0]}
          </p>
        </div>
      </div>
      <span
        className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold"
        style={{
          background: ISO.yellow,
          color: ISO.ink,
          border: `2px solid ${ISO.ink}`,
        }}
      >
        <Flame size={13} strokeWidth={2.8} /> 34
      </span>
    </div>
  );
}

/* ───────── 1. HOME / FEED ───────── */
export function ScreenHome() {
  const me = USERS[4];
  return (
    <div className="flex min-h-full flex-col">
      <ScreenHeader name={me.name} avatar={me.avatar} />

      {/* banca */}
      <div className="px-4">
        <div
          className="flex items-center justify-between rounded-3xl p-4"
          style={{
            background: ISO.purple,
            border: `3px solid ${ISO.ink}`,
            boxShadow: `5px 6px 0 ${ISO.purpleDeep}`,
          }}
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
              Sua banca
            </p>
            <p className="font-[family-name:var(--font-display)] text-3xl font-bold leading-none text-white tabular-nums">
              {brl(340, false)}
            </p>
          </div>
          <IsoCube size={56} top={ISO.yellow} left={ISO.yellowDeep} right="#B07C09" />
        </div>
      </div>

      {/* aposta ativa */}
      <div className="mt-4 px-4">
        <p
          className="mb-2 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: ISO.inkSoft }}
        >
          Sua aposta ativa
        </p>
        <div
          className="rounded-2xl p-3.5"
          style={{
            background: "#FFFFFF",
            border: `2.5px solid ${ISO.ink}`,
            boxShadow: `4px 5px 0 ${ISO.green}`,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold" style={{ color: ISO.ink }}>
              🔥 Perder 8 kg em 4 meses
            </span>
            <span
              className="rounded-lg px-2 py-0.5 text-xs font-bold tabular-nums"
              style={{
                background: ISO.base,
                color: ISO.purple,
                border: `2px solid ${ISO.baseDeep}`,
              }}
            >
              {odd(2.4)}
            </span>
          </div>
          <div
            className="mt-3 h-3.5 w-full overflow-hidden rounded-full"
            style={{ background: ISO.base, border: `2px solid ${ISO.ink}` }}
          >
            <div className="h-full rounded-full" style={{ width: "62%", background: ISO.green }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span style={{ color: ISO.inkSoft }}>62% da meta</span>
            <span className="font-bold tabular-nums" style={{ color: ISO.greenDeep }}>
              <TrendingUp size={11} className="mr-0.5 inline" /> retorno {brl(480, false)}
            </span>
          </div>
        </div>
      </div>

      {/* acumuladora mini */}
      <div className="mt-4 px-4">
        <p
          className="mb-2 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: ISO.inkSoft }}
        >
          Acumuladora da semana
        </p>
        <div
          className="flex items-end justify-between gap-1 rounded-2xl p-3"
          style={{ background: "#FFFFFF", border: `2.5px solid ${ISO.ink}` }}
        >
          {["S", "T", "Q", "Q", "S", "S", "D"].map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              {i < 4 ? (
                <IsoCube size={20} top="#54EFB0" left={ISO.green} right={ISO.greenDeep} />
              ) : (
                <div
                  className="h-3.5 w-3.5 rounded-md"
                  style={{
                    background: ISO.base,
                    border: `2px dashed ${ISO.baseDeep}`,
                  }}
                />
              )}
              <span
                className="text-[9px] font-bold"
                style={{ color: i < 4 ? ISO.greenDeep : ISO.inkSoft }}
              >
                {d}
              </span>
            </div>
          ))}
          <div className="ml-1 text-right">
            <p
              className="font-[family-name:var(--font-display)] text-xl font-bold leading-none"
              style={{ color: ISO.purple }}
            >
              2.12x
            </p>
            <p className="text-[9px]" style={{ color: ISO.inkSoft }}>
              multi
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <button
          className="w-full rounded-2xl py-3.5 font-[family-name:var(--font-display)] text-base font-bold uppercase"
          style={{
            background: ISO.green,
            color: ISO.ink,
            border: `3px solid ${ISO.ink}`,
            boxShadow: `0 5px 0 ${ISO.greenDeep}`,
          }}
        >
          Check-in de hoje
        </button>
      </div>
      <TabBar active="home" />
    </div>
  );
}

/* ───────── 2. CUPOM / APOSTA ───────── */
export function ScreenBet() {
  return (
    <div className="flex min-h-full flex-col">
      <div className="px-4 pb-2 pt-1">
        <p
          className="font-[family-name:var(--font-display)] text-xl font-bold"
          style={{ color: ISO.ink }}
        >
          Montar cupom
        </p>
        <p className="text-xs" style={{ color: ISO.inkSoft }}>
          Aposte em você. A casa torce a favor.
        </p>
      </div>

      <div className="px-4">
        <div
          className="rounded-2xl p-3.5"
          style={{
            background: ISO.base,
            border: `2.5px solid ${ISO.purple}`,
            boxShadow: `3px 4px 0 ${ISO.purple}`,
          }}
        >
          <span className="text-sm font-bold" style={{ color: ISO.ink }}>
            🏃 Correr 100 km no mês
          </span>
          <p className="text-xs" style={{ color: ISO.inkSoft }}>
            check-in a cada corrida
          </p>
        </div>
      </div>

      <div className="mt-4 px-4">
        <p
          className="mb-1.5 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: ISO.inkSoft }}
        >
          Banca
        </p>
        <div className="flex items-center gap-2">
          <span
            className="grid h-11 w-11 place-items-center rounded-2xl font-[family-name:var(--font-display)] text-2xl font-bold"
            style={{
              background: ISO.purple,
              color: "#FFFFFF",
              border: `2.5px solid ${ISO.ink}`,
            }}
          >
            −
          </span>
          <div
            className="flex flex-1 items-center justify-center rounded-2xl py-2"
            style={{ background: "#FFFFFF", border: `2.5px solid ${ISO.ink}` }}
          >
            <span
              className="font-[family-name:var(--font-display)] text-2xl font-bold tabular-nums"
              style={{ color: ISO.ink }}
            >
              {brl(150, false)}
            </span>
          </div>
          <span
            className="grid h-11 w-11 place-items-center rounded-2xl font-[family-name:var(--font-display)] text-2xl font-bold"
            style={{
              background: ISO.purple,
              color: "#FFFFFF",
              border: `2.5px solid ${ISO.ink}`,
            }}
          >
            +
          </span>
        </div>
      </div>

      <div className="mt-4 px-4">
        <div
          className="grid grid-cols-2 gap-2 rounded-2xl p-3.5"
          style={{
            background: ISO.base,
            border: `2.5px solid ${ISO.baseDeep}`,
          }}
        >
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: ISO.inkSoft }}
            >
              Cotação
            </p>
            <p
              className="font-[family-name:var(--font-display)] text-2xl font-bold leading-none tabular-nums"
              style={{ color: ISO.purple }}
            >
              1.85x
            </p>
          </div>
          <div className="text-right">
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: ISO.inkSoft }}
            >
              Retorno
            </p>
            <p
              className="font-[family-name:var(--font-display)] text-2xl font-bold leading-none tabular-nums"
              style={{ color: ISO.greenDeep }}
            >
              {brl(278, false)}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-[family-name:var(--font-display)] text-lg font-bold uppercase"
          style={{
            background: ISO.green,
            color: ISO.ink,
            border: `3px solid ${ISO.ink}`,
            boxShadow: `0 6px 0 ${ISO.greenDeep}`,
          }}
        >
          <Zap size={18} fill={ISO.ink} /> Fazer aposta
        </button>
      </div>
      <TabBar active="bet" />
    </div>
  );
}

/* ───────── 3. PAYOUT / DEU GREEN ───────── */
export function ScreenGreen() {
  const me = USERS[8];
  return (
    <div className="flex min-h-full flex-col" style={{ background: ISO.green }}>
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          <IsoCube size={104} top="#FFE08A" left={ISO.yellow} right={ISO.yellowDeep} />
        </motion.div>
        <p
          className="mt-6 font-[family-name:var(--font-display)] text-5xl font-bold leading-none"
          style={{ color: ISO.ink }}
        >
          DEU GREEN!
        </p>
        <p className="mt-3 text-sm font-semibold" style={{ color: ISO.ink }}>
          Você cumpriu “Perder 8 kg em 4 meses”.
        </p>

        <div
          className="mt-6 w-full rounded-3xl p-5"
          style={{
            background: "#FFFFFF",
            border: `3px solid ${ISO.ink}`,
            boxShadow: `6px 7px 0 ${ISO.greenDeep}`,
          }}
        >
          <p
            className="text-[11px] font-bold uppercase tracking-widest"
            style={{ color: ISO.inkSoft }}
          >
            Pago na sua banca
          </p>
          <p
            className="font-[family-name:var(--font-display)] text-4xl font-bold leading-none tabular-nums"
            style={{ color: ISO.greenDeep }}
          >
            {brl(480, false)}
          </p>
          <div
            className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold"
            style={{ color: ISO.inkSoft }}
          >
            <CheckCircle2 size={14} color={ISO.greenDeep} /> banca {brl(200, false)} · cotação{" "}
            {odd(2.4)}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <IsoAvatarCircle src={me.avatar} alt={me.name} size={36} ring={ISO.yellow} />
          <span className="text-sm font-bold" style={{ color: ISO.ink }}>
            {me.name} apostou em si — e ganhou.
          </span>
        </div>
      </div>
      <div className="px-4 pb-3">
        <button
          className="w-full rounded-2xl py-3.5 font-[family-name:var(--font-display)] text-base font-bold uppercase"
          style={{
            background: ISO.ink,
            color: ISO.green,
            border: `3px solid ${ISO.ink}`,
          }}
        >
          Compartilhar green
        </button>
      </div>
      <TabBar active="me" />
    </div>
  );
}

/* ───────── 4. RANKING / QUEM DEU GREEN ───────── */
export function ScreenRank() {
  const rows = [
    {
      u: USERS[1],
      goal: "100 km no mês",
      payout: 930,
      place: 1,
      ring: ISO.yellow,
    },
    { u: USERS[11], goal: "Maratona", payout: 740, place: 2, ring: "#C0C6D4" },
    {
      u: USERS[8],
      goal: "Perdeu 8 kg",
      payout: 480,
      place: 3,
      ring: ISO.coral,
    },
    { u: USERS[6], goal: "5x/semana", payout: 440, place: 4, ring: ISO.purple },
    {
      u: USERS[13],
      goal: "Largou açúcar",
      payout: 380,
      place: 5,
      ring: ISO.purple,
    },
  ];
  return (
    <div className="flex min-h-full flex-col">
      <div className="px-4 pb-3 pt-1">
        <p
          className="font-[family-name:var(--font-display)] text-xl font-bold"
          style={{ color: ISO.ink }}
        >
          Quem deu green
        </p>
        <p className="text-xs" style={{ color: ISO.inkSoft }}>
          Squad “Ferro &amp; Foco” · esta semana
        </p>
      </div>

      <div className="flex flex-col gap-2 px-4">
        {rows.map((r) => (
          <div
            key={r.u.handle}
            className="flex items-center gap-3 rounded-2xl p-2.5"
            style={{
              background: r.place === 1 ? ISO.base : "#FFFFFF",
              border: `2.5px solid ${r.place === 1 ? ISO.purple : ISO.baseDeep}`,
              boxShadow: r.place === 1 ? `3px 4px 0 ${ISO.purple}` : "none",
            }}
          >
            <span
              className="w-5 text-center font-[family-name:var(--font-display)] text-lg font-bold"
              style={{ color: ISO.inkSoft }}
            >
              {r.place}
            </span>
            <IsoAvatarCircle src={r.u.avatar} alt={r.u.name} size={42} ring={r.ring} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold leading-tight" style={{ color: ISO.ink }}>
                {r.u.name}
              </p>
              <p className="truncate text-xs" style={{ color: ISO.inkSoft }}>
                {r.goal}
              </p>
            </div>
            <span
              className="shrink-0 rounded-lg px-2 py-1 font-[family-name:var(--font-display)] text-xs font-bold tabular-nums"
              style={{
                background: ISO.green,
                color: ISO.ink,
                border: `2px solid ${ISO.ink}`,
              }}
            >
              {brl(r.payout, false)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 px-4">
        <div
          className="flex items-center gap-3 rounded-2xl p-3"
          style={{ background: ISO.purple, border: `2.5px solid ${ISO.ink}` }}
        >
          <IsoShield size={44} active />
          <p className="text-xs font-semibold text-white">
            Sua acumuladora segue viva: <strong>shield ativo</strong> cobre 1 falha.
          </p>
        </div>
      </div>
      <div className="flex-1" />
      <TabBar active="rank" />
    </div>
  );
}
