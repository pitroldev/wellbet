"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Zap, Check } from "lucide-react";
import Image from "next/image";
import { USERS } from "@/lib/avatars";
import { B, BORDER, BORDER_THIN, shadow, TWEEN, brl } from "./tokens";
import { Block, BrutalButton, MonoLabel } from "./primitives";

export function BaseComponents() {
  return (
    <div>
      <MonoLabel style={{ color: B.ink }}>{"// COMPONENTES-BASE — TODOS CLICÁVEIS"}</MonoLabel>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <Card title="BOTÕES">
          <div className="flex flex-wrap gap-3">
            <BrutalButton bg={B.magenta} fg={B.onMagenta}>
              <Zap size={15} fill="currentColor" /> APOSTAR
            </BrutalButton>
            <BrutalButton bg={B.green} fg={B.onGreen}>
              DEU GREEN
            </BrutalButton>
            <BrutalButton bg={B.white} fg={B.ink}>
              COTAÇÕES
            </BrutalButton>
            <BrutalButton bg={B.ink} fg="#FFFFFF">
              CASH OUT
            </BrutalButton>
          </div>
        </Card>

        <Card title="TOGGLE & SEGMENTADO">
          <Toggle />
          <div className="mt-4">
            <Segmented />
          </div>
        </Card>

        <Card title="STAKE (STEPPER)">
          <Stepper />
        </Card>

        <Card title="PROGRESSO & CHIPS">
          <Progress />
          <div className="mt-3 flex flex-wrap gap-2">
            {["-2KG", "5KM", "SEM AÇÚCAR", "8H SONO"].map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        </Card>

        <Card title="QUEM ESTÁ DENTRO" full>
          <AvatarStack />
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children, full }: { title: string; children: React.ReactNode; full?: boolean }) {
  return (
    <Block bg={B.white} className={"p-4 " + (full ? "sm:col-span-2" : "")}>
      <MonoLabel style={{ color: B.ink, opacity: 0.6 }}>{title}</MonoLabel>
      <div className="mt-3">{children}</div>
    </Block>
  );
}

function Toggle() {
  const [on, setOn] = useState(true);
  return (
    <button type="button" onClick={() => setOn((v) => !v)} className="flex items-center gap-3 text-left" aria-pressed={on}>
      <span
        className="relative flex h-8 w-14 items-center p-1"
        style={{ background: on ? B.green : B.white, border: BORDER }}
      >
        <motion.span
          className="block h-5 w-5"
          style={{ background: B.ink }}
          animate={{ x: on ? 22 : 0 }}
          transition={TWEEN}
        />
      </span>
      <span className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-wide" style={{ color: B.ink }}>
        LEMBRETE {on ? "[ON]" : "[OFF]"}
      </span>
    </button>
  );
}

function Segmented() {
  const opts = ["SEMANA", "MÊS", "TUDO"];
  const [i, setI] = useState(0);
  return (
    <div className="inline-flex" style={{ border: BORDER, boxShadow: shadow(4) }}>
      {opts.map((o, idx) => (
        <button
          key={o}
          type="button"
          onClick={() => setI(idx)}
          className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-wide transition-none"
          style={{
            background: i === idx ? B.ink : B.white,
            color: i === idx ? B.green : B.ink,
            padding: "10px 14px",
            borderRight: idx < opts.length - 1 ? BORDER_THIN : "none",
            minHeight: 44,
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Stepper() {
  const [v, setV] = useState(50);
  return (
    <div className="flex items-center justify-between">
      <StepBtn onClick={() => setV((x) => Math.max(10, x - 10))} bg={B.white} fg={B.ink}>
        <Minus size={20} strokeWidth={3} />
      </StepBtn>
      <div className="text-center">
        <motion.div
          key={v}
          initial={{ y: -6, opacity: 0.4 }}
          animate={{ y: 0, opacity: 1 }}
          transition={TWEEN}
          className="font-[family-name:var(--font-mono)] text-3xl font-bold tabular-nums"
          style={{ color: B.ink }}
        >
          {brl(v)}
        </motion.div>
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider" style={{ color: B.ink, opacity: 0.55 }}>
          STAKE / SEMANA
        </span>
      </div>
      <StepBtn onClick={() => setV((x) => Math.min(500, x + 10))} bg={B.magenta} fg="#FFFFFF">
        <Plus size={20} strokeWidth={3} />
      </StepBtn>
    </div>
  );
}

function StepBtn({
  children,
  onClick,
  bg,
  fg,
}: {
  children: React.ReactNode;
  onClick: () => void;
  bg: string;
  fg: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={false}
      animate={{ x: 0, y: 0, boxShadow: shadow(4) }}
      whileTap={{ x: 4, y: 4, boxShadow: shadow(0) }}
      transition={TWEEN}
      className="grid h-12 w-12 place-items-center"
      style={{ background: bg, color: fg, border: BORDER }}
    >
      {children}
    </motion.button>
  );
}

function Progress() {
  const [p, setP] = useState(60);
  return (
    <button type="button" onClick={() => setP((x) => (x >= 100 ? 20 : Math.min(100, x + 20)))} className="block w-full text-left">
      <div className="flex items-center justify-between font-[family-name:var(--font-mono)] text-xs font-bold uppercase" style={{ color: B.ink }}>
        <span>META DA SEMANA</span>
        <span className="tabular-nums" style={{ color: B.ink }}>
          {Math.round(p)}%
        </span>
      </div>
      <div className="mt-2 h-5 overflow-hidden" style={{ background: B.white, border: BORDER }}>
        <motion.div className="h-full" style={{ background: B.magenta }} animate={{ width: `${p}%` }} transition={TWEEN} />
      </div>
      <p className="mt-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wide" style={{ color: B.ink, opacity: 0.5 }}>
        &gt; toque pra avançar
      </p>
    </button>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-wide"
      style={{
        background: on ? B.ink : B.white,
        color: on ? B.green : B.ink,
        border: BORDER_THIN,
        padding: "6px 10px",
        minHeight: 32,
      }}
    >
      {on && <Check size={11} strokeWidth={4} className="-mt-0.5 mr-1 inline" />}
      {children}
    </button>
  );
}

function AvatarStack() {
  const people = USERS.slice(0, 6);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex -space-x-2">
        {people.map((u, i) => (
          <motion.span
            key={u.handle}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ ...TWEEN, delay: i * 0.04 }}
            whileHover={{ y: -4 }}
            className="relative inline-block h-11 w-11 overflow-hidden"
            style={{ background: B.paper, border: BORDER_THIN, zIndex: people.length - i }}
          >
            <Image src={u.avatar} alt={u.name} fill sizes="44px" className="object-cover" style={{ filter: "grayscale(1) contrast(1.15)" }} />
          </motion.span>
        ))}
      </div>
      <div>
        <p className="font-[family-name:var(--font-archivo)] text-lg font-black uppercase tabular-nums" style={{ color: B.ink }}>
          +1.284 NA BRIGA
        </p>
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide" style={{ color: B.ink, opacity: 0.55 }}>
          apostaram em si esta semana
        </p>
      </div>
    </div>
  );
}
