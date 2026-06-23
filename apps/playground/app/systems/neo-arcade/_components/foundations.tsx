"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HudLabel, PixelCoin, PixelShield, PixelStar, PixelHeart } from "./primitives";

/**
 * SEÇÃO 1 — FUNDAMENTOS, agora 100% interativo.
 * Nada decorativo: cada swatch COPIA o hex ("coin grab"), o especime de
 * tipografia tem controle ao vivo (texto editável + slider + toggle de peso),
 * e o mostruário de botões/chips/badges responde de verdade ao toque.
 *
 * Runtime-safe: nenhum Math.random/Date/window no render. navigator.clipboard
 * só dentro de handlers, com try/catch.
 */

/* ──────────────────────────────────────────────────────────────────────────
 * PALETA · clicar = COIN GRAB (copia o hex)
 * ────────────────────────────────────────────────────────────────────────── */

type Token = { hex: string; name: string; note: string };

export function PaletteGrid({ tokens }: { tokens: Token[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  async function grab(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      /* clipboard pode falhar (permissões / http) — feedback visual mesmo assim */
    }
    setCopied(hex);
    window.setTimeout(() => {
      setCopied((cur) => (cur === hex ? null : cur));
    }, 1100);
  }

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-3 lg:grid-cols-9">
      {tokens.map((c, i) => {
        const isCopied = copied === c.hex;
        return (
          <motion.button
            key={c.hex}
            type="button"
            onClick={() => grab(c.hex)}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: i * 0.03,
              type: "spring",
              stiffness: 400,
              damping: 24,
            }}
            whileTap={{ x: 2, y: 2 }}
            aria-label={`Copiar ${c.hex}`}
            className="group relative block min-h-[44px] cursor-pointer bg-[#1C1140] p-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
            style={{ boxShadow: "0 0 0 2px #2E1065" }}
          >
            <div
              className="relative mb-2 h-12 w-full overflow-hidden"
              style={{
                background: c.hex,
                boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.3)",
              }}
            >
              {/* hover/tap hint */}
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-active:opacity-100">
                <span className="bg-[#120A24]/80 px-1.5 py-0.5">
                  <PixelCoin size={14} />
                </span>
              </span>
              {/* coin-grab burst */}
              <AnimatePresence>{isCopied ? <SwatchBurst /> : null}</AnimatePresence>
            </div>

            <span className="relative block min-h-[26px]">
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
                    <PixelCoin size={11} />
                    <HudLabel className="text-[9px] text-[#22E06B]">COIN GRAB!</HudLabel>
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
                    <HudLabel className="block text-[9px] text-[#EDE9FE]">{c.name}</HudLabel>
                    <span className="block font-mono text-[10px] text-[#9D8FC7] transition-colors group-hover:text-[#FFD60A]">
                      {c.hex}
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

/** Tiny deterministic coin pop when a swatch is grabbed (offsets from index). */
function SwatchBurst() {
  const N = 6;
  return (
    <span className="pointer-events-none absolute left-1/2 top-1/2">
      {Array.from({ length: N }).map((_, i) => {
        const ang = (i / N) * Math.PI * 2;
        const dist = 22;
        return (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5"
            style={{ background: i % 2 === 0 ? "#FFD60A" : "#22E06B" }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(ang) * dist,
              y: Math.sin(ang) * dist,
              opacity: 0,
              scale: 0.4,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        );
      })}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * TIPOGRAFIA · controle ao vivo (texto editável + tamanho + peso)
 * ────────────────────────────────────────────────────────────────────────── */

export function TypeLab() {
  const [text, setText] = useState("DEU GREEN!");
  const [size, setSize] = useState(28);
  const [bold, setBold] = useState(true);
  const [voice, setVoice] = useState<"display" | "hud" | "body">("display");

  const fontVar =
    voice === "display"
      ? "var(--font-display)"
      : voice === "hud"
        ? "var(--font-hud)"
        : "var(--font-body)";

  const VOICES: { id: typeof voice; label: string; color: string }[] = [
    { id: "display", label: "DISPLAY", color: "#8B5CF6" },
    { id: "hud", label: "HUD", color: "#FFD60A" },
    { id: "body", label: "CORPO", color: "#22E06B" },
  ];

  return (
    <div className="bg-[#1C1140] p-5" style={{ boxShadow: "0 0 0 2px #2E1065" }}>
      {/* voice toggles */}
      <div className="mb-4 flex flex-wrap gap-2">
        {VOICES.map((v) => {
          const active = v.id === voice;
          return (
            <motion.button
              key={v.id}
              type="button"
              onClick={() => setVoice(v.id)}
              whileTap={{ x: 2, y: 2 }}
              className="min-h-[44px] px-3 py-2 font-[family-name:var(--font-hud)] text-[10px] uppercase tracking-[0.16em]"
              style={{
                color: active ? "#120A24" : v.color,
                background: active ? v.color : "#120A24",
                boxShadow: `0 0 0 2px ${v.color}`,
              }}
            >
              {v.label}
            </motion.button>
          );
        })}
      </div>

      {/* live specimen */}
      <div
        className="flex min-h-[96px] items-center overflow-hidden bg-[#120A24] px-4 py-5"
        style={{ boxShadow: "inset 0 0 0 2px #2E1065" }}
      >
        <span
          className="block w-full break-words text-[#EDE9FE]"
          style={{
            fontFamily: fontVar,
            fontSize: size,
            fontWeight: voice === "body" ? (bold ? 700 : 400) : 400,
            lineHeight: 1.3,
            letterSpacing: voice === "hud" ? "0.12em" : undefined,
            textTransform: voice === "hud" ? "uppercase" : undefined,
          }}
        >
          {text || " "}
        </span>
      </div>

      {/* controls */}
      <div className="mt-4 space-y-4">
        {/* editable text */}
        <label className="block">
          <HudLabel className="mb-2 block text-[10px] text-[#8B5CF6]">TEXTO · EDITÁVEL</HudLabel>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={40}
            placeholder="digite aqui…"
            className="min-h-[44px] w-full bg-[#120A24] px-3 py-2 font-[family-name:var(--font-body)] text-sm text-[#EDE9FE] outline-none placeholder:text-[#4A3A7A] focus:text-[#FFD60A]"
            style={{ boxShadow: "inset 0 0 0 2px #2E1065" }}
          />
        </label>

        {/* size slider */}
        <label className="block">
          <span className="mb-2 flex items-center justify-between">
            <HudLabel className="text-[10px] text-[#FFD60A]">TAMANHO</HudLabel>
            <span className="font-[family-name:var(--font-body)] text-xs font-bold tabular-nums text-[#FFD60A]">
              {size}px
            </span>
          </span>
          <input
            type="range"
            min={14}
            max={56}
            step={1}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            aria-label="Tamanho da fonte"
            className="neoArcade-range h-3 w-full cursor-pointer appearance-none bg-[#2E1065]"
            style={{ accentColor: "#FFD60A" }}
          />
        </label>

        {/* weight toggle (body only) */}
        <div className="flex items-center justify-between">
          <HudLabel className="text-[10px] text-[#22E06B]">
            PESO {voice === "body" ? "" : "· (só CORPO)"}
          </HudLabel>
          <motion.button
            type="button"
            disabled={voice !== "body"}
            onClick={() => setBold((b) => !b)}
            whileTap={{ x: 2, y: 2 }}
            className="min-h-[44px] px-4 py-2 font-[family-name:var(--font-hud)] text-[10px] uppercase tracking-[0.16em] disabled:opacity-40"
            style={{
              color: bold && voice === "body" ? "#120A24" : "#22E06B",
              background: bold && voice === "body" ? "#22E06B" : "#120A24",
              boxShadow: "0 0 0 2px #22E06B",
            }}
          >
            {bold ? "BOLD 700" : "REGULAR 400"}
          </motion.button>
        </div>
      </div>

      <p className="mt-4 font-[family-name:var(--font-body)] text-[11px] leading-relaxed text-[#9D8FC7]">
        Pixel (Display/HUD) só em títulos e labels. Todo número de R$/cotação vive no CORPO legível
        — troque a voz e veja a regra na prática.
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * BOTÕES · respondem ao clique com feedback visível
 * ────────────────────────────────────────────────────────────────────────── */

type BtnDef = {
  id: string;
  idle: string;
  done: string;
  fg: string;
  bg: string;
  drop: string;
};

const BUTTONS: BtnDef[] = [
  {
    id: "bet",
    idle: "FAZER APOSTA",
    done: "APOSTA FEITA!",
    fg: "#06140C",
    bg: "#22E06B",
    drop: "#047857",
  },
  {
    id: "coin",
    idle: "INSERT COIN",
    done: "+R$ 25 · COIN!",
    fg: "#120A24",
    bg: "#FFD60A",
    drop: "#B8860B",
  },
  {
    id: "cash",
    idle: "CASH OUT",
    done: "SACADO ✓",
    fg: "#EDE9FE",
    bg: "#6D28D9",
    drop: "#2E1065",
  },
];

export function ButtonShowcase() {
  const [fired, setFired] = useState<Record<string, boolean>>({});

  function press(id: string) {
    setFired((cur) => ({ ...cur, [id]: true }));
    window.setTimeout(() => {
      setFired((cur) => {
        if (!cur[id]) return cur;
        const next = { ...cur };
        next[id] = false;
        return next;
      });
    }, 1200);
  }

  return (
    <div className="space-y-3 bg-[#1C1140] p-5" style={{ boxShadow: "0 0 0 2px #2E1065" }}>
      <HudLabel className="text-[10px] text-[#9D8FC7]">BOTÕES · CLIQUE</HudLabel>
      {BUTTONS.map((b) => {
        const on = !!fired[b.id];
        return (
          <motion.button
            key={b.id}
            type="button"
            onClick={() => press(b.id)}
            whileTap={{ x: 4, y: 4 }}
            animate={on ? { x: [0, -2, 2, -1, 0] } : { x: 0 }}
            transition={{ duration: 0.2, ease: "linear" }}
            className="block min-h-[48px] w-full px-4 py-3 font-[family-name:var(--font-display)] text-[11px]"
            style={{
              color: b.fg,
              background: b.bg,
              boxShadow: on ? `2px 2px 0 0 ${b.drop}` : `4px 4px 0 0 ${b.drop}`,
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={on ? "done" : "idle"}
                initial={{ opacity: 0, y: on ? 4 : -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="block"
              >
                {on ? b.done : b.idle}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * CHIPS DE COTAÇÃO (selecionáveis) + BADGES (alternam ao tocar)
 * ────────────────────────────────────────────────────────────────────────── */

const CHIPS = [
  { o: "2,40x", c: "#22E06B" },
  { o: "1,85x", c: "#8B5CF6" },
  { o: "3,10x", c: "#FFD60A" },
];

export function ChipsAndBadges() {
  // chips: single-select toggle ("active")
  const [activeChip, setActiveChip] = useState<string | null>("2,40x");
  // badges: independent on/off toggles
  const [badges, setBadges] = useState({
    shield: true,
    coin: false,
    level: true,
  });

  function toggleBadge(k: keyof typeof badges) {
    setBadges((cur) => ({ ...cur, [k]: !cur[k] }));
  }

  return (
    <div className="space-y-3 bg-[#1C1140] p-5" style={{ boxShadow: "0 0 0 2px #2E1065" }}>
      <HudLabel className="text-[10px] text-[#9D8FC7]">CHIPS · SELECIONE A COTAÇÃO</HudLabel>
      <div className="flex flex-wrap gap-2">
        {CHIPS.map((chip) => {
          const active = activeChip === chip.o;
          return (
            <motion.button
              key={chip.o}
              type="button"
              onClick={() => setActiveChip((cur) => (cur === chip.o ? null : chip.o))}
              whileTap={{ x: 2, y: 2 }}
              aria-pressed={active}
              className="min-h-[44px] px-3 py-2 font-[family-name:var(--font-body)] text-sm font-bold tabular-nums"
              style={{
                color: active ? "#120A24" : chip.c,
                background: active ? chip.c : "#120A24",
                boxShadow: `0 0 0 2px ${chip.c}${active ? ", 2px 2px 0 0 #120A24" : ""}`,
              }}
            >
              {chip.o}
            </motion.button>
          );
        })}
      </div>
      <span className="block font-[family-name:var(--font-body)] text-[11px] text-[#9D8FC7]">
        {activeChip ? `cotação selecionada: ${activeChip}` : "toque para escolher uma cotação"}
      </span>

      <HudLabel className="block pt-1 text-[10px] text-[#9D8FC7]">
        BADGES · TOQUE PARA ALTERNAR
      </HudLabel>
      <div className="flex flex-wrap gap-2">
        <BadgeToggle
          on={badges.shield}
          color="#22E06B"
          onClick={() => toggleBadge("shield")}
          icon={<PixelShield size={16} />}
          label="SHIELD"
        />
        <BadgeToggle
          on={badges.coin}
          color="#FFD60A"
          onClick={() => toggleBadge("coin")}
          icon={<PixelCoin size={16} />}
          label="+R$25"
        />
        <BadgeToggle
          on={badges.level}
          color="#8B5CF6"
          onClick={() => toggleBadge("level")}
          icon={<PixelStar size={14} fill={badges.level ? "#120A24" : "#8B5CF6"} />}
          label="NÍVEL 6"
        />
      </div>
    </div>
  );
}

function BadgeToggle({
  on,
  color,
  onClick,
  icon,
  label,
}: {
  on: boolean;
  color: string;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ x: 2, y: 2 }}
      aria-pressed={on}
      className="flex min-h-[44px] items-center gap-1.5 px-3 py-2 transition-opacity"
      style={{
        background: on ? color : "#120A24",
        boxShadow: `0 0 0 2px ${color}`,
        opacity: on ? 1 : 0.85,
      }}
    >
      <span style={{ filter: on ? "brightness(0.2)" : "none" }}>{icon}</span>
      <HudLabel className="text-[10px]" style={{ color: on ? "#120A24" : color }}>
        {label}
      </HudLabel>
    </motion.button>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * INPUT DE STAKE (stepper INSERT COIN) + barra viva + LIVES interativas
 * ────────────────────────────────────────────────────────────────────────── */

const SMIN = 0;
const SMAX = 500;

export function StakeStepper() {
  const [stake, setStake] = useState(50);
  // "lives" (corações) que alternam ao tocar — nada decorativo
  const [lives, setLives] = useState([true, true, true, false]);

  const frac = (stake - SMIN) / (SMAX - SMIN);
  const lit = Math.round(frac * 12);

  function toggleLife(i: number) {
    setLives((cur) => cur.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <div className="space-y-3 bg-[#1C1140] p-5" style={{ boxShadow: "0 0 0 2px #2E1065" }}>
      <HudLabel className="text-[10px] text-[#9D8FC7]">INPUT DE STAKE · INSERT COIN</HudLabel>

      <div
        className="flex items-center justify-between gap-2 bg-[#120A24] px-3 py-2.5"
        style={{ boxShadow: "inset 0 0 0 2px #2E1065" }}
      >
        <motion.button
          type="button"
          onClick={() => setStake((v) => Math.max(SMIN, v - 25))}
          whileTap={{ x: 2, y: 2 }}
          aria-label="Diminuir stake"
          className="grid h-9 w-9 place-items-center bg-[#2E1065] font-[family-name:var(--font-display)] text-[11px] text-[#EDE9FE]"
          style={{ boxShadow: "2px 2px 0 0 #1C1140" }}
        >
          −
        </motion.button>
        <span className="flex flex-col items-center">
          <HudLabel className="text-[8px] text-[#9D8FC7]">STAKE</HudLabel>
          <motion.span
            key={stake}
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 600, damping: 18 }}
            className="font-[family-name:var(--font-body)] text-lg font-bold tabular-nums text-[#FFD60A]"
          >
            R$ {stake.toFixed(2).replace(".", ",")}
          </motion.span>
        </span>
        <motion.button
          type="button"
          onClick={() => setStake((v) => Math.min(SMAX, v + 25))}
          whileTap={{ x: 2, y: 2 }}
          aria-label="Aumentar stake"
          className="grid h-9 w-9 place-items-center bg-[#FFD60A] font-[family-name:var(--font-display)] text-[11px] text-[#120A24]"
          style={{ boxShadow: "2px 2px 0 0 #B8860B" }}
        >
          +
        </motion.button>
      </div>

      <HudLabel className="block pt-1 text-[10px] text-[#22E06B]">BARRA DE PROGRESSO</HudLabel>
      <div className="flex h-3 gap-[2px] bg-[#2E1065] p-[2px]">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="h-full flex-1 transition-colors duration-150"
            style={{ background: i < lit ? "#22E06B" : "transparent" }}
          />
        ))}
      </div>

      <HudLabel className="block pt-1 text-[10px] text-[#FF5470]">LIVES · TOQUE</HudLabel>
      <div className="flex items-center gap-1.5">
        {lives.map((on, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={() => toggleLife(i)}
            whileTap={{ scale: 0.85 }}
            aria-label={on ? "Remover vida" : "Adicionar vida"}
            className="grid h-9 w-9 place-items-center"
          >
            <PixelHeart size={20} empty={!on} fill="#FF5470" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
