"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Activity, Dumbbell, ArrowRight, Sparkles, Crown, Wallet, Flame } from "lucide-react";
import { USERS } from "@/lib/avatars";
import { WellbetCoLogo, ProductWordmark, BoltMark } from "@/app/components/wellbet-logo";
import { Phone } from "./phone";
import { LiquidM } from "./liquid-m";
import { PRODUCT, type Product } from "./tokens";
import { E, GLASS, GLASS_STRONG, GLASS_LINE, SPRING, GRADIENT, brl, odd } from "./tokens";

export function PhoneScreens() {
  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible">
      <div className="snap-center">
        <Phone label="Site masterbrand">
          <SiteScreen />
        </Phone>
      </div>
      <div className="snap-center">
        <Phone label="App unificado">
          <AppScreen />
        </Phone>
      </div>
      <div className="snap-center">
        <Phone label="Ranking · liga">
          <RankScreen />
        </Phone>
      </div>
    </div>
  );
}

/* ---------- 1. Site masterbrand ---------- */
function SiteScreen() {
  return (
    <div className="px-4 pb-8" style={{ background: E.field, minHeight: "100%" }}>
      <div className="flex items-center justify-between pt-1">
        <WellbetCoLogo size={26} tone="light" />
      </div>

      <div className="relative mt-6 grid place-items-center">
        <LiquidM size={150} gradient={GRADIENT.muma} />
      </div>

      <h1
        className="mt-5 text-center leading-[1.0] tracking-[-0.02em] text-white"
        style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.9rem", fontVariationSettings: '"SOFT" 60,"WONK" 1,"opsz" 144' }}
      >
        Mudanças reais acontecem quando existe algo em jogo.
      </h1>
      <p className="mt-3 text-center text-sm" style={{ color: E.peri }}>
        Conheça nosso ecossistema.
      </p>

      <div className="mt-5 space-y-3">
        <ProductCard id="well" />
        <ProductCard id="gym" />
      </div>

      <button
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-extrabold"
        style={{ color: E.field }}
      >
        Começar agora <ArrowRight size={16} />
      </button>
      <p className="mt-3 text-center text-[11px]" style={{ color: E.peri, opacity: 0.6 }}>
        wellbet &amp; Co.® · uma engenharia, dois mundos.
      </p>
    </div>
  );
}

function ProductCard({ id }: { id: Product }) {
  const p = PRODUCT[id];
  const Icon = id === "well" ? Activity : Dumbbell;
  return (
    <div className="rounded-3xl p-4" style={{ background: p.gradient }}>
      <div className="flex items-center justify-between">
        <ProductWordmark brand={id} size={22} tone="light" accent="#fff" />
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20">
          <Icon size={17} color="#fff" />
        </span>
      </div>
      <p className="mt-2 text-sm font-bold text-white">{p.promise}</p>
      <p className="mt-0.5 text-xs text-white/75">{p.world}</p>
    </div>
  );
}

/* ---------- 2. App unificado com toggle ---------- */
function AppScreen() {
  const [product, setProduct] = useState<Product>("well");
  const [pulse, setPulse] = useState(0);
  const theme = PRODUCT[product];

  function pick(p: Product) {
    if (p !== product) setPulse((x) => x + 1);
    setProduct(p);
  }

  return (
    <div className="px-4 pb-8" style={{ background: E.field, minHeight: "100%" }}>
      <div className="flex items-center justify-between pt-1">
        <WellbetCoLogo size={22} tone="light" />
        <span className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-white/40">
          <Image src={USERS[8].avatar} alt="você" fill sizes="32px" className="object-cover" />
        </span>
      </div>

      {/* toggle in-phone (funciona de verdade) */}
      <div className="mt-4 flex rounded-full p-1" style={{ background: GLASS_STRONG }}>
        {(["well", "gym"] as const).map((id) => {
          const active = product === id;
          const Icon = id === "well" ? Activity : Dumbbell;
          return (
            <button
              key={id}
              type="button"
              onClick={() => pick(id)}
              className="relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-extrabold transition-colors"
              style={{ color: active ? "#fff" : "rgba(255,255,255,.6)" }}
            >
              {active && (
                <motion.span
                  layoutId="phone-pill"
                  transition={SPRING}
                  className="absolute inset-0 -z-10 rounded-full"
                  style={{ background: PRODUCT[id].accent }}
                />
              )}
              <Icon size={14} strokeWidth={2.6} /> {PRODUCT[id].name}
            </button>
          );
        })}
      </div>

      {/* M líquido reage ao toggle */}
      <div className="mt-4 grid place-items-center">
        <LiquidM size={96} pulse={pulse} gradient={theme.gradient} />
      </div>

      {/* banca */}
      <div className="mt-4 rounded-3xl p-4" style={{ background: GLASS, boxShadow: "inset 0 0 0 1px " + GLASS_LINE }}>
        <span className="text-[11px]" style={{ color: E.peri, opacity: 0.7 }}>
          Banca · {theme.name}
        </span>
        <AnimatePresence mode="wait">
          <motion.p
            key={product}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="font-[family-name:var(--font-mono)] text-3xl font-medium tabular-nums"
            style={{ color: E.green }}
          >
            {brl(product === "well" ? 12480 : 9320)}
          </motion.p>
        </AnimatePresence>
        <div className="mt-3 flex gap-2">
          <span className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold text-white" style={{ background: theme.accent }}>
            <Wallet size={12} /> Recarregar
          </span>
          <span className="rounded-full px-3 py-1.5 text-xs font-bold text-white" style={{ background: GLASS_STRONG }}>
            Sacar
          </span>
        </div>
      </div>

      {/* meta adaptada ao produto */}
      <div className="mt-3 rounded-3xl p-4" style={{ background: GLASS, boxShadow: "inset 0 0 0 1px " + GLASS_LINE }}>
        <div className="flex items-center gap-2">
          <BoltMark style={{ height: 15, width: "auto", color: theme.accentSoft }} />
          <span className="text-sm font-extrabold text-white">Meta da semana</span>
        </div>
        <p className="mt-1 text-xs" style={{ color: E.peri }}>
          {product === "well"
            ? `Perder 4kg · odd ${odd(2.45)} · retorno ${brl(196)}`
            : `Treinar 6× · odd ${odd(2.6)} · retorno ${brl(208)}`}
        </p>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full" style={{ background: "rgba(8,4,40,.5)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg,${theme.accent},${E.green})` }}
            animate={{ width: product === "well" ? "72%" : "58%" }}
            transition={SPRING}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- 3. Ranking ---------- */
function RankScreen() {
  const board = USERS.slice(0, 6).map((u, i) => ({
    ...u,
    kg: (5.0 - i * 0.6).toFixed(1),
    me: i === 2,
  }));
  return (
    <div className="px-4 pb-8" style={{ background: E.field, minHeight: "100%" }}>
      <div className="flex items-center gap-2 pt-1">
        <Crown size={18} style={{ color: E.pink }} fill={E.pink} />
        <p className="text-sm font-extrabold text-white">Ranking · sua liga</p>
      </div>
      <p className="text-xs" style={{ color: E.peri, opacity: 0.75 }}>
        Quem mais evoluiu fatura o pote.
      </p>

      <div className="mt-3 space-y-2">
        {board.map((u, i) => (
          <div
            key={u.handle}
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5"
            style={{
              background: u.me ? E.blue : GLASS_STRONG,
              boxShadow: u.me ? "none" : "inset 0 0 0 1px " + GLASS_LINE,
            }}
          >
            <span className="w-5 text-center font-[family-name:var(--font-mono)] text-sm font-bold tabular-nums" style={{ color: i === 0 ? E.pink : "rgba(204,209,255,.85)" }}>
              {i + 1}
            </span>
            <span className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white/50">
              <Image src={u.avatar} alt={u.name} fill sizes="36px" className="object-cover" />
            </span>
            <span className="flex-1 truncate text-sm font-bold text-white">
              {u.me ? "Você" : u.name.split(" ")[0]}
            </span>
            <span className="font-[family-name:var(--font-mono)] text-sm font-semibold tabular-nums" style={{ color: u.me ? "#fff" : E.green }}>
              -{u.kg}kg
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: GRADIENT.muma }}>
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white">
          <Flame size={14} fill="#fff" /> Pote da liga
        </span>
        <span className="font-[family-name:var(--font-mono)] text-lg font-medium tabular-nums text-white">
          {brl(4820)}
        </span>
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 text-sm font-extrabold" style={{ color: E.field }}>
        <Sparkles size={15} /> Entrar na próxima liga
      </button>
    </div>
  );
}
