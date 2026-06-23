"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Sparkles, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FOIL, HOLO, brl } from "./tokens";
import { GlassLabel, GlassPanel, IridBurst, Shimmer } from "./primitives";

/**
 * SEÇÃO 1 — FUNDAMENTOS, 100% interativo.
 * Paleta copia o hex ao tocar (com burst iridescente); tipografia tem controle
 * ao vivo (texto editável + slider + peso + voz); mostruário de botões/chips/
 * badges/stepper responde de verdade ao toque.
 * Runtime-safe: clipboard só em handler com try/catch; nada de random no render.
 */

/* ──────────────────────────────────────────────────────────────────────────
 * PALETA · clicar = copia o hex (shimmer + "copiado!")
 * ────────────────────────────────────────────────────────────────────────── */
type Token = { hex: string; name: string; note: string };

export function PaletteGrid({ tokens }: { tokens: Token[] }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [burst, setBurst] = useState(0);

  async function grab(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      /* clipboard pode falhar (permissões/http) — feedback visual mesmo assim */
    }
    setCopied(hex);
    setBurst((b) => b + 1);
    window.setTimeout(() => {
      setCopied((cur) => (cur === hex ? null : cur));
    }, 1200);
  }

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
      {tokens.map((c, i) => {
        const isCopied = copied === c.hex;
        const isLight = c.hex === HOLO.ink;
        return (
          <motion.button
            key={c.hex}
            type="button"
            onClick={() => grab(c.hex)}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03, duration: 0.3, ease: "easeOut" }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Copiar ${c.hex}`}
            className="group relative block min-h-[44px] cursor-pointer overflow-hidden rounded-2xl border border-white/10 p-2.5 text-left outline-none backdrop-blur-md focus-visible:ring-2 focus-visible:ring-[#22D3EE]"
            style={{
              background: "linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
            }}
          >
            <div
              className="relative mb-2 h-14 w-full overflow-hidden rounded-xl"
              style={{
                background: c.hex,
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
              }}
            >
              {/* foil hint girando levemente sobre o swatch */}
              <span
                aria-hidden
                className="absolute inset-0 opacity-30 transition-opacity duration-200 group-hover:opacity-60"
                style={{
                  background: FOIL,
                  backgroundSize: "200% 200%",
                  mixBlendMode: "overlay",
                }}
              />
              <span className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-active:opacity-100">
                <span className="rounded-md bg-black/45 px-1.5 py-0.5 backdrop-blur-sm">
                  <Copy className="h-3.5 w-3.5" style={{ color: isLight ? "#0A0A12" : "#fff" }} />
                </span>
              </span>
              <AnimatePresence>
                {isCopied ? <IridBurst burstKey={burst} count={10} /> : null}
              </AnimatePresence>
            </div>

            <span className="relative block min-h-[30px]">
              <AnimatePresence mode="wait" initial={false}>
                {isCopied ? (
                  <motion.span
                    key="copied"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="flex items-center gap-1"
                  >
                    <Check className="h-3 w-3 text-[#34F5A0]" />
                    <GlassLabel className="text-[#34F5A0]">copiado!</GlassLabel>
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="block"
                  >
                    <span className="block text-xs font-semibold text-[#F2F2FA]">{c.name}</span>
                    <span className="block font-[family-name:var(--font-mono)] text-[11px] text-[#A6A6C8] transition-colors group-hover:text-[#22D3EE]">
                      {c.hex}
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            <span className="mt-1 block text-[10px] leading-tight text-[#5B5B7E]">{c.note}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * TIPOGRAFIA · controle ao vivo
 * ────────────────────────────────────────────────────────────────────────── */
type Voice = "display" | "body" | "mono";

export function TypeLab() {
  const [text, setText] = useState("DEU GREEN");
  const [size, setSize] = useState(40);
  const [weight, setWeight] = useState(700);
  const [voice, setVoice] = useState<Voice>("display");

  const fontVar =
    voice === "display"
      ? "var(--font-display)"
      : voice === "body"
        ? "var(--font-body)"
        : "var(--font-mono)";

  const VOICES: { id: Voice; label: string; desc: string }[] = [
    { id: "display", label: "Sora", desc: "Display geométrica" },
    { id: "body", label: "Space Grotesk", desc: "Corpo" },
    { id: "mono", label: "JetBrains Mono", desc: "Dados / R$" },
  ];

  return (
    <GlassPanel className="p-5" glow="cyan">
      {/* voice toggles */}
      <div className="mb-4 flex flex-wrap gap-2">
        {VOICES.map((v) => {
          const active = v.id === voice;
          return (
            <motion.button
              key={v.id}
              type="button"
              onClick={() => setVoice(v.id)}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "min-h-[44px] rounded-xl px-3 py-2 text-left transition-colors",
                active ? "text-[#0A0A12]" : "border border-white/10 bg-white/[0.03] text-[#F2F2FA]",
              )}
              style={active ? { background: FOIL } : undefined}
            >
              <span className="block text-sm font-bold leading-none">{v.label}</span>
              <span
                className={cn(
                  "mt-0.5 block text-[10px]",
                  active ? "text-[#0A0A12]/70" : "text-[#A6A6C8]",
                )}
              >
                {v.desc}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* live specimen */}
      <div className="relative flex min-h-[110px] items-center overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A12]/60 px-4 py-5">
        <span
          className="block w-full break-words text-[#F2F2FA]"
          style={{
            fontFamily: fontVar,
            fontSize: size,
            fontWeight: weight,
            lineHeight: 1.15,
            letterSpacing: voice === "mono" ? "0.04em" : "-0.01em",
          }}
        >
          {text || " "}
        </span>
      </div>

      {/* controls */}
      <div className="mt-4 space-y-4">
        <label className="block">
          <GlassLabel className="mb-2 block text-[#A855F7]">texto · editável</GlassLabel>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={42}
            placeholder="digite aqui…"
            className="min-h-[44px] w-full rounded-xl border border-white/10 bg-[#0A0A12]/60 px-3 py-2 font-[family-name:var(--font-body)] text-sm text-[#F2F2FA] outline-none placeholder:text-[#5B5B7E] focus:border-[#22D3EE]/50"
          />
        </label>

        <label className="block">
          <span className="mb-2 flex items-center justify-between">
            <GlassLabel className="text-[#22D3EE]">tamanho</GlassLabel>
            <span className="font-[family-name:var(--font-mono)] text-xs font-bold tabular-nums text-[#22D3EE]">
              {size}px
            </span>
          </span>
          <input
            type="range"
            min={16}
            max={68}
            step={1}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            aria-label="Tamanho da fonte"
            className="holo-range h-2 w-full cursor-pointer appearance-none rounded-full"
          />
        </label>

        <label className="block">
          <span className="mb-2 flex items-center justify-between">
            <GlassLabel className="text-[#34F5A0]">peso</GlassLabel>
            <span className="font-[family-name:var(--font-mono)] text-xs font-bold tabular-nums text-[#34F5A0]">
              {weight}
            </span>
          </span>
          <input
            type="range"
            min={300}
            max={800}
            step={100}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            aria-label="Peso da fonte"
            className="holo-range h-2 w-full cursor-pointer appearance-none rounded-full"
          />
        </label>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-[#A6A6C8]">
        Display Sora em títulos; corpo Space Grotesk para leitura; todo número de R$/cotação vive no{" "}
        <span className="text-[#22D3EE]">mono</span> leve — troque a voz e veja a regra na prática.
      </p>
    </GlassPanel>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * BOTÕES · respondem ao clique (antecipação → ação → payoff)
 * ────────────────────────────────────────────────────────────────────────── */
type BtnDef = {
  id: string;
  idle: string;
  done: string;
  variant: "foil" | "green" | "ghost";
};

const BUTTONS: BtnDef[] = [
  { id: "bet", idle: "FAZER APOSTA", done: "PASSE VALIDADO!", variant: "foil" },
  {
    id: "green",
    idle: "Confirmar check-in",
    done: "DEU GREEN ✓",
    variant: "green",
  },
  { id: "cash", idle: "Fazer cash out", done: "Sacado ✓", variant: "ghost" },
];

export function ButtonShowcase() {
  const [fired, setFired] = useState<Record<string, number>>({});

  function press(id: string) {
    setFired((cur) => ({ ...cur, [id]: (cur[id] ?? 0) + 1 }));
    window.setTimeout(() => {
      setFired((cur) => ({ ...cur, [id]: 0 }));
    }, 1300);
  }

  return (
    <GlassPanel className="space-y-3 p-5">
      <GlassLabel className="text-[#A6A6C8]">botões · toque</GlassLabel>
      {BUTTONS.map((b) => {
        const on = (fired[b.id] ?? 0) > 0;
        const base =
          "relative block min-h-[48px] w-full overflow-hidden rounded-xl px-4 py-3 text-sm font-bold";
        return (
          <motion.button
            key={b.id}
            type="button"
            onClick={() => press(b.id)}
            whileTap={{ scale: 0.96, y: 1 }}
            className={cn(
              base,
              b.variant === "ghost" && "border border-white/15 bg-white/[0.04] text-[#F2F2FA]",
              b.variant === "green" && "text-[#06140C]",
              b.variant === "foil" && "font-[family-name:var(--font-display)] text-[#0A0A12]",
            )}
            style={
              b.variant === "green"
                ? {
                    background: HOLO.green,
                    boxShadow: "0 10px 30px -10px rgba(52, 245, 160,0.6)",
                  }
                : b.variant === "foil"
                  ? {
                      background: FOIL,
                      backgroundSize: "200% 200%",
                      boxShadow: "0 10px 30px -10px rgba(168, 85, 247,0.6)",
                    }
                  : undefined
            }
          >
            {b.variant === "foil" && on ? <Shimmer duration={0.9} /> : null}
            <span className="relative z-10">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={on ? "done" : "idle"}
                  initial={{ opacity: 0, y: on ? 6 : -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="block"
                >
                  {on ? b.done : b.idle}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.button>
        );
      })}
    </GlassPanel>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * CHIPS DE COTAÇÃO (selecionáveis) + BADGES (alternam)
 * ────────────────────────────────────────────────────────────────────────── */
const CHIPS = [
  { o: "2,40", tone: HOLO.purple },
  { o: "1,85", tone: HOLO.cyan },
  { o: "3,10", tone: HOLO.green },
  { o: "4,50", tone: HOLO.purple },
];

export function ChipsAndBadges() {
  const [activeChip, setActiveChip] = useState<string | null>("2,40");
  const [badges, setBadges] = useState({
    foil: true,
    streak: false,
    free: true,
  });

  function toggleBadge(k: keyof typeof badges) {
    setBadges((cur) => ({ ...cur, [k]: !cur[k] }));
  }

  return (
    <GlassPanel className="space-y-3 p-5" glow="green">
      <GlassLabel className="text-[#A6A6C8]">chips · selecione a cotação</GlassLabel>
      <div className="flex flex-wrap gap-2">
        {CHIPS.map((chip) => {
          const active = activeChip === chip.o;
          return (
            <motion.button
              key={chip.o}
              type="button"
              onClick={() => setActiveChip((cur) => (cur === chip.o ? null : chip.o))}
              whileTap={{ scale: 0.94 }}
              aria-pressed={active}
              className="min-h-[44px] rounded-xl px-3.5 py-2 font-[family-name:var(--font-mono)] text-sm font-bold tabular-nums transition-colors"
              style={{
                color: active ? "#0A0A12" : chip.tone,
                background: active ? chip.tone : "rgba(255,255,255,0.04)",
                boxShadow: `inset 0 0 0 1px ${active ? "transparent" : chip.tone + "55"}`,
              }}
            >
              {chip.o}x
            </motion.button>
          );
        })}
      </div>
      <span className="block text-[11px] text-[#A6A6C8]">
        {activeChip ? `cotação selecionada: ${activeChip}x` : "toque para escolher uma cotação"}
      </span>

      <GlassLabel className="block pt-1 text-[#A6A6C8]">badges · toque para alternar</GlassLabel>
      <div className="flex flex-wrap gap-2">
        <BadgeToggle
          on={badges.foil}
          tone={HOLO.purple}
          onClick={() => toggleBadge("foil")}
          label="PASSE FOIL"
        />
        <BadgeToggle
          on={badges.streak}
          tone={HOLO.cyan}
          onClick={() => toggleBadge("streak")}
          label="STREAK 12"
        />
        <BadgeToggle
          on={badges.free}
          tone={HOLO.green}
          onClick={() => toggleBadge("free")}
          label="FREE BET"
        />
      </div>
    </GlassPanel>
  );
}

function BadgeToggle({
  on,
  tone,
  onClick,
  label,
}: {
  on: boolean;
  tone: string;
  onClick: () => void;
  label: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      aria-pressed={on}
      className="flex min-h-[44px] items-center gap-1.5 rounded-full px-3 py-2 transition-all"
      style={{
        background: on ? tone : "rgba(255,255,255,0.04)",
        boxShadow: `inset 0 0 0 1px ${on ? "transparent" : tone + "44"}`,
        opacity: on ? 1 : 0.8,
      }}
    >
      <Sparkles className="h-3.5 w-3.5" style={{ color: on ? "#0A0A12" : tone }} />
      <GlassLabel style={{ color: on ? "#0A0A12" : tone }}>{label}</GlassLabel>
    </motion.button>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * STAKE STEPPER (com count-up de retorno e barra viva)
 * ────────────────────────────────────────────────────────────────────────── */
const SMIN = 20;
const SMAX = 500;
const SSTEP = 25;
const ODD = 2.4;

export function StakeStepper() {
  const [stake, setStake] = useState(100);
  const frac = (stake - SMIN) / (SMAX - SMIN);
  const lit = Math.round(frac * 14);
  const payout = stake * ODD;

  return (
    <GlassPanel className="space-y-3 p-5">
      <GlassLabel className="text-[#A6A6C8]">stepper de stake</GlassLabel>

      <div className="flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-[#0A0A12]/60 px-3 py-2.5">
        <motion.button
          type="button"
          onClick={() => setStake((v) => Math.max(SMIN, v - SSTEP))}
          whileTap={{ scale: 0.9 }}
          aria-label="Diminuir stake"
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-[#F2F2FA]"
        >
          <Minus className="h-4 w-4" />
        </motion.button>
        <span className="flex flex-col items-center">
          <GlassLabel className="text-[#5B5B7E]">stake</GlassLabel>
          <motion.span
            key={stake}
            initial={{ scale: 1.14 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 600, damping: 18 }}
            className="font-[family-name:var(--font-mono)] text-xl font-bold tabular-nums text-[#F2F2FA]"
          >
            R$ {brl(stake)}
          </motion.span>
        </span>
        <motion.button
          type="button"
          onClick={() => setStake((v) => Math.min(SMAX, v + SSTEP))}
          whileTap={{ scale: 0.9 }}
          aria-label="Aumentar stake"
          className="grid h-10 w-10 place-items-center rounded-xl text-[#0A0A12]"
          style={{ background: FOIL }}
        >
          <Plus className="h-4 w-4" />
        </motion.button>
      </div>

      <div className="flex h-2.5 gap-[3px] overflow-hidden rounded-full bg-white/[0.06] p-[2px]">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="h-full flex-1 rounded-full transition-all duration-200"
            style={{
              background: i < lit ? FOIL : "transparent",
              opacity: i < lit ? 1 : 0,
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-[#34F5A0]/25 bg-[#34F5A0]/[0.06] px-3 py-2.5">
        <GlassLabel className="text-[#34F5A0]">se der green</GlassLabel>
        <span className="font-[family-name:var(--font-mono)] text-lg font-bold tabular-nums text-[#34F5A0]">
          R$ {brl(payout)}
        </span>
      </div>
    </GlassPanel>
  );
}
