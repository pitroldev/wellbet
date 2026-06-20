"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Target, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_SOFT, GLOW, HudLabel, mono, OddsChip } from "./primitives";

/* ──────────────────────────────────────────────────────────────────────────
   SEÇÃO 1 — FUNDAMENTOS, agora 100% interativos.
   - PaletteSwatches: clicar COPIA o hex (clipboard no onClick) + feedback.
   - TypeSpecimen: texto editável + slider de tamanho + toggle de peso AO VIVO.
   - ComponentBoard: botões com estado, chips de cotação selecionáveis,
     badges/estados que alternam ao toque, linha de cupom que liga/desliga.
   Runtime-safe: nada de Math.random/Date/window no render.
   ────────────────────────────────────────────────────────────────────────── */

type Swatch = {
  hex: string;
  name: string;
  note: string;
  glow?: "purple" | "green";
};

const SWATCHES: Swatch[] = [
  { hex: "#0E0B1A", name: "bg", note: "near-black arroxeado" },
  { hex: "#171327", name: "surface", note: "placa do cupom" },
  {
    hex: "#8B5CF6",
    name: "roxo-glow",
    note: "estrutura / odds",
    glow: "purple",
  },
  { hex: "#34F5A0", name: "verde-glow", note: "green / ganho", glow: "green" },
  { hex: "#FF5470", name: "risk", note: "red / risco" },
  { hex: "#EDEAF7", name: "texto", note: "leitura AA" },
  { hex: "#8B83A8", name: "muted", note: "labels / HUD" },
];

/* ── Swatch clicável: copia o hex no onClick com feedback "copiado!" ──────── */
export function PaletteSwatches() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      /* clipboard pode falhar (permissão/contexto) — ignora, o feedback visual ainda dá */
    }
    setCopied(hex);
    window.setTimeout(() => {
      setCopied((cur) => (cur === hex ? null : cur));
    }, 1100);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <HudLabel tone="purple">Paleta · toque pra copiar</HudLabel>
        <span className={cn(mono(), "text-[10px] text-[#8B83A8]")}>clipboard</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {SWATCHES.map((s, i) => {
          const on = copied === s.hex;
          return (
            <motion.button
              key={s.hex}
              type="button"
              onClick={() => copy(s.hex)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, ease: EASE_SOFT }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Copiar ${s.hex} (${s.name})`}
              className="group relative overflow-hidden rounded-xl border border-[rgba(139,131,168,0.16)] bg-[#171327] text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/60"
            >
              <div
                className="relative h-16 w-full"
                style={{
                  background: s.hex,
                  boxShadow:
                    s.glow === "purple"
                      ? "inset 0 0 40px rgba(139,92,246,0.5)"
                      : s.glow === "green"
                        ? "inset 0 0 40px rgba(52,245,160,0.45)"
                        : undefined,
                }}
              >
                {/* affordance: ícone de copiar surge no hover/tap */}
                <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-md bg-[#0E0B1A]/55 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Copy className="h-3.5 w-3.5" color={GLOW.text} />
                </span>
                <AnimatePresence>
                  {on && (
                    <motion.span
                      key="copied"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute inset-0 grid place-items-center bg-[#0E0B1A]/72"
                    >
                      <span
                        className={cn(
                          mono(),
                          "flex items-center gap-1 text-[11px] font-semibold text-[#34F5A0]",
                        )}
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        copiado!
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="p-2.5">
                <div className={cn(mono(), "text-[11px] text-[#EDEAF7]")}>{s.hex}</div>
                <div className="text-xs font-medium text-[#EDEAF7]">{s.name}</div>
                <div className="mt-0.5 text-[10px] leading-tight text-[#8B83A8]">{s.note}</div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Especime de tipografia: editável + slider de tamanho + toggle de peso ── */
const WEIGHTS = [
  { w: 400, label: "Regular" },
  { w: 500, label: "Medium" },
  { w: 700, label: "Bold" },
] as const;

export function TypeSpecimen() {
  const [text, setText] = useState("Monte o cupom. Dê green.");
  const [size, setSize] = useState(40);
  const [weight, setWeight] = useState<400 | 500 | 700>(700);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* UI font — controlável ao vivo */}
      <div className="rounded-2xl border border-[rgba(139,131,168,0.16)] bg-[#171327] p-5 shadow-[0_20px_50px_-32px_rgba(0,0,0,0.9)] sm:p-6">
        <div className="flex items-center justify-between">
          <HudLabel tone="purple">UI · Space Grotesk</HudLabel>
          <span className={cn(mono(), "flex items-center gap-1 text-[10px] text-[#8B83A8]")}>
            <Type className="h-3 w-3" />
            ao vivo
          </span>
        </div>

        {/* especime que reflete os controles */}
        <p
          className="mt-3 min-h-[3.5rem] break-words leading-[1.05] tracking-tight text-[#EDEAF7] transition-[font-size] duration-150"
          style={{ fontSize: `${size}px`, fontWeight: weight }}
        >
          {text || "digite algo…"}
        </p>

        {/* editar o texto */}
        <label className="mt-4 block">
          <span
            className={cn(
              mono(),
              "mb-1 block text-[10px] uppercase tracking-[0.2em] text-[#8B83A8]",
            )}
          >
            texto editável
          </span>
          <input
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 48))}
            placeholder="Escreva seu palpite…"
            className={cn(
              "min-h-[44px] w-full rounded-xl border border-[rgba(139,131,168,0.24)] bg-[#0E0B1A]/60 px-3 text-sm text-[#EDEAF7] placeholder:text-[#8B83A8] transition focus:border-[#8B5CF6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/50",
            )}
          />
        </label>

        {/* slider de tamanho */}
        <div className="mt-4 flex items-center justify-between">
          <span className={cn(mono(), "text-[10px] uppercase tracking-[0.2em] text-[#8B83A8]")}>
            tamanho
          </span>
          <span className={cn(mono(), "text-xs font-semibold text-[#8B5CF6]")}>{size}px</span>
        </div>
        <input
          type="range"
          min={20}
          max={64}
          step={1}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          aria-label="Tamanho da fonte"
          className="glow-range mt-2 h-11 w-full cursor-pointer appearance-none bg-transparent"
          style={{
            background: `linear-gradient(90deg, ${GLOW.purple} 0%, ${GLOW.purple} ${((size - 20) / 44) * 100}%, rgba(139,131,168,0.18) ${((size - 20) / 44) * 100}%)`,
            borderRadius: 999,
            height: 10,
          }}
        />

        {/* toggle de peso */}
        <div className="mt-4 flex gap-2">
          {WEIGHTS.map((wt) => {
            const on = weight === wt.w;
            return (
              <button
                key={wt.w}
                type="button"
                onClick={() => setWeight(wt.w)}
                aria-pressed={on}
                style={{ fontWeight: wt.w }}
                className={cn(
                  "min-h-[44px] flex-1 rounded-xl border px-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/60",
                  on
                    ? "border-[#8B5CF6] bg-[#8B5CF6]/15 text-[#EDEAF7] shadow-[0_0_18px_-6px_rgba(139,92,246,0.9)]"
                    : "border-[rgba(139,131,168,0.2)] bg-[#0E0B1A]/60 text-[#8B83A8] hover:text-[#EDEAF7]",
                )}
              >
                {wt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* números mono — tabela viva, hover dá glow */}
      <div className="rounded-2xl border border-[rgba(139,131,168,0.16)] bg-[#171327] p-5 shadow-[0_20px_50px_-32px_rgba(0,0,0,0.9)] sm:p-6">
        <HudLabel tone="green">Números · JetBrains Mono</HudLabel>
        <div className="mt-3 space-y-1">
          {[
            ["Stake", "R$ 200"],
            ["Cotação", "2.40×"],
            ["Retorno", "R$ 480"],
            ["Streak", "047 d"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex items-center justify-between rounded-lg border-b border-[rgba(139,131,168,0.12)] px-1 py-1.5 transition hover:bg-[#34F5A0]/[0.06]"
            >
              <span className="text-sm text-[#8B83A8]">{k}</span>
              <span
                className={cn(mono(), "text-xl font-semibold text-[#34F5A0]")}
                style={{ fontWeight: weight }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-[#8B83A8]">
          Numerais tabulares: cada dígito ocupa a mesma largura, então cotação e retorno nunca
          &quot;dançam&quot; ao atualizar ao vivo. O toggle de peso ao lado também rege estes
          números.
        </p>
      </div>
    </div>
  );
}

/* ── Mostruário: tudo funciona de verdade ─────────────────────────────────── */
type BtnState = "idle" | "loading" | "done";

const ODDS = ["1.62×", "2.40×", "3.10×", "1.18×"] as const;

const BADGES = [
  { t: "Deu green", c: GLOW.green, dot: true },
  { t: "Acumuladora viva", c: GLOW.green, dot: true },
  { t: "Shield ativo", c: GLOW.purple, dot: false },
  { t: "Risco de red", c: GLOW.risk, dot: false },
] as const;

export function ComponentBoard() {
  // chips selecionáveis (toggle "active")
  const [pickedOdd, setPickedOdd] = useState<string | null>("2.40×");
  // botão "Fazer aposta" com micro-fluxo de estado
  const [betState, setBetState] = useState<BtnState>("idle");
  // cash out toggle
  const [cashedOut, setCashedOut] = useState(false);
  // "ver cupom" expande
  const [showSlip, setShowSlip] = useState(false);
  // badges ligados/desligados ao toque
  const [badgeOn, setBadgeOn] = useState<Record<string, boolean>>({
    "Deu green": true,
    "Acumuladora viva": true,
    "Shield ativo": false,
    "Risco de red": false,
  });
  // linha de cupom: liga/desliga a perna
  const [legOn, setLegOn] = useState(true);

  const placeBet = () => {
    if (betState !== "idle") return;
    setBetState("loading");
    window.setTimeout(() => setBetState("done"), 650);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* coluna A — chips + botões */}
      <div>
        <div className="flex items-center justify-between">
          <HudLabel>Chips de cotação · selecionáveis</HudLabel>
          {pickedOdd && (
            <span className={cn(mono(), "text-[10px] text-[#34F5A0]")}>{pickedOdd} no cupom</span>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {ODDS.map((o) => {
            const on = pickedOdd === o;
            return (
              <button
                key={o}
                type="button"
                onClick={() => setPickedOdd((cur) => (cur === o ? null : o))}
                aria-pressed={on}
                className="min-h-[44px] rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/60 active:scale-95"
              >
                <OddsChip
                  tone={on ? "green" : "purple"}
                  active={on}
                  className="px-3 py-2.5 text-sm"
                >
                  {o}
                </OddsChip>
              </button>
            );
          })}
        </div>

        <HudLabel className="mt-6 block">Botões · respondem ao clique</HudLabel>
        <div className="mt-3 flex flex-wrap gap-3">
          {/* Fazer aposta — idle → loading → done */}
          <motion.button
            type="button"
            onClick={placeBet}
            whileTap={{ scale: 0.96 }}
            className={cn(
              mono(),
              "min-h-[44px] min-w-[150px] rounded-xl px-5 text-sm font-semibold transition",
              betState === "done"
                ? "bg-[#34F5A0] text-[#0E0B1A]"
                : "bg-[#8B5CF6] text-white shadow-[0_0_24px_-6px_rgba(139,92,246,0.8)]",
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={betState}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-center gap-1.5"
              >
                {betState === "idle" && "Fazer aposta"}
                {betState === "loading" && (
                  <>
                    <motion.span
                      className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.7,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    enviando…
                  </>
                )}
                {betState === "done" && (
                  <>
                    <Check className="h-4 w-4" strokeWidth={3} />
                    aposta feita
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* Cash out — toggle */}
          <button
            type="button"
            onClick={() => setCashedOut((v) => !v)}
            aria-pressed={cashedOut}
            className={cn(
              mono(),
              "min-h-[44px] rounded-xl border px-5 text-sm font-semibold transition active:scale-95",
              cashedOut
                ? "border-[#34F5A0] bg-[#34F5A0]/20 text-[#34F5A0] shadow-[0_0_18px_-6px_rgba(52,245,160,0.9)]"
                : "border-[#34F5A0]/50 bg-[#34F5A0]/10 text-[#34F5A0]",
            )}
          >
            {cashedOut ? "Saque pego ✓" : "Cash out"}
          </button>

          {/* Ver cupom — expande */}
          <button
            type="button"
            onClick={() => setShowSlip((v) => !v)}
            aria-expanded={showSlip}
            className="min-h-[44px] rounded-xl border border-[rgba(139,131,168,0.3)] bg-transparent px-5 text-sm font-medium text-[#EDEAF7] transition hover:border-[#8B5CF6]/50 active:scale-95"
          >
            {showSlip ? "Ocultar cupom" : "Ver cupom"}
          </button>
        </div>

        {/* reset discreto do micro-fluxo */}
        {(betState === "done" || cashedOut) && (
          <button
            type="button"
            onClick={() => {
              setBetState("idle");
              setCashedOut(false);
            }}
            className="mt-3 text-[11px] text-[#8B83A8] underline-offset-2 transition hover:text-[#EDEAF7] hover:underline"
          >
            resetar estados
          </button>
        )}

        <AnimatePresence>
          {showSlip && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-xl border border-[#8B5CF6]/30 bg-[#0E0B1A]/60 p-3 text-[12px] text-[#8B83A8]">
                Cupom <span className={cn(mono(), "text-[#EDEAF7]")}>#CHY-8842</span> · cotação
                selecionada <span className={cn(mono(), "text-[#8B5CF6]")}>{pickedOdd ?? "—"}</span>
                .
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* coluna B — badges + linha de cupom */}
      <div>
        <HudLabel>Badges / estados · toque pra alternar</HudLabel>
        <div className="mt-3 flex flex-wrap gap-2">
          {BADGES.map((b) => {
            const on = badgeOn[b.t];
            return (
              <button
                key={b.t}
                type="button"
                onClick={() => setBadgeOn((m) => ({ ...m, [b.t]: !m[b.t] }))}
                aria-pressed={on}
                className={cn(
                  mono(),
                  "inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border px-3 text-xs transition active:scale-95",
                )}
                style={{
                  borderColor: on ? b.c : `${b.c}40`,
                  background: on ? `${b.c}1f` : "transparent",
                  color: on ? b.c : GLOW.muted,
                  boxShadow: on ? `0 0 14px -3px ${b.c}aa` : undefined,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full transition"
                  style={{
                    background: on ? b.c : GLOW.muted,
                    opacity: on ? 1 : 0.4,
                  }}
                />
                {b.t}
              </button>
            );
          })}
        </div>

        <HudLabel className="mt-6 block">Linha de cupom · toque pra ligar a perna</HudLabel>
        <button
          type="button"
          onClick={() => setLegOn((v) => !v)}
          aria-pressed={legOn}
          className={cn(
            "mt-3 w-full rounded-xl border p-3 text-left transition active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/60",
            legOn
              ? "border-[#34F5A0]/35 bg-[#34F5A0]/[0.06]"
              : "border-[rgba(139,131,168,0.18)] bg-[#0E0B1A]/60",
          )}
        >
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "grid h-5 w-5 shrink-0 place-items-center rounded-md border transition",
                legOn ? "border-[#34F5A0] bg-[#34F5A0]" : "border-[rgba(139,131,168,0.4)]",
              )}
            >
              {legOn && <Check className="h-3.5 w-3.5" strokeWidth={3} color={GLOW.bg} />}
            </span>
            <Target className="h-4 w-4" color={legOn ? GLOW.purple : GLOW.muted} />
            <span className={cn("flex-1 text-sm", legOn ? "text-[#EDEAF7]" : "text-[#8B83A8]")}>
              Perder 8 kg · 4 meses
            </span>
            <OddsChip tone={legOn ? "green" : "muted"} active={legOn}>
              2.40×
            </OddsChip>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#8B83A8]">
            <span>stake R$ 200</span>
            <span className={cn(mono(), legOn ? "text-[#34F5A0]" : "text-[#8B83A8]")}>
              {legOn ? "retorno R$ 480" : "perna fora do cupom"}
            </span>
          </div>
        </button>
        <p className="mt-3 text-[11px] text-[#8B83A8]">
          Estado nunca só por cor: há ícone, texto e forma juntos (acessibilidade AA). Tudo aqui
          responde ao toque — nada decorativo.
        </p>
      </div>

      {/* slider style reaproveitado (escopado por classe) */}
      <style>{`
        .glow-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 999px;
          background: ${GLOW.purple};
          border: 3px solid #0E0B1A;
          box-shadow: 0 0 14px ${GLOW.purple}, 0 0 0 1px ${GLOW.purple};
          cursor: pointer;
          margin-top: -7px;
        }
        .glow-range::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 999px;
          background: ${GLOW.purple};
          border: 3px solid #0E0B1A;
          box-shadow: 0 0 14px ${GLOW.purple};
          cursor: pointer;
        }
        .glow-range:focus-visible {
          outline: 2px solid ${GLOW.green};
          outline-offset: 4px;
        }
      `}</style>
    </div>
  );
}
