"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Zap, Coins, Bell } from "lucide-react";
import Image from "next/image";
import { USERS } from "@/lib/avatars";
import { J, SPRING, GLOW_MAGENTA, brl } from "./tokens";

export function BaseComponents() {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.16em]" style={{ color: J.textMute }}>
        Componentes-base · todos clicáveis
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Botões">
          <div className="flex flex-wrap gap-2.5">
            <Btn bg={J.magenta} fg="#fff" glow>
              <Zap size={15} fill="#fff" /> Girar
            </Btn>
            <Btn bg={J.green} fg={J.greenInk}>
              <Coins size={15} /> Resgatar
            </Btn>
            <Btn bg="transparent" fg={J.text} border>
              Ver prêmios
            </Btn>
            <Btn bg={J.indigo} fg="#fff">
              <Bell size={14} /> Avisar
            </Btn>
          </div>
        </Card>

        <Card title="Toggle & segmentado">
          <Toggle />
          <div className="mt-3">
            <Segmented />
          </div>
        </Card>

        <Card title="Aposta (stepper)">
          <Stepper />
        </Card>

        <Card title="Progresso & chips">
          <Progress />
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["x2", "x10", "Free spin", "777"].map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
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
      style={{ background: J.surface, boxShadow: "inset 0 0 0 1px " + J.line }}
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: J.textMute }}>
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
  border,
  glow,
}: {
  children: React.ReactNode;
  bg: string;
  fg: string;
  border?: boolean;
  glow?: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -1 }}
      transition={SPRING}
      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold"
      style={{
        background: bg,
        color: fg,
        boxShadow: border
          ? "inset 0 0 0 1.5px " + J.line
          : glow
            ? GLOW_MAGENTA
            : "0 8px 18px -10px rgba(0,0,0,.6)",
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
        style={{ background: on ? J.magenta : J.surfaceUp, boxShadow: on ? "0 0 16px -2px rgba(255,0,255,.7)" : "none" }}
      >
        <motion.span
          layout
          transition={SPRING}
          className="h-5 w-5 rounded-full bg-white shadow"
          style={{ marginLeft: on ? "auto" : 0 }}
        />
      </span>
      <span className="text-sm font-semibold" style={{ color: J.text }}>
        Giro automático {on ? "ligado" : "desligado"}
      </span>
    </button>
  );
}

function Segmented() {
  const opts = ["Aposta", "Mesa", "Sala VIP"];
  const [i, setI] = useState(0);
  return (
    <div className="relative inline-flex rounded-full p-1" style={{ background: J.surfaceUp }}>
      {opts.map((o, idx) => (
        <button
          key={o}
          type="button"
          onClick={() => setI(idx)}
          className="relative z-10 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
          style={{ color: i === idx ? "#fff" : J.textSoft }}
        >
          {i === idx && (
            <motion.span
              layoutId="seg-jackpot"
              transition={SPRING}
              className="absolute inset-0 -z-10 rounded-full"
              style={{ background: J.magenta, boxShadow: "0 0 16px -2px rgba(255,0,255,.7)" }}
            />
          )}
          {o}
        </button>
      ))}
    </div>
  );
}

function Stepper() {
  const [v, setV] = useState(20);
  const step = 5;
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={() => setV((x) => Math.max(5, x - step))}
        className="grid h-11 w-11 place-items-center rounded-full"
        style={{ background: J.surfaceUp, color: J.text }}
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
          style={{ color: J.text }}
        >
          {brl(v)}
        </motion.div>
        <span className="text-[11px]" style={{ color: J.textMute }}>
          aposta por giro
        </span>
      </div>
      <button
        type="button"
        onClick={() => setV((x) => Math.min(200, x + step))}
        className="grid h-11 w-11 place-items-center rounded-full"
        style={{ background: J.magenta, color: "#fff", boxShadow: "0 0 16px -2px rgba(255,0,255,.7)" }}
      >
        <Plus size={18} />
      </button>
    </div>
  );
}

function Progress() {
  const [p, setP] = useState(58);
  return (
    <button
      type="button"
      onClick={() => setP((x) => (x >= 100 ? 20 : Math.min(100, x + 18)))}
      className="block w-full text-left"
    >
      <div className="flex items-center justify-between text-xs font-semibold" style={{ color: J.textSoft }}>
        <span>Barra do bônus</span>
        <span className="font-[family-name:var(--font-mono)] tabular-nums" style={{ color: J.green }}>
          {Math.round(p)}%
        </span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full" style={{ background: J.surfaceUp }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${J.magenta}, ${J.pink}, ${J.green})` }}
          animate={{ width: `${p}%` }}
          transition={SPRING}
        />
      </div>
    </button>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className="rounded-full px-3 py-1.5 text-xs font-bold transition-colors"
      style={{
        background: on ? J.magenta : J.surfaceUp,
        color: on ? "#fff" : J.textSoft,
        boxShadow: on ? "0 0 14px -2px rgba(255,0,255,.7)" : "none",
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
            style={{ background: J.surfaceUp, boxShadow: "0 0 0 3px #220C82, 0 0 0 4px rgba(255,128,225,.5)" }}
          >
            <Image src={u.avatar} alt={u.name} fill sizes="44px" className="object-cover" />
          </motion.span>
        ))}
      </div>
      <div>
        <p className="text-sm font-bold" style={{ color: J.text }}>
          +3.902 jogando
        </p>
        <p className="text-xs" style={{ color: J.textMute }}>
          girando agora no palácio
        </p>
      </div>
    </div>
  );
}
