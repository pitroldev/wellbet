"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Zap, Coins, Spade } from "lucide-react";
import Image from "next/image";
import { USERS } from "@/lib/avatars";
import { N, SPRING, brl, neonBox } from "./tokens";
import { Chip } from "./primitives";

export function BaseComponents() {
  return (
    <div>
      <h3
        className="mb-4 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-[0.24em]"
        style={{ color: N.mute }}
      >
        Componentes-base · todos clicáveis
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Botões">
          <div className="flex flex-wrap gap-2.5">
            <Btn bg={N.green} fg={N.greenInk} glow={N.green}>
              <Coins size={15} /> Apostar
            </Btn>
            <Btn bg={N.magenta} fg="#fff" glow={N.magenta}>
              <Zap size={15} fill="#fff" /> Girar
            </Btn>
            <Btn outline>
              <Spade size={14} fill={N.white} /> Distribuir
            </Btn>
            <Btn bg={N.blue} fg="#fff" glow={N.blue}>
              Cash out
            </Btn>
          </div>
        </Card>

        <Card title="Toggle & segmentado">
          <Toggle />
          <div className="mt-3">
            <Segmented />
          </div>
        </Card>

        <Card title="Stake (stepper)">
          <Stepper />
        </Card>

        <Card title="Progresso & fichas">
          <Progress />
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Roleta", "Blackjack", "Dados", "Slot"].map((c) => (
              <ChipTag key={c}>{c}</ChipTag>
            ))}
          </div>
        </Card>

        <Card title="Fichas · denominações" full>
          <div className="flex items-center gap-3">
            <Chip value={5} ring={N.blue} />
            <Chip value={25} ring={N.magenta} />
            <Chip value={100} ring={N.green} face={N.panel} />
            <Chip value="500" ring={N.pink} size={62} />
          </div>
        </Card>

        <Card title="Quem está na mesa" full>
          <AvatarStack />
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children, full }: { title: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div
      className={"rounded-3xl p-5 " + (full ? "sm:col-span-2" : "")}
      style={{
        background: `linear-gradient(180deg, ${N.panel}, ${N.ground})`,
        border: `1px solid ${N.line}`,
      }}
    >
      <span
        className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.18em]"
        style={{ color: N.mute }}
      >
        {title}
      </span>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Btn({
  children,
  bg,
  fg,
  glow,
  outline,
}: {
  children: React.ReactNode;
  bg?: string;
  fg?: string;
  glow?: string;
  outline?: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -1 }}
      transition={SPRING}
      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold"
      style={{
        background: outline ? "transparent" : bg,
        color: outline ? N.white : fg,
        boxShadow: outline
          ? `inset 0 0 0 1.5px ${N.line}`
          : glow
            ? neonBox(glow, 0.6)
            : "0 8px 18px -10px rgba(0,0,0,.7)",
      }}
    >
      {children}
    </motion.button>
  );
}

function Toggle() {
  const [on, setOn] = useState(true);
  return (
    <button type="button" onClick={() => setOn((v) => !v)} className="flex items-center gap-3" aria-pressed={on}>
      <span
        className="relative flex h-7 w-12 items-center rounded-full p-1 transition-colors"
        style={{
          background: on ? N.green : N.panelSoft,
          boxShadow: on ? `0 0 14px ${N.green}77` : "none",
        }}
      >
        <motion.span
          layout
          transition={SPRING}
          className="h-5 w-5 rounded-full"
          style={{ marginLeft: on ? "auto" : 0, background: on ? N.greenInk : N.white }}
        />
      </span>
      <span className="text-sm font-semibold" style={{ color: N.white }}>
        Cash out automático {on ? "ligado" : "desligado"}
      </span>
    </button>
  );
}

function Segmented() {
  const opts = ["Mesa", "Ao vivo", "Tudo"];
  const [i, setI] = useState(0);
  return (
    <div className="relative inline-flex rounded-full p-1" style={{ background: N.panelSoft }}>
      {opts.map((o, idx) => (
        <button
          key={o}
          type="button"
          onClick={() => setI(idx)}
          className="relative z-10 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
          style={{ color: i === idx ? "#fff" : N.mute }}
        >
          {i === idx && (
            <motion.span
              layoutId="seg-cassino"
              transition={SPRING}
              className="absolute inset-0 -z-10 rounded-full"
              style={{ background: N.magenta, boxShadow: `0 0 16px ${N.magenta}88` }}
            />
          )}
          {o}
        </button>
      ))}
    </div>
  );
}

function Stepper() {
  const [v, setV] = useState(50);
  const step = 10;
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={() => setV((x) => Math.max(10, x - step))}
        className="grid h-11 w-11 place-items-center rounded-full"
        style={{ background: N.panelSoft, color: N.white }}
      >
        <Minus size={18} />
      </button>
      <div className="text-center">
        <motion.div
          key={v}
          initial={{ scale: 0.9, opacity: 0.4 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={SPRING}
          className="font-[family-name:var(--font-mono)] text-2xl font-medium tabular-nums"
          style={{ color: N.green }}
        >
          {brl(v)}
        </motion.div>
        <span className="text-[11px]" style={{ color: N.mute }}>
          stake da rodada
        </span>
      </div>
      <button
        type="button"
        onClick={() => setV((x) => Math.min(500, x + step))}
        className="grid h-11 w-11 place-items-center rounded-full"
        style={{ background: N.green, color: N.greenInk, boxShadow: `0 0 14px ${N.green}66` }}
      >
        <Plus size={18} />
      </button>
    </div>
  );
}

function Progress() {
  const [p, setP] = useState(64);
  return (
    <button
      type="button"
      onClick={() => setP((x) => (x >= 100 ? 20 : Math.min(100, x + 18)))}
      className="block w-full text-left"
    >
      <div className="flex items-center justify-between text-xs font-semibold" style={{ color: N.mute }}>
        <span>Rumo ao jackpot</span>
        <span className="font-[family-name:var(--font-mono)] tabular-nums" style={{ color: N.green }}>
          {Math.round(p)}%
        </span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full" style={{ background: N.panelSoft }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${N.magenta}, ${N.green})`, boxShadow: `0 0 12px ${N.green}66` }}
          animate={{ width: `${p}%` }}
          transition={SPRING}
        />
      </div>
    </button>
  );
}

function ChipTag({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className="rounded-full px-3 py-1.5 text-xs font-bold transition-colors"
      style={{
        background: on ? N.magenta : N.panelSoft,
        color: on ? "#fff" : N.mute,
        boxShadow: on ? `0 0 14px ${N.magenta}77` : "none",
      }}
    >
      {children}
    </button>
  );
}

function AvatarStack() {
  const people = USERS.slice(0, 6);
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-3">
        {people.map((u, i) => (
          <motion.span
            key={u.handle}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...SPRING, delay: i * 0.05 }}
            whileHover={{ y: -4, zIndex: 10 }}
            className="relative inline-block h-11 w-11 overflow-hidden rounded-full"
            style={{ background: N.panelSoft, boxShadow: `0 0 0 3px ${N.ground}, 0 0 0 4px ${N.magenta}55` }}
          >
            <Image src={u.avatar} alt={u.name} fill sizes="44px" className="object-cover" />
          </motion.span>
        ))}
      </div>
      <div>
        <p className="text-sm font-bold" style={{ color: N.white }}>
          +2.041 na mesa
        </p>
        <p className="text-xs" style={{ color: N.mute }}>
          apostando ao vivo agora
        </p>
      </div>
    </div>
  );
}
