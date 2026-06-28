"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Zap, Flame, Dumbbell } from "lucide-react";
import Image from "next/image";
import { USERS } from "@/lib/avatars";
import { G, SPRING, GRAD, brl } from "./tokens";

export function BaseComponents() {
  return (
    <div>
      <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: G.fogMute }}>
        Componentes-base · todos clicáveis
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Botões">
          <div className="flex flex-wrap gap-2.5">
            <Btn grad fg="#fff">
              <Zap size={15} fill="#fff" /> Apostar
            </Btn>
            <Btn bg={G.green} fg={G.greenInk}>
              <Flame size={15} fill={G.greenInk} /> Deu green
            </Btn>
            <Btn bg="transparent" fg={G.white} border>
              Ver ranking
            </Btn>
            <Btn bg={G.ink} fg={G.magenta}>
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
            {["Peito", "5km", "Sem falta", "PR novo"].map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        </Card>

        <Card title="Quem está na arena" full>
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
      style={{ background: G.navySoft, boxShadow: "inset 0 0 0 1px " + G.navyLine }}
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: G.fogMute }}>
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
  grad,
}: {
  children: React.ReactNode;
  bg?: string;
  fg: string;
  border?: boolean;
  grad?: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      whileHover={{ y: -2 }}
      transition={SPRING}
      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold"
      style={{
        background: grad ? GRAD.gymbet : bg,
        color: fg,
        boxShadow: border
          ? "inset 0 0 0 1.5px " + G.navyLine
          : grad
            ? "0 10px 24px -10px rgba(255,0,255,.7)"
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
        style={{ background: on ? G.magenta : G.navyLine, boxShadow: on ? "0 0 16px -2px rgba(255,0,255,.7)" : "none" }}
      >
        <motion.span layout transition={SPRING} className="h-5 w-5 rounded-full bg-white shadow" style={{ marginLeft: on ? "auto" : 0 }} />
      </span>
      <span className="text-sm font-semibold" style={{ color: G.white }}>
        Alerta de treino {on ? "ligado" : "desligado"}
      </span>
    </button>
  );
}

function Segmented() {
  const opts = ["Hoje", "Semana", "Tudo"];
  const [i, setI] = useState(1);
  return (
    <div className="relative inline-flex rounded-full p-1" style={{ background: G.ink }}>
      {opts.map((o, idx) => (
        <button
          key={o}
          type="button"
          onClick={() => setI(idx)}
          className="relative z-10 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
          style={{ color: i === idx ? "#fff" : G.fog }}
        >
          {i === idx && (
            <motion.span
              layoutId="seg-gymbet"
              transition={SPRING}
              className="absolute inset-0 -z-10 rounded-full"
              style={{ background: GRAD.gymbet }}
            />
          )}
          {o}
        </button>
      ))}
    </div>
  );
}

function Stepper() {
  const [v, setV] = useState(80);
  const step = 20;
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={() => setV((x) => Math.max(20, x - step))}
        className="grid h-11 w-11 place-items-center rounded-full"
        style={{ background: G.ink, color: G.white, boxShadow: "inset 0 0 0 1px " + G.navyLine }}
      >
        <Minus size={18} />
      </button>
      <div className="text-center">
        <motion.div
          key={v}
          initial={{ scale: 0.85, opacity: 0.4 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={SPRING}
          className="font-[family-name:var(--font-mono)] text-2xl font-medium tabular-nums"
          style={{ color: G.magenta }}
        >
          {brl(v)}
        </motion.div>
        <span className="text-[11px]" style={{ color: G.fogMute }}>
          stake da semana
        </span>
      </div>
      <button
        type="button"
        onClick={() => setV((x) => Math.min(500, x + step))}
        className="grid h-11 w-11 place-items-center rounded-full"
        style={{ background: G.magenta, color: "#fff", boxShadow: "0 0 18px -4px rgba(255,0,255,.8)" }}
      >
        <Plus size={18} />
      </button>
    </div>
  );
}

function Progress() {
  const [p, setP] = useState(60);
  return (
    <button type="button" onClick={() => setP((x) => (x >= 100 ? 20 : Math.min(100, x + 20)))} className="block w-full text-left">
      <div className="flex items-center justify-between text-xs font-semibold" style={{ color: G.fog }}>
        <span className="inline-flex items-center gap-1.5">
          <Dumbbell size={13} style={{ color: G.magenta }} /> Meta da semana
        </span>
        <span className="font-[family-name:var(--font-mono)] tabular-nums" style={{ color: G.green }}>
          {Math.round(p)}%
        </span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full" style={{ background: G.ink }}>
        <motion.div className="h-full rounded-full" style={{ background: GRAD.gymbet }} animate={{ width: `${p}%` }} transition={SPRING} />
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
        background: on ? G.magenta : G.ink,
        color: on ? "#fff" : G.fog,
        boxShadow: on ? "0 0 16px -4px rgba(255,0,255,.8)" : "inset 0 0 0 1px " + G.navyLine,
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
            className="relative inline-block h-11 w-11 overflow-hidden rounded-full ring-[3px]"
            style={{ background: G.ink, boxShadow: "0 0 0 3px " + G.navySoft }}
          >
            <Image src={u.avatar} alt={u.name} fill sizes="44px" className="object-cover" />
          </motion.span>
        ))}
      </div>
      <div>
        <p className="text-sm font-bold" style={{ color: G.white }}>
          +2.140 atletas
        </p>
        <p className="text-xs" style={{ color: G.fogMute }}>
          competindo pelo pote esta semana
        </p>
      </div>
    </div>
  );
}
