"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Zap } from "lucide-react";
import Image from "next/image";
import { USERS } from "@/lib/avatars";
import { W, SPRING, brl } from "./tokens";

export function BaseComponents() {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.16em]" style={{ color: W.inkMute }}>
        Componentes-base · todos clicáveis
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Botões">
          <div className="flex flex-wrap gap-2.5">
            <Btn bg={W.blue} fg="#fff">
              <Zap size={15} fill="#fff" /> Apostar
            </Btn>
            <Btn bg={W.green} fg={W.greenInk}>
              Deu green
            </Btn>
            <Btn bg={W.surface} fg={W.ink} border>
              Ver cotações
            </Btn>
            <Btn bg={W.ink} fg="#fff">
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

        <Card title="Progresso & chips">
          <Progress />
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["-2kg", "5km", "Sem açúcar", "8h sono"].map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        </Card>

        <Card title="Quem está dentro" full>
          <AvatarStack />
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children, full }: { title: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div
      className={"rounded-3xl p-5 ring-1 ring-inset " + (full ? "sm:col-span-2" : "")}
      style={{ background: W.surface, boxShadow: "inset 0 0 0 1px " + W.line }}
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: W.inkMute }}>
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
}: {
  children: React.ReactNode;
  bg: string;
  fg: string;
  border?: boolean;
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
        boxShadow: border ? "inset 0 0 0 1.5px " + W.line : "0 8px 18px -10px rgba(8,22,30,.4)",
      }}
    >
      {children}
    </motion.button>
  );
}

function Toggle() {
  const [on, setOn] = useState(true);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className="flex items-center gap-3"
      aria-pressed={on}
    >
      <span
        className="relative flex h-7 w-12 items-center rounded-full p-1 transition-colors"
        style={{ background: on ? W.green : W.line }}
      >
        <motion.span
          layout
          transition={SPRING}
          className="h-5 w-5 rounded-full bg-white shadow"
          style={{ marginLeft: on ? "auto" : 0 }}
        />
      </span>
      <span className="text-sm font-semibold" style={{ color: W.ink }}>
        Lembrete diário {on ? "ligado" : "desligado"}
      </span>
    </button>
  );
}

function Segmented() {
  const opts = ["Semana", "Mês", "Tudo"];
  const [i, setI] = useState(0);
  return (
    <div className="relative inline-flex rounded-full p-1" style={{ background: W.surfaceMute }}>
      {opts.map((o, idx) => (
        <button
          key={o}
          type="button"
          onClick={() => setI(idx)}
          className="relative z-10 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
          style={{ color: i === idx ? "#fff" : W.inkSoft }}
        >
          {i === idx && (
            <motion.span
              layoutId="seg-clean"
              transition={SPRING}
              className="absolute inset-0 -z-10 rounded-full"
              style={{ background: W.blue }}
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
        style={{ background: W.surfaceMute, color: W.ink }}
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
          style={{ color: W.ink }}
        >
          {brl(v)}
        </motion.div>
        <span className="text-[11px]" style={{ color: W.inkMute }}>
          stake da semana
        </span>
      </div>
      <button
        type="button"
        onClick={() => setV((x) => Math.min(500, x + step))}
        className="grid h-11 w-11 place-items-center rounded-full"
        style={{ background: W.blue, color: "#fff" }}
      >
        <Plus size={18} />
      </button>
    </div>
  );
}

function Progress() {
  const [p, setP] = useState(64);
  return (
    <button type="button" onClick={() => setP((x) => (x >= 100 ? 20 : Math.min(100, x + 18)))} className="block w-full text-left">
      <div className="flex items-center justify-between text-xs font-semibold" style={{ color: W.inkSoft }}>
        <span>Meta da semana</span>
        <span className="font-[family-name:var(--font-mono)] tabular-nums" style={{ color: W.greenDeep }}>
          {Math.round(p)}%
        </span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full" style={{ background: W.surfaceMute }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${W.blue}, ${W.green})` }}
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
        background: on ? W.ink : W.surfaceMute,
        color: on ? "#fff" : W.inkSoft,
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
            className="relative inline-block h-11 w-11 overflow-hidden rounded-full ring-[3px] ring-white"
            style={{ background: W.surfaceMute }}
          >
            <Image src={u.avatar} alt={u.name} fill sizes="44px" className="object-cover" />
          </motion.span>
        ))}
      </div>
      <div>
        <p className="text-sm font-bold" style={{ color: W.ink }}>
          +1.284 pessoas
        </p>
        <p className="text-xs" style={{ color: W.inkMute }}>
          apostaram em si esta semana
        </p>
      </div>
    </div>
  );
}
