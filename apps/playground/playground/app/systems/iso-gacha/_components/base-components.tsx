"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Coins, CheckCircle2, Minus, Plus } from "lucide-react";
import { ISO, SPRING, brl, odd } from "./tokens";
import { IsoCard, IsoTag, IsoButton, IsoTilt, IsoCube } from "./iso-primitives";
import { IsoTrophy } from "./iso-trophy";

/* ───────── botões com feedback real ───────── */
const BUTTONS = [
  {
    id: "bet",
    label: "Fazer aposta",
    done: "Aposta feita!",
    bg: ISO.green,
    fg: ISO.ink,
    shadow: ISO.greenDeep,
    Icon: Zap,
  },
  {
    id: "cash",
    label: "Cash out",
    done: "Sacado!",
    bg: ISO.yellow,
    fg: ISO.ink,
    shadow: ISO.yellowDeep,
    Icon: Coins,
  },
  {
    id: "checkin",
    label: "Check-in",
    done: "Registrado!",
    bg: ISO.purple,
    fg: "#FFFFFF",
    shadow: ISO.purpleDeep,
    Icon: CheckCircle2,
  },
] as const;

function ButtonsCard() {
  // último botão tocado -> mostra confirmação por ~1.2s
  const [fired, setFired] = useState<string | null>(null);

  function fire(id: string) {
    setFired(id);
    window.setTimeout(() => setFired((f) => (f === id ? null : f)), 1200);
  }

  return (
    <IsoCard className="flex flex-col gap-3 p-6" shadow={ISO.purpleDeep}>
      <IsoTag>Botões · tocáveis</IsoTag>
      {BUTTONS.map((b) => {
        const on = fired === b.id;
        return (
          <IsoButton
            key={b.id}
            bg={on ? ISO.green : b.bg}
            fg={on ? ISO.ink : b.fg}
            shadow={on ? ISO.greenDeep : b.shadow}
            onClick={() => fire(b.id)}
          >
            {on ? (
              <>
                <CheckCircle2 size={16} className="mr-1 inline" strokeWidth={2.8} /> {b.done}
              </>
            ) : (
              <>
                <b.Icon size={16} className="mr-1 inline" fill={b.id === "bet" ? b.fg : "none"} />{" "}
                {b.label}
              </>
            )}
          </IsoButton>
        );
      })}
    </IsoCard>
  );
}

/* ───────── chips de cotação selecionáveis + badges que alternam ───────── */
const CHIPS = [odd(1.85), odd(2.4), odd(3.1)];
const BADGES = [
  { id: "green", label: "Deu green", bg: ISO.green, fg: ISO.ink },
  { id: "red", label: "Red", bg: ISO.coral, fg: "#FFFFFF" },
  { id: "live", label: "Ao vivo", bg: ISO.yellow, fg: ISO.ink },
] as const;

function ChipsCard() {
  const [pickedChip, setPickedChip] = useState<string | null>(odd(2.4));
  const [activeBadges, setActiveBadges] = useState<Record<string, boolean>>({
    green: true,
    red: false,
    live: true,
  });

  function toggleBadge(id: string) {
    setActiveBadges((s) => ({ ...s, [id]: !s[id] }));
  }

  return (
    <IsoCard className="flex flex-col gap-3 p-6" shadow={ISO.green}>
      <IsoTag bg={ISO.green} fg={ISO.ink}>
        Chips · selecionáveis
      </IsoTag>
      <div className="flex flex-wrap gap-2">
        {CHIPS.map((o) => {
          const on = pickedChip === o;
          return (
            <motion.button
              key={o}
              type="button"
              onClick={() => setPickedChip((p) => (p === o ? null : o))}
              whileTap={{ scale: 0.92 }}
              transition={SPRING}
              className="touch-manipulation rounded-lg px-3.5 py-2 font-[family-name:var(--font-display)] text-sm font-bold tabular-nums"
              style={{
                minHeight: 44,
                background: on ? ISO.purple : ISO.base,
                color: on ? "#FFFFFF" : ISO.purple,
                border: `2px solid ${ISO.ink}`,
                boxShadow: on ? `2px 3px 0 ${ISO.purpleDeep}` : "none",
              }}
              aria-pressed={on}
            >
              {o}
            </motion.button>
          );
        })}
      </div>
      <p className="text-xs" style={{ color: ISO.inkSoft }}>
        {pickedChip ? (
          <>
            Cotação ativa <strong style={{ color: ISO.purple }}>{pickedChip}</strong>
          </>
        ) : (
          <>Toque numa cotação pra selecionar.</>
        )}
      </p>

      <p
        className="mt-1 text-[11px] font-bold uppercase tracking-widest"
        style={{ color: ISO.inkSoft }}
      >
        Badges · toque pra alternar
      </p>
      <div className="flex flex-wrap gap-2">
        {BADGES.map((b) => {
          const on = activeBadges[b.id];
          return (
            <motion.button
              key={b.id}
              type="button"
              onClick={() => toggleBadge(b.id)}
              whileTap={{ scale: 0.92 }}
              transition={SPRING}
              className="inline-flex touch-manipulation items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold uppercase"
              style={{
                minHeight: 36,
                background: on ? b.bg : "transparent",
                color: on ? b.fg : ISO.inkSoft,
                border: `2px solid ${on ? ISO.ink : ISO.baseDeep}`,
                opacity: on ? 1 : 0.7,
              }}
              aria-pressed={on}
            >
              {on && <CheckCircle2 size={11} strokeWidth={3} />} {b.label}
            </motion.button>
          );
        })}
      </div>
    </IsoCard>
  );
}

/* ───────── input de stake funcional ───────── */
const SMIN = 20;
const SMAX = 500;
const SSTEP = 10;

function StakeCard() {
  const [stake, setStake] = useState(100);
  function bump(dir: 1 | -1) {
    setStake((s) => Math.max(SMIN, Math.min(SMAX, s + dir * SSTEP)));
  }
  return (
    <IsoCard className="flex flex-col gap-3 p-6" shadow={ISO.yellowDeep}>
      <IsoTag bg={ISO.yellow} fg={ISO.ink}>
        Input · Stake
      </IsoTag>
      <div className="flex items-center gap-2">
        <motion.button
          type="button"
          onClick={() => bump(-1)}
          disabled={stake <= SMIN}
          whileTap={{ scale: 0.9, y: 2 }}
          transition={SPRING}
          className="grid h-11 w-11 touch-manipulation place-items-center rounded-2xl font-[family-name:var(--font-display)] disabled:opacity-40"
          style={{
            background: ISO.purple,
            color: "#FFFFFF",
            border: `2.5px solid ${ISO.ink}`,
          }}
          aria-label="Diminuir stake"
        >
          <Minus size={18} strokeWidth={3} />
        </motion.button>
        <div
          className="flex flex-1 items-center justify-center rounded-2xl py-2"
          style={{ background: ISO.base, border: `2.5px solid ${ISO.ink}` }}
        >
          <motion.span
            key={stake}
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            transition={SPRING}
            className="font-[family-name:var(--font-display)] text-2xl font-bold tabular-nums"
            style={{ color: ISO.ink }}
          >
            {brl(stake, false)}
          </motion.span>
        </div>
        <motion.button
          type="button"
          onClick={() => bump(1)}
          disabled={stake >= SMAX}
          whileTap={{ scale: 0.9, y: 2 }}
          transition={SPRING}
          className="grid h-11 w-11 touch-manipulation place-items-center rounded-2xl font-[family-name:var(--font-display)] disabled:opacity-40"
          style={{
            background: ISO.purple,
            color: "#FFFFFF",
            border: `2.5px solid ${ISO.ink}`,
          }}
          aria-label="Aumentar stake"
        >
          <Plus size={18} strokeWidth={3} />
        </motion.button>
      </div>
      <p className="text-xs" style={{ color: ISO.inkSoft }}>
        Stepper toque-amigável (≥44px). Funciona de verdade.
      </p>
    </IsoCard>
  );
}

/* ───────── troféus selecionáveis ───────── */
const TROPHIES = [
  { id: "gold", metal: ISO.yellow, metalDeep: ISO.yellowDeep, label: "Ouro" },
  { id: "silver", metal: "#C0C6D4", metalDeep: "#8A93A6", label: "Prata" },
  { id: "bronze", metal: ISO.coral, metalDeep: ISO.coralDeep, label: "Bronze" },
] as const;

function TrophyCard() {
  const [picked, setPicked] = useState<string>("gold");
  const sel = TROPHIES.find((t) => t.id === picked) ?? TROPHIES[0];
  return (
    <IsoCard className="flex flex-col items-center gap-3 p-6" shadow={ISO.yellowDeep}>
      <IsoTag bg={ISO.yellow} fg={ISO.ink}>
        Troféus · escolha
      </IsoTag>
      <div className="flex items-end gap-3">
        {TROPHIES.map((t) => {
          const on = t.id === picked;
          return (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => setPicked(t.id)}
              whileTap={{ scale: 0.9 }}
              animate={{ y: on ? -6 : 0, scale: on ? 1.05 : 0.9 }}
              transition={SPRING}
              className="touch-manipulation rounded-xl p-1"
              style={{
                border: `2px solid ${on ? ISO.ink : "transparent"}`,
                background: on ? ISO.base : "transparent",
                minHeight: 44,
              }}
              aria-pressed={on}
              aria-label={`Troféu ${t.label}`}
            >
              <IsoTrophy size={56} metal={t.metal} metalDeep={t.metalDeep} />
            </motion.button>
          );
        })}
      </div>
      <p className="text-xs" style={{ color: ISO.inkSoft }}>
        Selecionado: <strong style={{ color: sel.metalDeep }}>{sel.label}</strong>
      </p>
    </IsoCard>
  );
}

/* ───────── bet slip mini com retorno editável ───────── */
const MINI_STAKES = [50, 100, 200];

function MiniSlipCard() {
  const [stake, setStake] = useState(100);
  const cot = 2.4;
  const payout = Math.round(stake * cot);
  return (
    <IsoCard className="overflow-hidden p-0" shadow={ISO.purple}>
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ background: ISO.ink }}
      >
        <span className="flex items-center gap-1.5 font-[family-name:var(--font-display)] text-sm font-bold text-white">
          <Zap size={13} color={ISO.yellow} fill={ISO.yellow} /> Cupom · ao vivo
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
          style={{ background: ISO.green, color: ISO.ink }}
        >
          simples
        </span>
      </div>
      <div className="p-4">
        <p className="text-sm font-bold" style={{ color: ISO.ink }}>
          Perder 8 kg em 4 meses
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {MINI_STAKES.map((v) => {
            const on = v === stake;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setStake(v)}
                className="touch-manipulation rounded-full px-3 py-1.5 text-xs font-bold tabular-nums"
                style={{
                  minHeight: 36,
                  background: on ? ISO.purple : "#FFFFFF",
                  color: on ? "#FFFFFF" : ISO.inkSoft,
                  border: `2px solid ${on ? ISO.purple : ISO.baseDeep}`,
                }}
                aria-pressed={on}
              >
                {brl(v, false)}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span style={{ color: ISO.inkSoft }}>banca {brl(stake, false)}</span>
          <span className="font-bold tabular-nums" style={{ color: ISO.purple }}>
            {odd(cot)}
          </span>
        </div>
        <div
          className="mt-2 flex items-center justify-between rounded-xl px-3 py-2"
          style={{ background: ISO.base }}
        >
          <span className="text-xs font-bold uppercase" style={{ color: ISO.inkSoft }}>
            retorno
          </span>
          <motion.span
            key={payout}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={SPRING}
            className="font-[family-name:var(--font-display)] text-lg font-bold tabular-nums"
            style={{ color: ISO.greenDeep }}
          >
            {brl(payout, false)}
          </motion.span>
        </div>
      </div>
    </IsoCard>
  );
}

/**
 * BaseComponents — mostruário do style guide com TUDO interativo: botões dão
 * feedback ao toque, chips de cotação são selecionáveis, badges alternam,
 * stepper de stake funciona, troféus são escolhíveis e o mini-cupom recalcula
 * o retorno ao vivo. Nada decorativo.
 */
export function BaseComponents() {
  return (
    <div className="mt-12">
      <div className="mb-4 flex items-center gap-2">
        <p className="text-sm font-bold uppercase tracking-widest" style={{ color: ISO.inkSoft }}>
          Componentes
        </p>
        <span className="text-xs font-medium" style={{ color: ISO.inkSoft }}>
          · todos funcionam
        </span>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <ButtonsCard />
        <ChipsCard />
        <StakeCard />

        {/* card 3D com tilt */}
        <IsoTilt>
          <IsoCard className="p-6" shadow={ISO.green} bg="#FFFFFF">
            <IsoTag bg={ISO.coral} fg="#FFFFFF">
              Card 3D
            </IsoTag>
            <div className="mt-3 flex items-center gap-3">
              <IsoCube size={52} top="#54EFB0" left={ISO.green} right={ISO.greenDeep} />
              <div>
                <p className="font-[family-name:var(--font-display)] text-lg font-bold">
                  Perna da múltipla
                </p>
                <p className="text-sm" style={{ color: ISO.inkSoft }}>
                  Toque ou arraste pra inclinar em 3D.
                </p>
              </div>
            </div>
          </IsoCard>
        </IsoTilt>

        <TrophyCard />
        <MiniSlipCard />
      </div>
    </div>
  );
}
