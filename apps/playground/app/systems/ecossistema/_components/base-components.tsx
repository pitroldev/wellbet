"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import { USERS } from "@/lib/avatars";
import { E, GLASS, GLASS_STRONG, GLASS_LINE, SPRING, brl } from "./tokens";
import { useProduct } from "./product-context";

export function BaseComponents() {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.16em]" style={{ color: E.peri }}>
        Componentes-base · todos clicáveis
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Botões">
          <Buttons />
        </Card>

        <Card title="Toggle & segmentado">
          <SwitchRow />
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
            {["-2kg", "5 treinos", "Sem açúcar", "8h sono", "10k passos"].map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        </Card>

        <Card title="Quem está no ecossistema" full>
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
      style={{ background: GLASS, boxShadow: "inset 0 0 0 1px " + GLASS_LINE }}
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: E.peri, opacity: 0.7 }}>
        {title}
      </span>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Buttons() {
  const { theme } = useProduct();
  return (
    <div className="flex flex-wrap gap-2.5">
      <Btn bg={theme.accent} fg="#fff">
        <Sparkles size={15} /> Entrar
      </Btn>
      <Btn bg={E.green} fg={E.greenInk}>
        Deu green
      </Btn>
      <Btn bg="transparent" fg="#fff" border>
        Saber mais
      </Btn>
      <Btn bg="#fff" fg={E.field}>
        Conheça <ArrowRight size={14} />
      </Btn>
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
        boxShadow: border ? "inset 0 0 0 1.5px " + GLASS_LINE : "0 10px 22px -12px rgba(8,4,40,.8)",
      }}
    >
      {children}
    </motion.button>
  );
}

function SwitchRow() {
  const { theme } = useProduct();
  const [on, setOn] = useState(true);
  return (
    <button type="button" onClick={() => setOn((v) => !v)} className="flex items-center gap-3" aria-pressed={on}>
      <span
        className="relative flex h-7 w-12 items-center rounded-full p-1 transition-colors"
        style={{ background: on ? theme.accent : "rgba(204,209,255,.22)" }}
      >
        <motion.span
          layout
          transition={SPRING}
          className="h-5 w-5 rounded-full bg-white shadow"
          style={{ marginLeft: on ? "auto" : 0 }}
        />
      </span>
      <span className="text-sm font-semibold text-white">
        Lembrete diário {on ? "ligado" : "desligado"}
      </span>
    </button>
  );
}

function Segmented() {
  const { theme } = useProduct();
  const opts = ["Semana", "Mês", "Tudo"];
  const [i, setI] = useState(0);
  return (
    <div className="relative inline-flex rounded-full p-1" style={{ background: GLASS_STRONG }}>
      {opts.map((o, idx) => (
        <button
          key={o}
          type="button"
          onClick={() => setI(idx)}
          className="relative z-10 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
          style={{ color: i === idx ? "#fff" : "rgba(255,255,255,.6)" }}
        >
          {i === idx && (
            <motion.span
              layoutId="seg-eco"
              transition={SPRING}
              className="absolute inset-0 -z-10 rounded-full"
              style={{ background: theme.accent }}
            />
          )}
          {o}
        </button>
      ))}
    </div>
  );
}

function Stepper() {
  const { theme } = useProduct();
  const [v, setV] = useState(80);
  const step = 10;
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={() => setV((x) => Math.max(10, x - step))}
        className="grid h-11 w-11 place-items-center rounded-full"
        style={{ background: GLASS_STRONG, color: "#fff" }}
      >
        <Minus size={18} />
      </button>
      <div className="text-center">
        <motion.div
          key={v}
          initial={{ scale: 0.9, opacity: 0.4 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={SPRING}
          className="font-[family-name:var(--font-mono)] text-2xl font-medium tabular-nums text-white"
        >
          {brl(v)}
        </motion.div>
        <span className="text-[11px]" style={{ color: E.peri, opacity: 0.7 }}>
          stake da semana
        </span>
      </div>
      <button
        type="button"
        onClick={() => setV((x) => Math.min(500, x + step))}
        className="grid h-11 w-11 place-items-center rounded-full"
        style={{ background: theme.accent, color: "#fff" }}
      >
        <Plus size={18} />
      </button>
    </div>
  );
}

function Progress() {
  const { theme } = useProduct();
  const [p, setP] = useState(58);
  return (
    <button
      type="button"
      onClick={() => setP((x) => (x >= 100 ? 20 : Math.min(100, x + 18)))}
      className="block w-full text-left"
    >
      <div className="flex items-center justify-between text-xs font-semibold" style={{ color: E.peri }}>
        <span>Meta da semana</span>
        <span className="font-[family-name:var(--font-mono)] tabular-nums" style={{ color: E.green }}>
          {Math.round(p)}%
        </span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full" style={{ background: "rgba(8,4,40,.45)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${theme.accent}, ${E.green})` }}
          animate={{ width: `${p}%` }}
          transition={SPRING}
        />
      </div>
    </button>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  const { theme } = useProduct();
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className="rounded-full px-3 py-1.5 text-xs font-bold transition-colors"
      style={{
        background: on ? theme.accent : GLASS_STRONG,
        color: on ? "#fff" : "rgba(255,255,255,.7)",
      }}
    >
      {children}
    </button>
  );
}

function AvatarStack() {
  const people = USERS.slice(0, 7);
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
            style={{ background: GLASS_STRONG, "--tw-ring-color": E.field } as React.CSSProperties}
          >
            <Image src={u.avatar} alt={u.name} fill sizes="44px" className="object-cover" />
          </motion.span>
        ))}
      </div>
      <div>
        <p className="text-sm font-bold text-white">+8.420 pessoas</p>
        <p className="text-xs" style={{ color: E.peri, opacity: 0.7 }}>
          num só ecossistema de transformação
        </p>
      </div>
    </div>
  );
}
