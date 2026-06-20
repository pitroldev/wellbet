"use client";

import { useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import {
  Home,
  Ticket,
  Trophy,
  User,
  Flame,
  Zap,
  TrendingUp,
  Minus,
  Plus,
  CheckCircle2,
  ChevronLeft,
  RotateCcw,
  Share2,
  PartyPopper,
} from "lucide-react";
import { USERS } from "@/lib/avatars";
import { ISO, SPRING, brl, odd } from "./tokens";
import { IsoCube } from "./iso-primitives";
import { IsoAvatarCircle } from "./iso-avatar";
import { Confetti } from "./confetti";

/* ════════ estado do mini-app ════════ */
type Screen = "home" | "bet" | "confirm" | "green" | "rank";

type Goal = {
  id: string;
  emoji: string;
  title: string;
  detail: string;
  baseOdd: number;
};

const GOALS: Goal[] = [
  {
    id: "peso",
    emoji: "🔥",
    title: "Perder 8 kg em 4 meses",
    detail: "3 treinos/semana + dieta",
    baseOdd: 2.4,
  },
  {
    id: "corrida",
    emoji: "🏃",
    title: "Correr 100 km no mês",
    detail: "check-in a cada corrida",
    baseOdd: 1.85,
  },
  {
    id: "forca",
    emoji: "🏋️",
    title: "Treinar 5x/semana",
    detail: "musculação registrada",
    baseOdd: 3.1,
  },
];

const STAKES = [50, 100, 200, 350];
const SMIN = 20;
const SMAX = 500;
const SSTEP = 10;
const START_BALANCE = 340;

/**
 * PhonePrototype — mini-app JOGÁVEL da Charya dentro de uma moldura de celular.
 * Fluxo real de aposta com estado (useState) e transições (AnimatePresence):
 * home (saldo + aposta ativa) → nova aposta → cupom (ajustar stake/cotação,
 * retorno ao vivo) → confirmação → DEU GREEN (payout + confete) → apostar de
 * novo. A tab bar troca de tela; tudo toca e responde. Estilo Iso-Gacha.
 */
export function PhonePrototype() {
  const me = USERS[4];

  const [screen, setScreen] = useState<Screen>("home");
  const [dir, setDir] = useState(1); // direção da transição (1 avança, -1 volta)
  const [goalId, setGoalId] = useState(GOALS[0].id);
  const [stake, setStake] = useState(100);
  const [balance, setBalance] = useState(START_BALANCE);
  const [hasActive, setHasActive] = useState(true);
  const [confettiKey, setConfettiKey] = useState(0);

  const goal = GOALS.find((g) => g.id === goalId) ?? GOALS[0];
  const liveOdd = goal.baseOdd + Math.min(0.6, (stake - SMIN) / 1000);
  const payout = Math.round(stake * liveOdd);

  function go(next: Screen, direction: 1 | -1 = 1) {
    setDir(direction);
    setScreen(next);
  }

  function bump(d: 1 | -1) {
    setStake((s) => Math.max(SMIN, Math.min(SMAX, s + d * SSTEP)));
  }

  function placeBet() {
    // debita o stake da banca SÓ no handler (sem efeitos no render)
    setBalance((b) => Math.max(0, b - stake));
    setHasActive(true);
    go("confirm", 1);
  }

  function settleGreen() {
    setBalance((b) => b + payout);
    setConfettiKey((k) => k + 1);
    go("green", 1);
  }

  function restart() {
    setStake(100);
    setGoalId(GOALS[0].id);
    go("home", -1);
  }

  // variantes de slide entre telas (spring)
  const variants = {
    enter: (d: number) => ({ x: d * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d * -60, opacity: 0 }),
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col items-center gap-3 w-full">
        <div
          className="relative w-full max-w-[380px] overflow-hidden rounded-[2.6rem]"
          style={{
            aspectRatio: "1206 / 2622",
            background: ISO.base,
            border: `5px solid ${ISO.ink}`,
            boxShadow: `12px 14px 0 ${ISO.purpleDeep}`,
          }}
        >
          {/* notch */}
          <div className="pointer-events-none absolute left-1/2 top-0 z-40 -translate-x-1/2">
            <div className="mt-1.5 h-5 w-28 rounded-full" style={{ background: ISO.ink }} />
          </div>
          {/* status bar */}
          <div
            className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-6 pt-2.5 text-[11px] font-bold"
            style={{ color: screen === "green" ? ISO.ink : ISO.ink }}
          >
            <span className="tabular-nums">9:41</span>
            <span className="tabular-nums">5G</span>
          </div>

          {/* confete global do payout (acima de tudo, dentro da moldura) */}
          {confettiKey > 0 && screen === "green" && (
            <div className="pointer-events-none absolute inset-0 z-40">
              <Confetti key={confettiKey} count={44} />
            </div>
          )}

          {/* área de telas */}
          <div className="absolute inset-0 flex flex-col pt-9">
            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div
                  key={screen}
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={SPRING}
                  className="absolute inset-0 overflow-y-auto"
                >
                  {screen === "home" && (
                    <HomeScreen
                      me={me}
                      balance={balance}
                      hasActive={hasActive}
                      activeGoal={goal}
                      activeOdd={liveOdd}
                      onNew={() => go("bet", 1)}
                    />
                  )}
                  {screen === "bet" && (
                    <BetScreen
                      goalId={goalId}
                      stake={stake}
                      liveOdd={liveOdd}
                      payout={payout}
                      balance={balance}
                      onPickGoal={setGoalId}
                      onPickStake={setStake}
                      onBump={bump}
                      onBack={() => go("home", -1)}
                      onPlace={placeBet}
                    />
                  )}
                  {screen === "confirm" && (
                    <ConfirmScreen
                      goal={goal}
                      stake={stake}
                      liveOdd={liveOdd}
                      payout={payout}
                      onSettle={settleGreen}
                      onHome={() => go("home", -1)}
                    />
                  )}
                  {screen === "green" && (
                    <GreenScreen
                      me={me}
                      goal={goal}
                      stake={stake}
                      liveOdd={liveOdd}
                      payout={payout}
                      balance={balance}
                      onAgain={restart}
                      onRank={() => go("rank", 1)}
                    />
                  )}
                  {screen === "rank" && <RankScreen me={me} onBack={() => go("home", -1)} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* tab bar — funcional, troca de tela */}
            <TabBar screen={screen} onGo={go} />
          </div>
        </div>

        <span
          className="text-center text-xs font-bold uppercase tracking-widest mt-6"
          style={{ color: ISO.inkSoft }}
        >
          App jogável · toque e percorra o fluxo
        </span>
      </div>
    </MotionConfig>
  );
}

/* ════════ TAB BAR ════════ */
function TabBar({ screen, onGo }: { screen: Screen; onGo: (s: Screen, d?: 1 | -1) => void }) {
  const tabs = [
    { id: "home" as const, Icon: Home, label: "Início" },
    { id: "bet" as const, Icon: Ticket, label: "Cupom" },
    { id: "rank" as const, Icon: Trophy, label: "Ranking" },
    { id: "me" as const, Icon: User, label: "Perfil" },
  ];
  // "green"/"confirm" iluminam Perfil (jornada pessoal)
  const activeTab: "home" | "bet" | "rank" | "me" =
    screen === "home" ? "home" : screen === "bet" ? "bet" : screen === "rank" ? "rank" : "me";

  function tap(id: "home" | "bet" | "rank" | "me") {
    if (id === "home") onGo("home", -1);
    else if (id === "bet") onGo("bet", 1);
    else if (id === "rank") onGo("rank", 1);
    else onGo("home", -1); // "perfil" placeholder volta pra home no protótipo
  }

  return (
    <div
      className="z-30 flex items-stretch justify-around px-2 py-2"
      style={{ background: "#FFFFFF", borderTop: `3px solid ${ISO.ink}` }}
    >
      {tabs.map((t) => {
        const on = t.id === activeTab;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => tap(t.id)}
            className="flex flex-1 touch-manipulation flex-col items-center gap-0.5 py-1"
            style={{ minHeight: 44 }}
            aria-label={t.label}
            aria-pressed={on}
          >
            <motion.span
              animate={{ scale: on ? 1 : 0.92 }}
              transition={SPRING}
              className="grid h-9 w-9 place-items-center rounded-xl"
              style={{
                background: on ? ISO.purple : "transparent",
                color: on ? "#FFFFFF" : ISO.inkSoft,
                border: on ? `2px solid ${ISO.ink}` : "2px solid transparent",
              }}
            >
              <t.Icon size={18} strokeWidth={2.5} />
            </motion.span>
            <span className="text-[9px] font-bold" style={{ color: on ? ISO.ink : ISO.inkSoft }}>
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ════════ HOME ════════ */
function HomeScreen({
  me,
  balance,
  hasActive,
  activeGoal,
  activeOdd,
  onNew,
}: {
  me: (typeof USERS)[number];
  balance: number;
  hasActive: boolean;
  activeGoal: Goal;
  activeOdd: number;
  onNew: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col pb-3">
      {/* header */}
      <div className="flex items-center justify-between px-4 pb-3 pt-1">
        <div className="flex items-center gap-2.5">
          <IsoAvatarCircle src={me.avatar} alt={me.name} size={40} ring={ISO.green} />
          <div>
            <p className="text-[11px] leading-none" style={{ color: ISO.inkSoft }}>
              Bom treino,
            </p>
            <p
              className="font-[family-name:var(--font-display)] text-base font-bold leading-tight"
              style={{ color: ISO.ink }}
            >
              {me.name.split(" ")[0]}
            </p>
          </div>
        </div>
        <span
          className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold"
          style={{
            background: ISO.yellow,
            color: ISO.ink,
            border: `2px solid ${ISO.ink}`,
          }}
        >
          <Flame size={13} strokeWidth={2.8} /> 34
        </span>
      </div>

      {/* banca (atualiza com as apostas) */}
      <div className="px-4">
        <div
          className="flex items-center justify-between rounded-3xl p-4"
          style={{
            background: ISO.purple,
            border: `3px solid ${ISO.ink}`,
            boxShadow: `5px 6px 0 ${ISO.purpleDeep}`,
          }}
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
              Sua banca
            </p>
            <motion.p
              key={balance}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={SPRING}
              className="font-[family-name:var(--font-display)] text-3xl font-bold leading-none text-white tabular-nums"
            >
              {brl(balance, false)}
            </motion.p>
          </div>
          <IsoCube size={56} top={ISO.yellow} left={ISO.yellowDeep} right="#B07C09" />
        </div>
      </div>

      {/* aposta ativa */}
      <div className="mt-4 px-4">
        <p
          className="mb-2 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: ISO.inkSoft }}
        >
          Sua aposta ativa
        </p>
        {hasActive ? (
          <div
            className="rounded-2xl p-3.5"
            style={{
              background: "#FFFFFF",
              border: `2.5px solid ${ISO.ink}`,
              boxShadow: `4px 5px 0 ${ISO.green}`,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold" style={{ color: ISO.ink }}>
                {activeGoal.emoji} {activeGoal.title}
              </span>
              <span
                className="shrink-0 rounded-lg px-2 py-0.5 text-xs font-bold tabular-nums"
                style={{
                  background: ISO.base,
                  color: ISO.purple,
                  border: `2px solid ${ISO.baseDeep}`,
                }}
              >
                {odd(activeOdd)}
              </span>
            </div>
            <div
              className="mt-3 h-3.5 w-full overflow-hidden rounded-full"
              style={{ background: ISO.base, border: `2px solid ${ISO.ink}` }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "62%" }}
                transition={{ ...SPRING, delay: 0.1 }}
                className="h-full rounded-full"
                style={{ background: ISO.green }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span style={{ color: ISO.inkSoft }}>62% da meta</span>
              <span className="font-bold tabular-nums" style={{ color: ISO.greenDeep }}>
                <TrendingUp size={11} className="mr-0.5 inline" /> retorno{" "}
                {brl(Math.round(activeGoal.baseOdd * 200), false)}
              </span>
            </div>
          </div>
        ) : (
          <div
            className="rounded-2xl p-4 text-center"
            style={{
              background: "#FFFFFF",
              border: `2.5px dashed ${ISO.baseDeep}`,
            }}
          >
            <p className="text-sm font-semibold" style={{ color: ISO.inkSoft }}>
              Nenhuma aposta ativa. Que tal apostar em você?
            </p>
          </div>
        )}
      </div>

      {/* acumuladora mini */}
      <div className="mt-4 px-4">
        <p
          className="mb-2 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: ISO.inkSoft }}
        >
          Acumuladora da semana
        </p>
        <div
          className="flex items-end justify-between gap-1 rounded-2xl p-3"
          style={{ background: "#FFFFFF", border: `2.5px solid ${ISO.ink}` }}
        >
          {["S", "T", "Q", "Q", "S", "S", "D"].map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              {i < 4 ? (
                <IsoCube size={20} top="#54EFB0" left={ISO.green} right={ISO.greenDeep} />
              ) : (
                <div
                  className="h-3.5 w-3.5 rounded-md"
                  style={{
                    background: ISO.base,
                    border: `2px dashed ${ISO.baseDeep}`,
                  }}
                />
              )}
              <span
                className="text-[9px] font-bold"
                style={{ color: i < 4 ? ISO.greenDeep : ISO.inkSoft }}
              >
                {d}
              </span>
            </div>
          ))}
          <div className="ml-1 text-right">
            <p
              className="font-[family-name:var(--font-display)] text-xl font-bold leading-none"
              style={{ color: ISO.purple }}
            >
              2.12x
            </p>
            <p className="text-[9px]" style={{ color: ISO.inkSoft }}>
              multi
            </p>
          </div>
        </div>
      </div>

      {/* CTA: nova aposta */}
      <div className="mt-auto px-4 pt-4">
        <motion.button
          type="button"
          onClick={onNew}
          whileTap={{ scale: 0.96, y: 3 }}
          transition={SPRING}
          className="flex w-full touch-manipulation items-center justify-center gap-2 rounded-2xl py-3.5 font-[family-name:var(--font-display)] text-base font-bold uppercase"
          style={{
            minHeight: 52,
            background: ISO.green,
            color: ISO.ink,
            border: `3px solid ${ISO.ink}`,
            boxShadow: `0 5px 0 ${ISO.greenDeep}`,
          }}
        >
          <Plus size={18} strokeWidth={3} /> Nova aposta
        </motion.button>
      </div>
    </div>
  );
}

/* ════════ CUPOM / NOVA APOSTA ════════ */
function BetScreen({
  goalId,
  stake,
  liveOdd,
  payout,
  balance,
  onPickGoal,
  onPickStake,
  onBump,
  onBack,
  onPlace,
}: {
  goalId: string;
  stake: number;
  liveOdd: number;
  payout: number;
  balance: number;
  onPickGoal: (id: string) => void;
  onPickStake: (v: number) => void;
  onBump: (d: 1 | -1) => void;
  onBack: () => void;
  onPlace: () => void;
}) {
  const tooBroke = stake > balance;
  return (
    <div className="flex min-h-full flex-col pb-3">
      {/* header com voltar */}
      <div className="flex items-center gap-2 px-3 pb-2 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="grid h-9 w-9 touch-manipulation place-items-center rounded-xl"
          style={{
            background: "#FFFFFF",
            border: `2px solid ${ISO.ink}`,
            minHeight: 44,
            minWidth: 44,
          }}
          aria-label="Voltar"
        >
          <ChevronLeft size={18} strokeWidth={2.8} color={ISO.ink} />
        </button>
        <div>
          <p
            className="font-[family-name:var(--font-display)] text-lg font-bold leading-none"
            style={{ color: ISO.ink }}
          >
            Montar cupom
          </p>
          <p className="text-[11px]" style={{ color: ISO.inkSoft }}>
            Aposte em você. A casa torce a favor.
          </p>
        </div>
      </div>

      {/* metas selecionáveis */}
      <div className="px-4">
        <p
          className="mb-1.5 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: ISO.inkSoft }}
        >
          No que você aposta
        </p>
        <div className="flex flex-col gap-2">
          {GOALS.map((g) => {
            const on = g.id === goalId;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => onPickGoal(g.id)}
                className="flex touch-manipulation items-center gap-2.5 rounded-2xl px-3 py-2 text-left"
                style={{
                  minHeight: 48,
                  background: on ? ISO.base : "#FFFFFF",
                  border: `2.5px solid ${on ? ISO.purple : ISO.baseDeep}`,
                  boxShadow: on ? `3px 4px 0 ${ISO.purple}` : "none",
                }}
                aria-pressed={on}
              >
                <span className="text-lg" aria-hidden>
                  {g.emoji}
                </span>
                <span className="flex-1">
                  <span
                    className="block text-[13px] font-bold leading-tight"
                    style={{ color: ISO.ink }}
                  >
                    {g.title}
                  </span>
                  <span className="block text-[11px]" style={{ color: ISO.inkSoft }}>
                    {g.detail}
                  </span>
                </span>
                <span
                  className="shrink-0 rounded-lg px-2 py-1 font-[family-name:var(--font-display)] text-xs font-bold tabular-nums"
                  style={{
                    background: on ? ISO.purple : ISO.base,
                    color: on ? "#FFFFFF" : ISO.inkSoft,
                    border: `2px solid ${ISO.ink}`,
                  }}
                >
                  {odd(g.baseOdd)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* stake stepper */}
      <div className="mt-3 px-4">
        <p
          className="mb-1.5 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: ISO.inkSoft }}
        >
          Banca (stake)
        </p>
        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            onClick={() => onBump(-1)}
            disabled={stake <= SMIN}
            whileTap={{ scale: 0.9, y: 2 }}
            transition={SPRING}
            className="grid h-11 w-11 touch-manipulation place-items-center rounded-2xl disabled:opacity-40"
            style={{
              background: ISO.purple,
              color: "#FFFFFF",
              border: `2.5px solid ${ISO.ink}`,
              boxShadow: `0 4px 0 ${ISO.purpleDeep}`,
            }}
            aria-label="Diminuir stake"
          >
            <Minus size={20} strokeWidth={3} />
          </motion.button>
          <div
            className="flex flex-1 items-center justify-center rounded-2xl py-2"
            style={{ background: "#FFFFFF", border: `2.5px solid ${ISO.ink}` }}
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
            onClick={() => onBump(1)}
            disabled={stake >= SMAX}
            whileTap={{ scale: 0.9, y: 2 }}
            transition={SPRING}
            className="grid h-11 w-11 touch-manipulation place-items-center rounded-2xl disabled:opacity-40"
            style={{
              background: ISO.purple,
              color: "#FFFFFF",
              border: `2.5px solid ${ISO.ink}`,
              boxShadow: `0 4px 0 ${ISO.purpleDeep}`,
            }}
            aria-label="Aumentar stake"
          >
            <Plus size={20} strokeWidth={3} />
          </motion.button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {STAKES.map((v) => {
            const on = v === stake;
            return (
              <button
                key={v}
                type="button"
                onClick={() => onPickStake(v)}
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
      </div>

      {/* cotação + retorno ao vivo */}
      <div className="mt-3 px-4">
        <div
          className="grid grid-cols-2 gap-2 rounded-2xl p-3.5"
          style={{
            background: ISO.base,
            border: `2.5px solid ${ISO.baseDeep}`,
          }}
        >
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: ISO.inkSoft }}
            >
              Cotação
            </p>
            <motion.p
              key={Math.round(liveOdd * 100)}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={SPRING}
              className="font-[family-name:var(--font-display)] text-2xl font-bold leading-none tabular-nums"
              style={{ color: ISO.purple }}
            >
              {odd(liveOdd)}
            </motion.p>
          </div>
          <div className="text-right">
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: ISO.inkSoft }}
            >
              Retorno
            </p>
            <motion.p
              key={payout}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={SPRING}
              className="font-[family-name:var(--font-display)] text-2xl font-bold leading-none tabular-nums"
              style={{ color: ISO.greenDeep }}
            >
              {brl(payout, false)}
            </motion.p>
          </div>
        </div>
      </div>

      {/* fazer aposta */}
      <div className="mt-auto px-4 pt-3">
        <motion.button
          type="button"
          onClick={onPlace}
          disabled={tooBroke}
          whileTap={tooBroke ? undefined : { scale: 0.96, y: 3 }}
          transition={SPRING}
          className="flex w-full touch-manipulation items-center justify-center gap-2 rounded-2xl py-3.5 font-[family-name:var(--font-display)] text-base font-bold uppercase disabled:opacity-50"
          style={{
            minHeight: 52,
            background: ISO.green,
            color: ISO.ink,
            border: `3px solid ${ISO.ink}`,
            boxShadow: `0 5px 0 ${ISO.greenDeep}`,
          }}
        >
          <Zap size={18} fill={ISO.ink} /> {tooBroke ? "Banca insuficiente" : "Fazer aposta"}
        </motion.button>
      </div>
    </div>
  );
}

/* ════════ CONFIRMAÇÃO (cofre fecha = aposta selada) ════════ */
function ConfirmScreen({
  goal,
  stake,
  liveOdd,
  payout,
  onSettle,
  onHome,
}: {
  goal: Goal;
  stake: number;
  liveOdd: number;
  payout: number;
  onSettle: () => void;
  onHome: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col px-5 pb-3 pt-2">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.4, rotate: -8, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 340, damping: 14 }}
          className="grid h-20 w-20 place-items-center rounded-3xl"
          style={{
            background: ISO.green,
            border: `3px solid ${ISO.ink}`,
            boxShadow: `0 6px 0 ${ISO.greenDeep}`,
          }}
        >
          <CheckCircle2 size={44} color={ISO.ink} strokeWidth={2.6} />
        </motion.div>

        <p
          className="mt-5 font-[family-name:var(--font-display)] text-2xl font-bold leading-tight"
          style={{ color: ISO.ink }}
        >
          Aposta selada!
        </p>
        <p className="mt-1.5 text-sm" style={{ color: ISO.inkSoft }}>
          {goal.emoji} {goal.title}
        </p>

        <div
          className="mt-5 w-full rounded-2xl p-4"
          style={{
            background: "#FFFFFF",
            border: `3px solid ${ISO.ink}`,
            boxShadow: `5px 6px 0 ${ISO.purpleDeep}`,
          }}
        >
          <Row label="Banca apostada" value={brl(stake, false)} />
          <Row label="Cotação" value={odd(liveOdd)} color={ISO.purple} />
          <div className="my-2 h-px" style={{ background: ISO.baseDeep }} />
          <Row label="Pode pagar" value={brl(payout, false)} big color={ISO.greenDeep} />
        </div>

        <p className="mt-4 text-xs" style={{ color: ISO.inkSoft }}>
          No app, você bate check-ins até cumprir a meta. Aqui, simule o desfecho:
        </p>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <motion.button
          type="button"
          onClick={onSettle}
          whileTap={{ scale: 0.96, y: 3 }}
          transition={SPRING}
          className="flex w-full touch-manipulation items-center justify-center gap-2 rounded-2xl py-3.5 font-[family-name:var(--font-display)] text-base font-bold uppercase"
          style={{
            minHeight: 52,
            background: ISO.green,
            color: ISO.ink,
            border: `3px solid ${ISO.ink}`,
            boxShadow: `0 5px 0 ${ISO.greenDeep}`,
          }}
        >
          <PartyPopper size={18} /> Cumpri a meta · deu green
        </motion.button>
        <button
          type="button"
          onClick={onHome}
          className="w-full touch-manipulation rounded-2xl py-2.5 text-sm font-bold"
          style={{
            minHeight: 44,
            color: ISO.inkSoft,
            border: `2px solid ${ISO.baseDeep}`,
          }}
        >
          Voltar ao início
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  color = ISO.ink,
  big,
}: {
  label: string;
  value: string;
  color?: string;
  big?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span
        className="text-xs font-semibold uppercase tracking-wide"
        style={{ color: ISO.inkSoft }}
      >
        {label}
      </span>
      <span
        className={
          big
            ? "font-[family-name:var(--font-display)] text-xl font-bold tabular-nums"
            : "font-bold tabular-nums"
        }
        style={{ color }}
      >
        {value}
      </span>
    </div>
  );
}

/* ════════ DEU GREEN (payout + celebração) ════════ */
function GreenScreen({
  me,
  goal,
  stake,
  liveOdd,
  payout,
  balance,
  onAgain,
  onRank,
}: {
  me: (typeof USERS)[number];
  goal: Goal;
  stake: number;
  liveOdd: number;
  payout: number;
  balance: number;
  onAgain: () => void;
  onRank: () => void;
}) {
  return (
    <div
      className="flex min-h-full flex-col px-5 pb-3 pt-2 text-center"
      style={{ background: ISO.green }}
    >
      <div className="flex flex-1 flex-col items-center justify-center">
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          <IsoCube size={92} top="#FFE08A" left={ISO.yellow} right={ISO.yellowDeep} />
        </motion.div>
        <motion.p
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 13 }}
          className="mt-5 font-[family-name:var(--font-display)] text-4xl font-bold leading-none"
          style={{ color: ISO.ink }}
        >
          DEU GREEN!
        </motion.p>
        <p className="mt-2 text-sm font-semibold" style={{ color: ISO.ink }}>
          Você cumpriu “{goal.title}”.
        </p>

        <div
          className="mt-5 w-full rounded-3xl p-5"
          style={{
            background: "#FFFFFF",
            border: `3px solid ${ISO.ink}`,
            boxShadow: `6px 7px 0 ${ISO.greenDeep}`,
          }}
        >
          <p
            className="text-[11px] font-bold uppercase tracking-widest"
            style={{ color: ISO.inkSoft }}
          >
            Pago na sua banca
          </p>
          <motion.p
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{ ...SPRING, delay: 0.15 }}
            className="font-[family-name:var(--font-display)] text-4xl font-bold leading-none tabular-nums"
            style={{ color: ISO.greenDeep }}
          >
            {brl(payout, false)}
          </motion.p>
          <div
            className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold"
            style={{ color: ISO.inkSoft }}
          >
            <CheckCircle2 size={13} color={ISO.greenDeep} /> banca {brl(stake, false)} · cotação{" "}
            {odd(liveOdd)}
          </div>
          <div
            className="mt-2 rounded-xl px-3 py-1.5 text-xs font-bold"
            style={{ background: ISO.base, color: ISO.purple }}
          >
            Nova banca: <span className="tabular-nums">{brl(balance, false)}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <IsoAvatarCircle src={me.avatar} alt={me.name} size={32} ring={ISO.yellow} />
          <span className="text-xs font-bold" style={{ color: ISO.ink }}>
            {me.name} apostou em si — e ganhou.
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <motion.button
          type="button"
          onClick={onAgain}
          whileTap={{ scale: 0.96, y: 3 }}
          transition={SPRING}
          className="flex w-full touch-manipulation items-center justify-center gap-2 rounded-2xl py-3.5 font-[family-name:var(--font-display)] text-base font-bold uppercase"
          style={{
            minHeight: 52,
            background: ISO.ink,
            color: ISO.green,
            border: `3px solid ${ISO.ink}`,
          }}
        >
          <RotateCcw size={17} strokeWidth={2.6} /> Apostar de novo
        </motion.button>
        <button
          type="button"
          onClick={onRank}
          className="flex w-full touch-manipulation items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-bold"
          style={{
            minHeight: 44,
            background: "#FFFFFF",
            color: ISO.ink,
            border: `2.5px solid ${ISO.ink}`,
          }}
        >
          <Share2 size={15} /> Ver ranking de green
        </button>
      </div>
    </div>
  );
}

/* ════════ RANKING ════════ */
function RankScreen({ me, onBack }: { me: (typeof USERS)[number]; onBack: () => void }) {
  const rows = [
    {
      u: USERS[1],
      goal: "100 km no mês",
      payout: 930,
      place: 1,
      ring: ISO.yellow,
    },
    { u: USERS[11], goal: "Maratona", payout: 740, place: 2, ring: "#C0C6D4" },
    {
      u: me,
      goal: "Perder 8 kg",
      payout: 480,
      place: 3,
      ring: ISO.coral,
      you: true,
    },
    { u: USERS[6], goal: "5x/semana", payout: 440, place: 4, ring: ISO.purple },
    {
      u: USERS[13],
      goal: "Largou açúcar",
      payout: 380,
      place: 5,
      ring: ISO.purple,
    },
  ];
  return (
    <div className="flex min-h-full flex-col pb-3">
      <div className="flex items-center gap-2 px-3 pb-2 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="grid h-9 w-9 touch-manipulation place-items-center rounded-xl"
          style={{
            background: "#FFFFFF",
            border: `2px solid ${ISO.ink}`,
            minHeight: 44,
            minWidth: 44,
          }}
          aria-label="Voltar"
        >
          <ChevronLeft size={18} strokeWidth={2.8} color={ISO.ink} />
        </button>
        <div>
          <p
            className="font-[family-name:var(--font-display)] text-lg font-bold leading-none"
            style={{ color: ISO.ink }}
          >
            Quem deu green
          </p>
          <p className="text-[11px]" style={{ color: ISO.inkSoft }}>
            Squad “Ferro &amp; Foco” · esta semana
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4">
        {rows.map((r) => (
          <div
            key={r.place}
            className="flex items-center gap-2.5 rounded-2xl p-2.5"
            style={{
              background: r.you ? ISO.base : "#FFFFFF",
              border: `2.5px solid ${r.you ? ISO.purple : ISO.baseDeep}`,
              boxShadow: r.you ? `3px 4px 0 ${ISO.purple}` : "none",
            }}
          >
            <span
              className="w-5 text-center font-[family-name:var(--font-display)] text-lg font-bold"
              style={{ color: ISO.inkSoft }}
            >
              {r.place}
            </span>
            <IsoAvatarCircle src={r.u.avatar} alt={r.u.name} size={40} ring={r.ring} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold leading-tight" style={{ color: ISO.ink }}>
                {r.u.name}
                {r.you && (
                  <span className="ml-1 text-[10px] font-bold" style={{ color: ISO.purple }}>
                    · você
                  </span>
                )}
              </p>
              <p className="truncate text-xs" style={{ color: ISO.inkSoft }}>
                {r.goal}
              </p>
            </div>
            <span
              className="shrink-0 rounded-lg px-2 py-1 font-[family-name:var(--font-display)] text-xs font-bold tabular-nums"
              style={{
                background: ISO.green,
                color: ISO.ink,
                border: `2px solid ${ISO.ink}`,
              }}
            >
              {brl(r.payout, false)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto px-4 pt-3">
        <motion.button
          type="button"
          onClick={onBack}
          whileTap={{ scale: 0.96, y: 3 }}
          transition={SPRING}
          className="w-full touch-manipulation rounded-2xl py-3.5 font-[family-name:var(--font-display)] text-base font-bold uppercase"
          style={{
            minHeight: 52,
            background: ISO.purple,
            color: "#FFFFFF",
            border: `3px solid ${ISO.ink}`,
            boxShadow: `0 5px 0 ${ISO.purpleDeep}`,
          }}
        >
          Voltar pra minha banca
        </motion.button>
      </div>
    </div>
  );
}
