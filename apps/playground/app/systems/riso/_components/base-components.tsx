"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Zap, Check } from "lucide-react";
import Image from "next/image";
import { USERS } from "@/lib/avatars";
import { R, brl, halftone, PRINT_SHADOW, SETTLE, STAMP_SPRING } from "./tokens";

export function BaseComponents() {
  return (
    <div>
      <h3
        className="mb-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.22em]"
        style={{ color: R.ink }}
      >
        [ componentes ] · tudo clicável
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <Card title="botões">
          <div className="flex flex-wrap gap-2.5">
            <Btn bg={R.blue} fg="#fff">
              <Zap size={15} fill="#fff" /> Apostar
            </Btn>
            <Btn bg={R.green} fg={R.greenInk}>
              <Check size={15} strokeWidth={3} /> Deu green
            </Btn>
            <Btn bg={R.paper} fg={R.ink}>
              Ver odds
            </Btn>
            <Btn bg={R.magenta} fg="#fff">
              Cash out
            </Btn>
          </div>
        </Card>

        <Card title="toggle & segmentado">
          <Toggle />
          <div className="mt-4">
            <Segmented />
          </div>
        </Card>

        <Card title="stake · stepper">
          <Stepper />
        </Card>

        <Card title="progresso & chips">
          <Progress />
          <div className="mt-3 flex flex-wrap gap-2">
            {["-2kg", "5km", "Sem açúcar", "8h sono"].map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        </Card>

        <Card title="quem tá na edição" full>
          <AvatarStack />
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children, full }: { title: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div
      className={"relative overflow-hidden p-5 " + (full ? "sm:col-span-2 " : "")}
      style={{ background: R.paper, border: `2.5px solid ${R.ink}`, boxShadow: PRINT_SHADOW }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full"
        style={{ ...halftone(R.blue, 6, 0.4), mixBlendMode: "multiply", opacity: 0.5 }}
      />
      <span className="relative font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em]" style={{ color: R.ink }}>
        {title}
      </span>
      <div className="relative mt-3">{children}</div>
    </div>
  );
}

function Btn({
  children,
  bg,
  fg,
}: {
  children: React.ReactNode;
  bg: string;
  fg: string;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94, x: 2, y: 2 }}
      transition={STAMP_SPRING}
      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-extrabold uppercase"
      style={{
        background: bg,
        color: fg,
        border: `2.5px solid ${R.ink}`,
        boxShadow: "3px 3px 0 0 " + R.ink,
        fontFamily: "var(--font-archivo)",
        letterSpacing: "-0.01em",
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
        className="relative flex h-8 w-14 items-center p-1"
        style={{ background: on ? R.green : R.paperDeep, border: `2.5px solid ${R.ink}` }}
      >
        <motion.span
          layout
          transition={SETTLE}
          className="h-5 w-5"
          style={{ background: R.ink, marginLeft: on ? "auto" : 0 }}
        />
      </span>
      <span className="text-sm font-bold" style={{ color: R.ink }}>
        Lembrete diário {on ? "ligado" : "desligado"}
      </span>
    </button>
  );
}

function Segmented() {
  const opts = ["Semana", "Mês", "Tudo"];
  const [i, setI] = useState(0);
  return (
    <div
      className="relative inline-flex p-1"
      style={{ background: R.paperDeep, border: `2.5px solid ${R.ink}` }}
    >
      {opts.map((o, idx) => (
        <button
          key={o}
          type="button"
          onClick={() => setI(idx)}
          className="relative z-10 px-4 py-1.5 text-sm font-extrabold uppercase"
          style={{ color: i === idx ? "#fff" : R.ink, fontFamily: "var(--font-archivo)" }}
        >
          {i === idx && (
            <motion.span
              layoutId="riso-seg"
              transition={SETTLE}
              className="absolute inset-0 -z-10"
              style={{ background: R.magenta }}
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
      <StepBtn onClick={() => setV((x) => Math.max(10, x - step))} bg={R.paperDeep}>
        <Minus size={18} strokeWidth={3} />
      </StepBtn>
      <div className="text-center">
        <motion.div
          key={v}
          initial={{ scale: 0.85, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={STAMP_SPRING}
          className="font-[family-name:var(--font-mono)] text-2xl font-medium tabular-nums"
          style={{ color: R.ink }}
        >
          {brl(v)}
        </motion.div>
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider" style={{ color: R.ink }}>
          stake da semana
        </span>
      </div>
      <StepBtn onClick={() => setV((x) => Math.min(500, x + step))} bg={R.blue} fg="#fff">
        <Plus size={18} strokeWidth={3} />
      </StepBtn>
    </div>
  );
}

function StepBtn({
  children,
  onClick,
  bg,
  fg = R.ink,
}: {
  children: React.ReactNode;
  onClick: () => void;
  bg: string;
  fg?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.9, x: 2, y: 2 }}
      transition={STAMP_SPRING}
      className="grid h-11 w-11 place-items-center"
      style={{ background: bg, color: fg, border: `2.5px solid ${R.ink}`, boxShadow: "3px 3px 0 0 " + R.ink }}
    >
      {children}
    </motion.button>
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
      <div className="flex items-center justify-between font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider" style={{ color: R.ink }}>
        <span>Meta da semana</span>
        <span className="tabular-nums" style={{ color: R.magenta }}>
          {Math.round(p)}%
        </span>
      </div>
      <div className="relative mt-2 h-4 overflow-hidden" style={{ background: R.paperDeep, border: `2.5px solid ${R.ink}` }}>
        <motion.div
          className="relative h-full"
          style={{ background: R.green }}
          animate={{ width: `${p}%` }}
          transition={SETTLE}
        >
          <span aria-hidden className="absolute inset-0" style={{ ...halftone(R.ink, 5, 0.42), mixBlendMode: "multiply", opacity: 0.55 }} />
        </motion.div>
      </div>
    </button>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  return (
    <motion.button
      type="button"
      onClick={() => setOn((v) => !v)}
      whileTap={{ scale: 0.93 }}
      transition={STAMP_SPRING}
      className="px-3 py-1.5 text-xs font-extrabold uppercase"
      style={{
        background: on ? R.ink : R.paper,
        color: on ? R.paper : R.ink,
        border: `2.5px solid ${R.ink}`,
        fontFamily: "var(--font-archivo)",
      }}
    >
      {children}
    </motion.button>
  );
}

function AvatarStack() {
  const people = USERS.slice(0, 6);
  return (
    <div className="flex items-center gap-4">
      <div className="flex -space-x-3">
        {people.map((u, i) => (
          <motion.span
            key={u.handle}
            initial={{ opacity: 0, x: -8, rotate: 0 }}
            animate={{ opacity: 1, x: 0, rotate: (i % 2 ? 1 : -1) * 4 }}
            whileHover={{ y: -5, rotate: 0, zIndex: 10 }}
            transition={{ ...SETTLE, delay: i * 0.05 }}
            className="relative inline-block h-12 w-12 overflow-hidden"
            style={{ background: R.paperDeep, border: `2.5px solid ${R.ink}` }}
          >
            <Image src={u.avatar} alt={u.name} fill sizes="48px" className="object-cover" style={{ filter: "grayscale(1) contrast(1.15)", mixBlendMode: "multiply" }} />
            <span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: R.magenta, mixBlendMode: "screen", opacity: 0.22 }} />
          </motion.span>
        ))}
      </div>
      <div>
        <p className="font-[family-name:var(--font-archivo)] text-lg font-extrabold uppercase leading-none" style={{ color: R.ink }}>
          +1.284 na tiragem
        </p>
        <p className="font-[family-name:var(--font-mono)] text-[11px]" style={{ color: R.ink }}>
          apostaram em si esta semana
        </p>
      </div>
    </div>
  );
}
