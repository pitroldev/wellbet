"use client";

import Image from "next/image";
import { Flame, Crown, Trophy, Coins, Target, Check, Rocket, Bell } from "lucide-react";
import { USERS } from "@/lib/avatars";
import { ProductWordmark, BoltMark, BoltTile } from "@/app/components/wellbet-logo";
import { Phone } from "./phone";
import { G, GRAD, brl0 } from "./tokens";

export function PhoneScreens() {
  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible">
      <div className="snap-center">
        <Phone label="Ranking semanal">
          <RankScreen />
        </Phone>
      </div>
      <div className="snap-center">
        <Phone label="Desafio da semana">
          <ChallengeScreen />
        </Phone>
      </div>
      <div className="snap-center">
        <Phone label="Entre no ranking">
          <JoinScreen />
        </Phone>
      </div>
    </div>
  );
}

function RankScreen() {
  const board = USERS.slice(0, 6).map((u, i) => ({
    ...u,
    streak: 28 - i * 3 - (i === 3 ? 1 : 0),
    me: i === 3,
  }));
  const max = board[0].streak;
  return (
    <div className="px-4 pb-8">
      <div className="flex items-center justify-between">
        <ProductWordmark brand="gym" size={20} tone="light" />
        <span className="grid h-9 w-9 place-items-center rounded-full" style={{ background: G.navySoft }}>
          <Bell size={16} style={{ color: G.magenta }} />
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Trophy size={18} style={{ color: G.magenta }} />
        <p className="text-sm font-extrabold" style={{ color: G.white }}>
          Ranking · Liga Magenta
        </p>
      </div>
      <p className="text-xs" style={{ color: G.fogMute }}>
        Maior streak fatura o pote da semana.
      </p>

      <div className="mt-3 space-y-2">
        {board.map((u, i) => {
          const w = Math.max(16, (u.streak / max) * 100);
          return (
            <div
              key={u.handle}
              className="relative flex items-center gap-3 overflow-hidden rounded-2xl px-3 py-2.5"
              style={{
                background: u.me ? "rgba(255,0,255,.14)" : G.navySoft,
                boxShadow: u.me ? "inset 0 0 0 1.5px " + G.magenta : "inset 0 0 0 1px " + G.navyLine,
              }}
            >
              <span
                className="pointer-events-none absolute inset-y-0 left-0 rounded-2xl opacity-30"
                style={{ width: `${w}%`, background: u.me ? GRAD.gymbet : "linear-gradient(90deg,#7A1BD6,#3215AD)" }}
              />
              <span className="relative w-5 text-center font-[family-name:var(--font-mono)] text-sm font-bold tabular-nums" style={{ color: i === 0 ? G.green : G.fogMute }}>
                {i + 1}
              </span>
              <span className="relative h-9 w-9 overflow-hidden rounded-full" style={{ boxShadow: "0 0 0 2px " + (u.me ? G.magenta : G.navyLine) }}>
                <Image src={u.avatar} alt={u.name} fill sizes="36px" className="object-cover" />
              </span>
              <span className="relative flex-1 truncate text-sm font-bold" style={{ color: u.me ? G.white : G.fog }}>
                {i === 0 && <Crown size={12} style={{ color: G.green }} className="mr-1 inline" />}
                {u.me ? "Você" : u.name.split(" ")[0]}
              </span>
              <span className="relative font-[family-name:var(--font-mono)] text-sm font-bold tabular-nums" style={{ color: u.me ? G.magenta : G.white }}>
                {u.streak}d
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: GRAD.jackpot, color: G.greenInk }}>
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase">
          <Coins size={14} /> Pote da liga
        </span>
        <span className="font-[family-name:var(--font-mono)] text-lg font-bold tabular-nums">{brl0(4800)}</span>
      </div>
    </div>
  );
}

function ChallengeScreen() {
  const done = 3;
  const total = 5;
  return (
    <div className="px-4 pb-8">
      <div className="flex items-center gap-2">
        <Target size={18} style={{ color: G.magenta }} />
        <p className="text-sm font-extrabold" style={{ color: G.white }}>
          Desafio da semana
        </p>
      </div>

      <div className="mt-3 overflow-hidden rounded-3xl p-5" style={{ background: GRAD.gymbet, color: "#fff" }}>
        <span className="text-xs font-bold uppercase tracking-wide opacity-90">Sua missão</span>
        <p className="mt-1 font-[family-name:var(--font-archivo)] text-2xl font-black uppercase italic leading-[0.9] tracking-tight">
          5 treinos,
          <br /> free bet liberada
        </p>
        <p className="mt-2 font-[family-name:var(--font-mono)] text-sm tabular-nums opacity-90">
          recompensa {brl0(250)}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {Array.from({ length: total }).map((_, i) => {
          const on = i < done;
          return (
            <div key={i} className="grid h-11 place-items-center rounded-xl" style={{ background: on ? G.magenta : G.navySoft, boxShadow: on ? "0 0 14px -4px rgba(255,0,255,.8)" : "inset 0 0 0 1px " + G.navyLine }}>
              {on ? <Check size={15} strokeWidth={3} style={{ color: "#fff" }} /> : <span className="h-1.5 w-1.5 rounded-full" style={{ background: G.fogMute }} />}
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl p-4" style={{ background: G.navySoft, boxShadow: "inset 0 0 0 1px " + G.navyLine }}>
        <div className="flex items-center justify-between text-xs font-bold" style={{ color: G.fog }}>
          <span>Progresso</span>
          <span className="font-[family-name:var(--font-mono)] tabular-nums" style={{ color: G.green }}>
            {done}/{total}
          </span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full" style={{ background: G.ink }}>
          <div className="h-full rounded-full" style={{ width: `${(done / total) * 100}%`, background: GRAD.gymbet }} />
        </div>
        <p className="mt-2 text-[11px]" style={{ color: G.fogMute }}>
          Faltam 2 treinos pra liberar a free bet.
        </p>
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold" style={{ background: G.magenta, color: "#fff" }}>
        <Flame size={16} fill="#fff" /> Registrar treino de hoje
      </button>
    </div>
  );
}

function JoinScreen() {
  const u = USERS[4];
  return (
    <div className="relative px-4 pb-8">
      {/* estilhaço diagonal de fundo */}
      <span className="pointer-events-none absolute -right-12 top-16 h-48 w-48 rotate-12 rounded-full opacity-30 blur-3xl" style={{ background: G.magenta }} />

      <div className="relative flex flex-col items-center pt-3 text-center">
        <BoltTile size={48} bg={G.magenta} fg="#fff" style={{ boxShadow: "0 0 24px -4px rgba(255,0,255,.9)" }} />

        <h3 className="mt-5 font-[family-name:var(--font-archivo)] text-3xl font-black uppercase italic leading-[0.88] tracking-tight" style={{ color: G.white }}>
          Entre no
          <br />
          <span style={{ color: G.magenta }}>ranking</span>
        </h3>
        <p className="mt-1 font-[family-name:var(--font-archivo)] text-lg font-black uppercase italic leading-none tracking-tight" style={{ color: G.pinkPale }}>
          Conquiste o jackpot
        </p>

        {/* avatar herói */}
        <div className="relative mt-5 h-28 w-28 overflow-hidden rounded-full" style={{ boxShadow: "0 0 0 3px " + G.magenta + ", 0 0 36px -6px rgba(255,0,255,.9)" }}>
          <Image src={u.avatar} alt={u.name} fill sizes="112px" className="object-cover" />
        </div>
        <p className="mt-3 text-sm font-bold" style={{ color: G.white }}>
          {u.name.split(" ")[0]} já tem 17 dias de streak
        </p>
        <p className="text-xs" style={{ color: G.fogMute }}>
          Treine. Compita. Fature.
        </p>

        <div className="mt-5 w-full space-y-2.5">
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-extrabold" style={{ background: GRAD.gymbet, color: "#fff", boxShadow: "0 12px 28px -10px rgba(255,0,255,.8)" }}>
            <Rocket size={18} /> Baixe agora
          </button>
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold" style={{ background: G.navySoft, color: G.white, boxShadow: "inset 0 0 0 1px " + G.navyLine }}>
            <BoltMark style={{ height: 14, width: "auto", color: G.magenta }} /> Ver a liga primeiro
          </button>
        </div>
      </div>
    </div>
  );
}
