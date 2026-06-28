"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, ArrowRight } from "lucide-react";
import Image from "next/image";
import { USERS } from "@/lib/avatars";
import { M, SPRING, brl0 } from "./tokens";

export function BaseComponents() {
  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between border-b pb-3" style={{ borderColor: M.hair }}>
        <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em]" style={{ color: M.inkMute }}>
          Os componentes
        </span>
        <span className="text-xs" style={{ color: M.inkMute }}>
          tudo clicável
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card title="Botões">
          <div className="flex flex-wrap gap-2.5">
            <Btn bg={M.indigo} fg="#fff">
              Apostar <ArrowRight size={15} />
            </Btn>
            <Btn bg={M.pink} fg={M.ink}>
              Bora? Bora!
            </Btn>
            <Btn bg={M.white} fg={M.ink} border>
              Ver cupom
            </Btn>
            <Btn bg={M.ink} fg="#fff">
              Cash out
            </Btn>
          </div>
        </Card>

        <Card title="Toggle & segmentado">
          <Toggle />
          <div className="mt-4">
            <Segmented />
          </div>
        </Card>

        <Card title="Stake · stepper">
          <Stepper />
        </Card>

        <Card title="Progresso & chips">
          <Progress />
          <div className="mt-4 flex flex-wrap gap-1.5">
            {["-2kg", "5km", "Sem açúcar", "8h sono"].map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        </Card>

        <Card title="Quem entrou na liga" full>
          <AvatarStack />
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children, full }: { title: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div
      className={"rounded-[6px] bg-white p-6 " + (full ? "sm:col-span-2" : "")}
      style={{ boxShadow: `inset 0 0 0 1px ${M.hair}` }}
    >
      <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.24em]" style={{ color: M.inkMute }}>
        {title}
      </span>
      <div className="mt-4">{children}</div>
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
      className="inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-sm font-bold"
      style={{
        background: bg,
        color: fg,
        boxShadow: border ? `inset 0 0 0 1.5px ${M.hair}` : "0 10px 22px -14px rgba(50,21,173,.55)",
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
        style={{ background: on ? M.indigo : M.line }}
      >
        <motion.span
          layout
          transition={SPRING}
          className="h-5 w-5 rounded-full bg-white shadow"
          style={{ marginLeft: on ? "auto" : 0 }}
        />
      </span>
      <span className="text-sm font-semibold" style={{ color: M.ink }}>
        Lembrete diário {on ? "ligado" : "desligado"}
      </span>
    </button>
  );
}

function Segmented() {
  const opts = ["Semana", "Mês", "Tudo"];
  const [i, setI] = useState(0);
  return (
    <div className="relative inline-flex rounded-full p-1" style={{ background: M.peri }}>
      {opts.map((o, idx) => (
        <button
          key={o}
          type="button"
          onClick={() => setI(idx)}
          className="relative z-10 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
          style={{ color: i === idx ? "#fff" : M.indigo }}
        >
          {i === idx && (
            <motion.span
              layoutId="seg-muma"
              transition={SPRING}
              className="absolute inset-0 -z-10 rounded-full"
              style={{ background: M.indigo }}
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
        style={{ background: M.paperMute, color: M.ink }}
        aria-label="Diminuir stake"
      >
        <Minus size={18} />
      </button>
      <div className="text-center">
        <motion.div
          key={v}
          initial={{ scale: 0.9, opacity: 0.4 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={SPRING}
          className="font-[family-name:var(--font-fraunces)] text-4xl tabular-nums"
          style={{ color: M.ink, fontVariationSettings: '"SOFT" 40,"WONK" 1,"opsz" 144', fontWeight: 500 }}
        >
          {brl0(v)}
        </motion.div>
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em]" style={{ color: M.inkMute }}>
          stake da semana
        </span>
      </div>
      <button
        type="button"
        onClick={() => setV((x) => Math.min(500, x + step))}
        className="grid h-11 w-11 place-items-center rounded-full"
        style={{ background: M.indigo, color: "#fff" }}
        aria-label="Aumentar stake"
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
      <div className="flex items-center justify-between text-xs font-semibold" style={{ color: M.inkSoft }}>
        <span>Meta da semana</span>
        <span className="font-[family-name:var(--font-mono)] tabular-nums" style={{ color: M.indigo }}>
          {Math.round(p)}%
        </span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full" style={{ background: M.paperMute }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${M.pink}, ${M.indigo})` }}
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
      className="rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors"
      style={{
        background: on ? M.indigo : M.white,
        color: on ? "#fff" : M.inkSoft,
        boxShadow: on ? "none" : `inset 0 0 0 1px ${M.hair}`,
      }}
    >
      {children}
    </button>
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
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...SPRING, delay: i * 0.05 }}
            whileHover={{ y: -4, zIndex: 10 }}
            className="relative inline-block h-11 w-11 overflow-hidden rounded-full ring-[3px] ring-white"
            style={{ background: M.paperMute }}
          >
            <Image src={u.avatar} alt={u.name} fill sizes="44px" className="object-cover" />
          </motion.span>
        ))}
      </div>
      <div>
        <p
          className="font-[family-name:var(--font-fraunces)] text-xl leading-none"
          style={{ color: M.ink, fontVariationSettings: '"SOFT" 50,"WONK" 1,"opsz" 144', fontWeight: 600 }}
        >
          +1.284 pessoas
        </p>
        <p className="mt-1 text-xs" style={{ color: M.inkMute }}>
          apostaram na própria mudança esta semana.
        </p>
      </div>
    </div>
  );
}
