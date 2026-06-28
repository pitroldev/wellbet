"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Zap } from "lucide-react";
import Image from "next/image";
import { USERS } from "@/lib/avatars";
import { BoltMark } from "@/app/components/wellbet-logo";
import { V, GRAD, SPRING, brl } from "./tokens";

export function BaseComponents() {
  return (
    <div>
      <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: V.inkFaint }}>
        Componentes-base · todos clicáveis
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Botões">
          <div className="flex flex-wrap gap-2.5">
            <GradBtn>
              <Zap size={15} fill={V.greenInk} /> Carregar
            </GradBtn>
            <Btn bg={V.glassUp} fg={V.white} ring>
              Ver cotações
            </Btn>
            <Btn bg={V.green} fg={V.greenInk}>
              Deu green
            </Btn>
            <Btn bg="rgba(255,255,255,.06)" fg={V.inkSoft} ring>
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

        <Card title="Carga & chips">
          <Charge />
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["-2kg", "5km", "Sem açúcar", "8h sono"].map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        </Card>

        <Card title="Quem está carregando" full>
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
      style={{ background: V.glass, backdropFilter: "blur(14px)", boxShadow: `inset 0 0 0 1px ${V.glassLine}` }}
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: V.inkFaint }}>
        {title}
      </span>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function GradBtn({ children }: { children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -1 }}
      transition={SPRING}
      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-extrabold"
      style={{ background: GRAD.bolt, color: V.greenInk, boxShadow: "0 10px 26px -12px rgba(57,69,255,.8)" }}
    >
      {children}
    </motion.button>
  );
}

function Btn({ children, bg, fg, ring }: { children: React.ReactNode; bg: string; fg: string; ring?: boolean }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -1 }}
      transition={SPRING}
      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold"
      style={{ background: bg, color: fg, boxShadow: ring ? `inset 0 0 0 1px ${V.glassLineUp}` : "none" }}
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
        style={{ background: on ? GRAD.bolt : "rgba(255,255,255,.12)" }}
      >
        <motion.span layout transition={SPRING} className="h-5 w-5 rounded-full bg-white shadow" style={{ marginLeft: on ? "auto" : 0 }} />
      </span>
      <span className="text-sm font-semibold" style={{ color: V.white }}>
        Lembrete de carga {on ? "ligado" : "desligado"}
      </span>
    </button>
  );
}

function Segmented() {
  const opts = ["Semana", "Mês", "Tudo"];
  const [i, setI] = useState(0);
  return (
    <div className="relative inline-flex rounded-full p-1" style={{ background: "rgba(255,255,255,.06)" }}>
      {opts.map((o, idx) => (
        <button
          key={o}
          type="button"
          onClick={() => setI(idx)}
          className="relative z-10 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
          style={{ color: i === idx ? V.greenInk : V.inkSoft }}
        >
          {i === idx && (
            <motion.span
              layoutId="seg-voltage"
              transition={SPRING}
              className="absolute inset-0 -z-10 rounded-full"
              style={{ background: GRAD.bolt }}
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
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={() => setV((x) => Math.max(10, x - 10))}
        className="grid h-11 w-11 place-items-center rounded-full"
        style={{ background: "rgba(255,255,255,.08)", color: V.white, boxShadow: `inset 0 0 0 1px ${V.glassLine}` }}
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
          style={{ color: V.green }}
        >
          {brl(v)}
        </motion.div>
        <span className="text-[11px]" style={{ color: V.inkFaint }}>
          stake da semana
        </span>
      </div>
      <button
        type="button"
        onClick={() => setV((x) => Math.min(500, x + 10))}
        className="grid h-11 w-11 place-items-center rounded-full"
        style={{ background: GRAD.bolt, color: V.greenInk }}
      >
        <Plus size={18} />
      </button>
    </div>
  );
}

function Charge() {
  const [p, setP] = useState(64);
  return (
    <button type="button" onClick={() => setP((x) => (x >= 100 ? 20 : Math.min(100, x + 18)))} className="block w-full text-left">
      <div className="flex items-center justify-between text-xs font-semibold" style={{ color: V.inkSoft }}>
        <span className="inline-flex items-center gap-1">
          <BoltMark style={{ height: 11, width: "auto", color: V.green }} /> Carga da semana
        </span>
        <span className="font-[family-name:var(--font-mono)] tabular-nums" style={{ color: V.green }}>
          {Math.round(p)}%
        </span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,.08)" }}>
        <motion.div className="h-full rounded-full" style={{ background: GRAD.flow }} animate={{ width: `${p}%` }} transition={SPRING} />
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
        background: on ? V.green : "rgba(255,255,255,.06)",
        color: on ? V.greenInk : V.inkSoft,
        boxShadow: on ? "none" : `inset 0 0 0 1px ${V.glassLine}`,
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
            style={{ boxShadow: `0 0 0 2px ${V.ground}, 0 0 0 3.5px rgba(65,255,202,.5)` }}
          >
            <Image src={u.avatar} alt={u.name} fill sizes="44px" className="object-cover" />
          </motion.span>
        ))}
      </div>
      <div>
        <p className="text-sm font-bold" style={{ color: V.white }}>
          +1.284 pessoas
        </p>
        <p className="text-xs" style={{ color: V.inkFaint }}>
          carregando a disciplina esta semana
        </p>
      </div>
    </div>
  );
}
