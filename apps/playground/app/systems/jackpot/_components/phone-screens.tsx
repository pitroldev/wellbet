"use client";

import Image from "next/image";
import { Cherry, Crown, Gem, Coins, Trophy, Wallet, Sparkles } from "lucide-react";
import { USERS } from "@/lib/avatars";
import { ProductWordmark } from "@/app/components/wellbet-logo";
import { Phone } from "./phone";
import { BulbRow } from "./marquee";
import { J, GRAD, brl0, odd } from "./tokens";

export function PhoneScreens() {
  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible">
      <div className="snap-center">
        <Phone label="Caça-níqueis">
          <SlotScreen />
        </Phone>
      </div>
      <div className="snap-center">
        <Phone label="Jackpot · roda">
          <JackpotScreen />
        </Phone>
      </div>
      <div className="snap-center">
        <Phone label="Mega Win">
          <MegaWinScreen />
        </Phone>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-between">
      <ProductWordmark brand="gym" size={18} tone="light" accent={J.magenta} />
      <span className="grid h-8 w-8 place-items-center rounded-full" style={{ background: J.surfaceUp }}>
        <Wallet size={15} color={J.gold} />
      </span>
    </div>
  );
}

function SlotScreen() {
  const reels = [
    { Icon: Cherry, c: J.pink },
    { Icon: Gem, c: J.green },
    { Icon: Crown, c: J.magenta },
  ];
  return (
    <div className="px-4 pb-8">
      <Header />

      <div className="mt-3 flex items-center justify-between rounded-2xl px-3 py-2" style={{ background: J.surfaceUp }}>
        <span className="text-[11px] font-bold uppercase" style={{ color: J.textMute }}>
          Banca
        </span>
        <span className="font-[family-name:var(--font-mono)] text-sm font-medium tabular-nums" style={{ color: J.green }}>
          {brl0(640)}
        </span>
      </div>

      {/* máquina */}
      <div
        className="relative mt-3 overflow-hidden rounded-3xl p-4"
        style={{ background: "linear-gradient(160deg,#3215AD,#190960)", boxShadow: "inset 0 0 0 1px " + J.line }}
      >
        <p
          className="text-center font-[family-name:var(--font-archivo)] text-sm font-black uppercase tracking-[0.2em]"
          style={{ color: J.gold }}
        >
          Jackpot 777
        </p>
        <div className="mt-3 flex justify-center gap-2">
          {reels.map((r, i) => (
            <div
              key={i}
              className="grid h-16 w-16 place-items-center rounded-xl"
              style={{ background: "rgba(10,4,48,.85)", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.14)" }}
            >
              <r.Icon size={30} color={r.c} style={{ filter: `drop-shadow(0 0 6px ${r.c}88)` }} />
            </div>
          ))}
        </div>
        <div className="mt-3">
          <BulbRow count={10} color={J.pink} glow={J.magenta} size={5} />
        </div>
      </div>

      <button
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-extrabold"
        style={{ background: J.magenta, color: "#fff", boxShadow: "0 0 18px -4px rgba(255,0,255,.8)" }}
      >
        <Coins size={15} /> Girar · {brl0(20)}
      </button>

      <div className="mt-3 rounded-2xl p-3" style={{ background: J.surface, boxShadow: "inset 0 0 0 1px " + J.line }}>
        <p className="text-xs font-bold" style={{ color: J.text }}>
          Último giro
        </p>
        <p className="mt-1 text-[11px]" style={{ color: J.textMute }}>
          Caiu 2 iguais · odd {odd(2.4)} · ganhou {brl0(48)}. Bora de novo?
        </p>
      </div>
    </div>
  );
}

function JackpotScreen() {
  return (
    <div className="px-4 pb-8">
      <Header />

      <div
        className="mt-3 overflow-hidden rounded-3xl p-5 text-center"
        style={{ background: "linear-gradient(160deg,#3215AD,#190960)", boxShadow: "inset 0 0 0 1px " + J.line }}
      >
        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: J.gold }}>
          <Crown size={12} /> Pote progressivo
        </span>
        <p
          className="mt-2 font-[family-name:var(--font-mono)] text-3xl font-medium tabular-nums"
          style={{ color: J.gold, textShadow: "0 0 18px rgba(255,212,94,.6)" }}
        >
          R$ 248.910
        </p>
        <div className="mt-3">
          <BulbRow count={11} color={J.gold} glow={J.goldDeep} size={5} />
        </div>
      </div>

      {/* roda */}
      <div className="mt-3 rounded-3xl p-4" style={{ background: J.surface, boxShadow: "inset 0 0 0 1px " + J.line }}>
        <p className="text-sm font-bold" style={{ color: J.text }}>
          Roda da fortuna
        </p>
        <div className="mt-3 grid place-items-center">
          <div
            className="grid h-28 w-28 place-items-center rounded-full"
            style={{
              background: `conic-gradient(${J.magenta} 0 60deg,${J.pink} 60deg 120deg,${J.gold} 120deg 180deg,${J.green} 180deg 240deg,${J.blueSoft} 240deg 300deg,${J.indigoSoft} 300deg 360deg)`,
              boxShadow: "0 0 0 4px rgba(255,212,94,.4)",
            }}
          >
            <span className="grid h-9 w-9 place-items-center rounded-full" style={{ background: J.magenta, boxShadow: "0 0 14px rgba(255,0,255,.8)" }}>
              <Sparkles size={16} color="#fff" />
            </span>
          </div>
        </div>
        <button
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-extrabold"
          style={{ background: J.pink, color: J.greenInk }}
        >
          1 giro grátis hoje
        </button>
      </div>
    </div>
  );
}

function MegaWinScreen() {
  const winners = USERS.slice(0, 4);
  return (
    <div className="px-4 pb-8">
      <Header />

      <div
        className="relative mt-3 overflow-hidden rounded-3xl p-5 text-center"
        style={{ background: GRAD.gymbet }}
      >
        <Trophy size={26} color={J.gold} style={{ filter: "drop-shadow(0 0 8px rgba(255,212,94,.7))" }} className="mx-auto" />
        <p
          className="mt-2 font-[family-name:var(--font-archivo)] text-3xl font-black uppercase leading-none"
          style={{ color: "#fff", textShadow: "0 0 18px rgba(255,128,225,.8)" }}
        >
          Mega Win!
        </p>
        <p className="mt-1 font-[family-name:var(--font-mono)] text-2xl font-medium tabular-nums" style={{ color: J.gold }}>
          + R$ 18.750
        </p>
        <button
          className="mt-3 inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-extrabold"
          style={{ background: J.gold, color: J.greenInk }}
        >
          <Coins size={15} /> Resgatar
        </button>
      </div>

      <div className="mt-3 rounded-3xl p-4" style={{ background: J.surface, boxShadow: "inset 0 0 0 1px " + J.line }}>
        <p className="text-sm font-bold" style={{ color: J.text }}>
          Ganhadores de hoje
        </p>
        <div className="mt-3 space-y-2">
          {winners.map((u, i) => (
            <div key={u.handle} className="flex items-center gap-3 rounded-2xl px-3 py-2" style={{ background: J.surfaceUp }}>
              <span className="relative h-9 w-9 overflow-hidden rounded-full" style={{ boxShadow: "0 0 0 2px rgba(255,128,225,.6)" }}>
                <Image src={u.avatar} alt={u.name} fill sizes="36px" className="object-cover" />
              </span>
              <span className="flex-1 truncate text-sm font-bold" style={{ color: J.text }}>
                {u.name.split(" ")[0]}
              </span>
              <span className="font-[family-name:var(--font-mono)] text-sm font-semibold tabular-nums" style={{ color: J.green }}>
                + {brl0(9200 - i * 1800)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
