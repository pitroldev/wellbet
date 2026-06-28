"use client";

import Image from "next/image";
import { Zap, Trophy, Crown, ArrowRight, Bell } from "lucide-react";
import { USERS } from "@/lib/avatars";
import { ProductWordmark, BoltMark } from "@/app/components/wellbet-logo";
import { Phone } from "./phone";
import { B, BORDER, BORDER_THIN, shadow, brl, odd } from "./tokens";
import { Sticker } from "./primitives";

export function PhoneScreens() {
  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible">
      <div className="snap-center">
        <Phone label="HOME · BANCA">
          <HomeScreen />
        </Phone>
      </div>
      <div className="snap-center">
        <Phone label="MONTAR CUPOM">
          <SlipScreen />
        </Phone>
      </div>
      <div className="snap-center">
        <Phone label="RANKING">
          <RankScreen />
        </Phone>
      </div>
    </div>
  );
}

function ChunkBtn({
  children,
  bg = B.magenta,
  fg = "#FFFFFF",
}: {
  children: React.ReactNode;
  bg?: string;
  fg?: string;
}) {
  return (
    <span
      className="inline-flex items-center justify-center gap-1.5 font-[family-name:var(--font-archivo)] text-xs font-black uppercase tracking-wide"
      style={{ background: bg, color: fg, border: BORDER_THIN, boxShadow: shadow(3), padding: "9px 12px" }}
    >
      {children}
    </span>
  );
}

function HomeScreen() {
  return (
    <div className="px-3 pb-8">
      <div className="flex items-center justify-between">
        <ProductWordmark brand="well" size={20} />
        <span className="grid h-9 w-9 place-items-center" style={{ background: B.white, border: BORDER_THIN }}>
          <Bell size={15} style={{ color: B.ink }} />
        </span>
      </div>

      <div className="mt-3 p-4" style={{ background: B.ink, border: BORDER, boxShadow: shadow(4) }}>
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-white/55">
          BANCA DISPONÍVEL
        </span>
        <p className="mt-1 font-[family-name:var(--font-mono)] text-3xl font-bold tabular-nums" style={{ color: B.green }}>
          {brl(347.5)}
        </p>
        <div className="mt-3 flex gap-2">
          <ChunkBtn bg={B.green} fg={B.ink}>+ DEPOSITAR</ChunkBtn>
          <ChunkBtn bg={B.white} fg={B.ink}>SACAR</ChunkBtn>
        </div>
      </div>

      <div className="mt-3 p-4" style={{ background: B.white, border: BORDER, boxShadow: shadow(4) }}>
        <div className="flex items-center justify-between">
          <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-wide" style={{ color: B.ink }}>
            EVOLUÇÃO
          </span>
          <span className="font-[family-name:var(--font-mono)] text-xs font-bold tabular-nums" style={{ color: B.ink }}>
            -2,4/-4KG
          </span>
        </div>
        <div className="mt-2 h-4 overflow-hidden" style={{ background: B.paper, border: BORDER_THIN }}>
          <div className="h-full" style={{ width: "60%", background: B.magenta }} />
        </div>
        <p className="mt-1 font-[family-name:var(--font-mono)] text-[10px] uppercase" style={{ color: B.ink, opacity: 0.55 }}>
          faltam 1,6kg pra free bet
        </p>
      </div>

      <div className="relative mt-4 p-4" style={{ background: B.green, border: BORDER, boxShadow: shadow(4) }}>
        <span className="absolute -right-1 -top-3">
          <Sticker bg={B.magenta} fg="#FFFFFF" rotate={4}>HOT</Sticker>
        </span>
        <div className="flex items-center gap-2">
          <BoltMark style={{ height: 15, width: "auto", color: B.ink }} />
          <span className="font-[family-name:var(--font-archivo)] text-sm font-black uppercase" style={{ color: B.ink }}>
            APOSTA DA SEMANA
          </span>
        </div>
        <p className="mt-1 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide" style={{ color: B.ink }}>
          -2KG/7D · ODD {odd(1.85)} · {brl(92.5)}
        </p>
      </div>
    </div>
  );
}

function SlipScreen() {
  const rows = [
    { g: "PERDER 2KG", s: "7 DIAS", o: 1.85, on: false },
    { g: "PERDER 4KG", s: "14 DIAS", o: 2.45, on: true },
    { g: "TREINAR 5×", s: "SEMANA", o: 1.6, on: false },
  ];
  return (
    <div className="px-3 pb-8">
      <p className="font-[family-name:var(--font-archivo)] text-lg font-black uppercase" style={{ color: B.ink }}>
        CUPOM
      </p>
      <div className="mt-2" style={{ border: BORDER, boxShadow: shadow(4), background: B.white }}>
        {rows.map((x, i) => (
          <div
            key={x.g}
            className="flex items-center justify-between px-3 py-3"
            style={{
              background: x.on ? B.magenta : B.white,
              color: x.on ? "#FFFFFF" : B.ink,
              borderBottom: i < rows.length - 1 ? BORDER_THIN : "none",
            }}
          >
            <div>
              <p className="font-[family-name:var(--font-archivo)] text-sm font-black uppercase">{x.g}</p>
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase opacity-80">{x.s}</p>
            </div>
            <span className="font-[family-name:var(--font-mono)] text-lg font-bold tabular-nums">{odd(x.o)}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 p-3" style={{ background: B.green, border: BORDER, boxShadow: shadow(4) }}>
        <div className="flex items-center justify-between font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase" style={{ color: B.ink }}>
          <span>STAKE</span>
          <span className="tabular-nums">{brl(50)}</span>
        </div>
        <div className="mt-1 flex items-end justify-between">
          <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase" style={{ color: B.ink }}>
            RETORNO
          </span>
          <span className="font-[family-name:var(--font-mono)] text-2xl font-bold tabular-nums" style={{ color: B.ink }}>
            {brl(122.5)}
          </span>
        </div>
      </div>

      <div className="mt-3 flex w-full items-center justify-center gap-2" style={{ background: B.ink, border: BORDER, boxShadow: shadow(4), padding: "13px" }}>
        <Zap size={16} fill={B.green} style={{ color: B.green }} />
        <span className="font-[family-name:var(--font-archivo)] text-sm font-black uppercase tracking-wide text-white">
          FAZER APOSTA
        </span>
      </div>
    </div>
  );
}

function RankScreen() {
  const board = USERS.slice(0, 6).map((u, i) => ({
    ...u,
    kg: (4.3 - i * 0.5).toFixed(1),
    me: i === 2,
  }));
  return (
    <div className="px-3 pb-8">
      <div className="flex items-center gap-2">
        <Trophy size={17} style={{ color: B.magenta }} />
        <p className="font-[family-name:var(--font-archivo)] text-lg font-black uppercase" style={{ color: B.ink }}>
          RANKING
        </p>
      </div>
      <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wide" style={{ color: B.ink, opacity: 0.55 }}>
        quem mais evoluiu fatura o pote
      </p>

      <div className="mt-3" style={{ border: BORDER, boxShadow: shadow(4), background: B.white }}>
        {board.map((u, i) => (
          <div
            key={u.handle}
            className="flex items-center gap-2 px-2.5 py-2"
            style={{
              background: u.me ? B.magenta : B.white,
              color: u.me ? "#FFFFFF" : B.ink,
              borderBottom: i < board.length - 1 ? BORDER_THIN : "none",
            }}
          >
            <span className="w-4 text-center font-[family-name:var(--font-mono)] text-sm font-bold tabular-nums">
              {i + 1}
            </span>
            <span className="relative h-8 w-8 overflow-hidden" style={{ border: `2px solid ${u.me ? "#FFFFFF" : B.ink}` }}>
              <Image src={u.avatar} alt={u.name} fill sizes="32px" className="object-cover" style={{ filter: "grayscale(1) contrast(1.1)" }} />
            </span>
            <span className="flex-1 truncate font-[family-name:var(--font-archivo)] text-sm font-black uppercase">
              {u.me ? "VOCÊ" : u.name.split(" ")[0]}
              {i === 0 && <Crown size={12} className="-mt-0.5 ml-1 inline" style={{ color: u.me ? "#FFFFFF" : B.magenta }} />}
            </span>
            <span className="font-[family-name:var(--font-mono)] text-sm font-bold tabular-nums">
              -{u.kg}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between p-3" style={{ background: B.green, border: BORDER, boxShadow: shadow(4) }}>
        <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase" style={{ color: B.ink }}>
          POTE DA LIGA
        </span>
        <span className="font-[family-name:var(--font-mono)] text-lg font-bold tabular-nums" style={{ color: B.ink }}>
          {brl(1840)}
        </span>
      </div>

      <div className="mt-3 flex w-full items-center justify-center gap-1.5" style={{ background: B.ink, border: BORDER, boxShadow: shadow(4), padding: "12px" }}>
        <span className="font-[family-name:var(--font-archivo)] text-sm font-black uppercase tracking-wide text-white">
          BAIXE AGORA
        </span>
        <ArrowRight size={15} style={{ color: B.green }} />
      </div>
    </div>
  );
}
