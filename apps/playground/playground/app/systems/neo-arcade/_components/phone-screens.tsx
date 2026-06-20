"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home as HomeIcon, Ticket, Trophy, Plus, Minus, ChevronLeft } from "lucide-react";
import { HudLabel, PixelCoin, PixelShield, PixelFlame, PixelStar } from "./primitives";
import { PixelAvatar } from "./pixel-avatar";
import { GreenLeaderboard } from "./green-leaderboard";
import { CoinRain } from "./coin-rain";
import { brl, odds, useCountUp } from "./use-count-up";
import { USERS } from "@/lib/avatars";

/**
 * SEÇÃO 3 — PROTÓTIPO DE CELULAR JOGÁVEL.
 * Repensada por completo: em vez de mockups estáticos lado a lado, é UM
 * mini-app de verdade dentro da moldura. Dá pra TOCAR e percorrer o fluxo real:
 *
 *   home (saldo + aposta ativa)
 *     → NOVA APOSTA → cupom (ajustar stake/cotação → retorno ao vivo)
 *     → FAZER APOSTA → confirmação
 *     → DEU GREEN (payout + chuva de moedas)
 *     → APOSTAR DE NOVO → volta ao início.
 *
 * Tab bar troca de tela; botões funcionam; transições com AnimatePresence.
 * Tudo no estilo 8-bit do sistema. Runtime-safe: nada de Math.random/Date/
 * window no render (confete é determinístico por index via CoinRain).
 */

type ScreenId = "home" | "coupon" | "confirm" | "green" | "board";

type Goal = { id: string; label: string; prazo: string; baseOdds: number };

const GOALS: Goal[] = [
  {
    id: "corrida",
    label: "Correr 5 km em 30 min",
    prazo: "01/09/2026",
    baseOdds: 1.85,
  },
  {
    id: "peso",
    label: "Perder 8 kg em 4 meses",
    prazo: "13/10/2026",
    baseOdds: 2.4,
  },
  {
    id: "treino",
    label: "Treinar 5x/sem · 90 dias",
    prazo: "11/09/2026",
    baseOdds: 3.1,
  },
];

const STAKE_MIN = 20;
const STAKE_MAX = 500;
const STAKE_STEP = 10;

const screenV = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export function PhoneScreens() {
  const [screen, setScreen] = useState<ScreenId>("home");
  const [goalId, setGoalId] = useState<string>(GOALS[1].id);
  const [stake, setStake] = useState(200);
  // a aposta "fechada" (snapshot no momento do FAZER APOSTA)
  const [locked, setLocked] = useState<{
    goal: Goal;
    stake: number;
    payout: number;
    odds: number;
  } | null>(null);
  const [coinBurst, setCoinBurst] = useState(0);

  const goal = useMemo(() => GOALS.find((g) => g.id === goalId)!, [goalId]);

  // cotação cai um tico conforme o stake sobe (mais skin in the game)
  const liveOdds = useMemo(() => {
    const nudge = Math.min(0.35, ((stake - STAKE_MIN) / (STAKE_MAX - STAKE_MIN)) * 0.45);
    return Math.max(1.2, goal.baseOdds - nudge);
  }, [goal, stake]);

  const payout = stake * liveOdds;

  function go(next: ScreenId) {
    setScreen(next);
  }

  function placeBet() {
    setLocked({ goal, stake, payout, odds: liveOdds });
    go("confirm");
  }

  function settleGreen() {
    setCoinBurst((b) => b + 1);
    go("green");
  }

  function playAgain() {
    setLocked(null);
    setStake(200);
    setGoalId(GOALS[1].id);
    go("home");
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <PhoneFrame burstKey={coinBurst}>
        {/* tab-routed screen body */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={screen}
              variants={screenV}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute inset-0 overflow-y-auto px-4 pb-4 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {screen === "home" && (
                <HomeScreen
                  goal={goal}
                  locked={locked}
                  onNew={() => go("coupon")}
                  onView={() => go(locked ? "confirm" : "coupon")}
                />
              )}
              {screen === "coupon" && (
                <CouponScreen
                  goal={goal}
                  goalId={goalId}
                  setGoalId={setGoalId}
                  stake={stake}
                  setStake={setStake}
                  liveOdds={liveOdds}
                  payout={payout}
                  onBack={() => go("home")}
                  onPlace={placeBet}
                />
              )}
              {screen === "confirm" && locked && (
                <ConfirmScreen locked={locked} onBack={() => go("coupon")} onSettle={settleGreen} />
              )}
              {screen === "green" && locked && <GreenScreen locked={locked} onAgain={playAgain} />}
              {screen === "board" && <BoardScreen />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* tab bar */}
        <TabBar
          screen={screen}
          hasBet={!!locked}
          onHome={() => go("home")}
          onCoupon={() => go(locked ? "confirm" : "coupon")}
          onBoard={() => go("board")}
        />
      </PhoneFrame>

      <p className="max-w-md text-center font-[family-name:var(--font-body)] text-xs leading-relaxed text-[#9D8FC7]">
        Mini-app de verdade: toque na tab bar, monte o cupom, ajuste o stake e feche a aposta.
        Cumpriu a meta? <span className="text-[#22E06B]">DEU GREEN.</span>
      </p>
    </div>
  );
}

/* ── phone chrome ──────────────────────────────────────────────────────── */
function PhoneFrame({ children, burstKey }: { children: React.ReactNode; burstKey: number }) {
  return (
    <div
      className="relative flex aspect-[1206/2622] w-full max-w-[390px] flex-col overflow-hidden rounded-[2.5rem] bg-[#120A24]"
      style={{
        boxShadow: "0 0 0 4px #2E1065, 0 0 0 8px #1C1140, 16px 16px 0 0 rgba(0,0,0,0.4)",
      }}
    >
      {/* payout coin rain lives above the whole device */}
      <CoinRain burstKey={burstKey} mode="rain" count={34} />

      {/* notch / status bar */}
      <div className="relative flex shrink-0 items-center justify-between px-6 pb-1 pt-3">
        <span className="font-[family-name:var(--font-hud)] text-[10px] text-[#EDE9FE]">9:41</span>
        <span className="absolute left-1/2 top-2 h-4 w-20 -translate-x-1/2 rounded-b-xl bg-black/60" />
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 bg-[#22E06B]" />
          <span className="font-[family-name:var(--font-hud)] text-[10px] text-[#9D8FC7]">5G</span>
        </span>
      </div>

      {children}
    </div>
  );
}

/* ── tab bar ───────────────────────────────────────────────────────────── */
function TabBar({
  screen,
  hasBet,
  onHome,
  onCoupon,
  onBoard,
}: {
  screen: ScreenId;
  hasBet: boolean;
  onHome: () => void;
  onCoupon: () => void;
  onBoard: () => void;
}) {
  const couponActive = screen === "coupon" || screen === "confirm" || screen === "green";
  const tabs = [
    {
      id: "home",
      label: "HOME",
      icon: HomeIcon,
      active: screen === "home",
      onClick: onHome,
    },
    {
      id: "coupon",
      label: hasBet ? "APOSTA" : "CUPOM",
      icon: Ticket,
      active: couponActive,
      onClick: onCoupon,
    },
    {
      id: "board",
      label: "TOPO",
      icon: Trophy,
      active: screen === "board",
      onClick: onBoard,
    },
  ];
  return (
    <div
      className="flex shrink-0 items-stretch border-t-2 border-[#2E1065] bg-[#1C1140]"
      style={{ boxShadow: "inset 0 2px 0 0 #2E1065" }}
    >
      {tabs.map((t) => {
        const Icon = t.icon;
        return (
          <motion.button
            key={t.id}
            type="button"
            onClick={t.onClick}
            whileTap={{ y: 2 }}
            className="flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 py-2"
            style={{
              background: t.active ? "#2E1065" : "transparent",
              boxShadow: t.active ? "inset 0 3px 0 0 #22E06B" : "none",
            }}
          >
            <Icon size={18} strokeWidth={2.5} color={t.active ? "#22E06B" : "#9D8FC7"} />
            <HudLabel className="text-[9px]" style={{ color: t.active ? "#22E06B" : "#9D8FC7" }}>
              {t.label}
            </HudLabel>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ── 1 · HOME ──────────────────────────────────────────────────────────── */
function HomeScreen({
  goal,
  locked,
  onNew,
  onView,
}: {
  goal: Goal;
  locked: { goal: Goal; stake: number; payout: number; odds: number } | null;
  onNew: () => void;
  onView: () => void;
}) {
  const me = USERS[8];
  const active = locked?.goal ?? goal;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PixelAvatar src={me.avatar} alt={me.name} size={40} ring="#22E06B" glow="#22E06B" />
          <div>
            <HudLabel className="block text-[9px] text-[#9D8FC7]">JOGADOR 1</HudLabel>
            <span className="font-[family-name:var(--font-body)] text-sm font-semibold text-[#EDE9FE]">
              {me.name.split(" ")[0]}
            </span>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 bg-[#1C1140] px-2.5 py-1.5"
          style={{ boxShadow: "0 0 0 2px #FFD60A" }}
        >
          <PixelCoin size={14} />
          <span className="font-[family-name:var(--font-body)] text-xs font-semibold tabular-nums text-[#FFD60A]">
            340,00
          </span>
        </div>
      </div>

      <div className="bg-[#1C1140] p-4" style={{ boxShadow: "0 0 0 2px #6D28D9" }}>
        <div className="flex items-center justify-between">
          <HudLabel className="text-[10px] text-[#9D8FC7]">CHARYA SCORE</HudLabel>
          <span className="font-[family-name:var(--font-body)] text-2xl font-extrabold tabular-nums text-[#8B5CF6]">
            742
          </span>
        </div>
        <div className="mt-2 flex h-2.5 gap-[2px] bg-[#2E1065] p-[2px]">
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="h-full flex-1"
              style={{ background: i < 11 ? "#8B5CF6" : "transparent" }}
            />
          ))}
        </div>
      </div>

      <div
        className="flex items-center justify-between bg-[#1C1140] p-3"
        style={{ boxShadow: "0 0 0 2px #2E1065" }}
      >
        <div className="flex items-center gap-2">
          <PixelFlame size={22} fill="#22E06B" inner="#FFD60A" />
          <span className="font-[family-name:var(--font-body)] text-sm font-semibold text-[#EDE9FE]">
            18 dias seguidos
          </span>
        </div>
        <PixelShield size={20} />
      </div>

      {/* active bet (tap to view) */}
      <motion.button
        type="button"
        onClick={onView}
        whileTap={{ x: 2, y: 2 }}
        className="block w-full bg-[#1C1140] p-4 text-left"
        style={{ boxShadow: "0 0 0 2px #22E06B" }}
      >
        <div className="flex items-center justify-between">
          <HudLabel className="text-[10px] text-[#9D8FC7]">
            {locked ? "APOSTA ATIVA · TOQUE" : "SUA APOSTA ATIVA"}
          </HudLabel>
          {locked ? <HudLabel className="text-[9px] text-[#22E06B]">EM JOGO</HudLabel> : null}
        </div>
        <p className="mt-1 font-[family-name:var(--font-body)] text-sm font-semibold text-[#EDE9FE]">
          {active.label}
        </p>
        <div className="mt-2 flex h-2.5 gap-[2px] bg-[#2E1065] p-[2px]">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="h-full flex-1"
              style={{ background: i < 8 ? "#22E06B" : "transparent" }}
            />
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between font-[family-name:var(--font-body)] text-xs">
          <span className="text-[#9D8FC7]">
            stake R$ {locked ? brl(locked.stake) : "200,00"} @{" "}
            {odds(locked ? locked.odds : active.baseOdds)}x
          </span>
          <span className="font-bold text-[#22E06B]">
            → R$ {brl(locked ? locked.payout : 200 * active.baseOdds)}
          </span>
        </div>
      </motion.button>

      <motion.button
        type="button"
        onClick={onNew}
        whileTap={{ x: 3, y: 3 }}
        className="block min-h-[48px] w-full bg-[#FFD60A] px-4 py-3.5 font-[family-name:var(--font-display)] text-[11px] text-[#120A24]"
        style={{ boxShadow: "4px 4px 0 0 #B8860B" }}
      >
        ▶ INSERT COIN · NOVA APOSTA
      </motion.button>
    </div>
  );
}

/* ── 2 · CUPOM ─────────────────────────────────────────────────────────── */
function CouponScreen({
  goal,
  goalId,
  setGoalId,
  stake,
  setStake,
  liveOdds,
  payout,
  onBack,
  onPlace,
}: {
  goal: Goal;
  goalId: string;
  setGoalId: (id: string) => void;
  stake: number;
  setStake: (fn: (v: number) => number) => void;
  liveOdds: number;
  payout: number;
  onBack: () => void;
  onPlace: () => void;
}) {
  const animatedOdds = useCountUp(liveOdds, 450);
  const animatedPayout = useCountUp(payout, 550);
  const frac = (stake - STAKE_MIN) / (STAKE_MAX - STAKE_MIN);

  return (
    <div className="space-y-3">
      <ScreenHead title="CUPOM" onBack={onBack} />

      {/* pick goal (selectable) */}
      <HudLabel className="block text-[10px] text-[#8B5CF6]">SEU PALPITE</HudLabel>
      <div className="grid gap-2">
        {GOALS.map((g) => {
          const active = g.id === goalId;
          return (
            <motion.button
              key={g.id}
              type="button"
              onClick={() => setGoalId(g.id)}
              whileTap={{ x: 2, y: 2 }}
              aria-pressed={active}
              className="flex items-center justify-between gap-2 px-3 py-2.5 text-left"
              style={{
                background: active ? "#2E1065" : "#1C1140",
                boxShadow: `0 0 0 2px ${active ? "#8B5CF6" : "#2E1065"}`,
              }}
            >
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-3 w-3 shrink-0"
                  style={{
                    background: active ? "#22E06B" : "transparent",
                    boxShadow: `0 0 0 2px ${active ? "#22E06B" : "#4A3A7A"}`,
                  }}
                />
                <span className="font-[family-name:var(--font-body)] text-[13px] leading-tight text-[#EDE9FE]">
                  {g.label}
                </span>
              </span>
              <span
                className="shrink-0 px-1.5 py-0.5 font-[family-name:var(--font-body)] text-xs font-bold tabular-nums"
                style={{ color: active ? "#22E06B" : "#9D8FC7" }}
              >
                {odds(g.baseOdds)}x
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* live odds board */}
      <div
        className="bg-[#06140C] p-4 text-center"
        style={{ boxShadow: "inset 0 0 0 3px #047857" }}
      >
        <HudLabel className="block text-[9px] text-[#22E06B]">COTAÇÃO AO VIVO</HudLabel>
        <motion.span
          key={Math.round(liveOdds * 100)}
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 600, damping: 18 }}
          className="block font-[family-name:var(--font-body)] text-5xl font-extrabold tabular-nums text-[#22E06B]"
          style={{ textShadow: "0 0 16px rgba(34,224,107,0.4)" }}
        >
          {odds(animatedOdds)}x
        </motion.span>
      </div>

      {/* stake stepper (INSERT COIN) */}
      <HudLabel className="block text-[10px] text-[#FFD60A]">INSERT COIN · STAKE</HudLabel>
      <div className="bg-[#120A24] p-3" style={{ boxShadow: "inset 0 0 0 2px #2E1065" }}>
        <div className="flex items-center justify-between gap-2">
          <motion.button
            type="button"
            onClick={() => setStake((v) => Math.max(STAKE_MIN, v - STAKE_STEP))}
            whileTap={{ x: 2, y: 2 }}
            aria-label="Diminuir stake"
            className="grid h-11 w-11 place-items-center bg-[#2E1065]"
            style={{ boxShadow: "2px 2px 0 0 #1C1140" }}
          >
            <Minus size={18} strokeWidth={3} color="#EDE9FE" />
          </motion.button>
          <motion.span
            key={stake}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 600, damping: 18 }}
            className="font-[family-name:var(--font-body)] text-2xl font-bold tabular-nums text-[#FFD60A]"
          >
            R$ {brl(stake)}
          </motion.span>
          <motion.button
            type="button"
            onClick={() => setStake((v) => Math.min(STAKE_MAX, v + STAKE_STEP))}
            whileTap={{ x: 2, y: 2 }}
            aria-label="Aumentar stake"
            className="grid h-11 w-11 place-items-center bg-[#FFD60A]"
            style={{ boxShadow: "2px 2px 0 0 #B8860B" }}
          >
            <Plus size={18} strokeWidth={3} color="#120A24" />
          </motion.button>
        </div>
        <div className="mt-3 flex h-2.5 gap-[2px] bg-[#2E1065] p-[2px]">
          {Array.from({ length: 16 }).map((_, i) => {
            const lit = i < Math.round(frac * 16);
            return (
              <span
                key={i}
                className="h-full flex-1 transition-colors"
                style={{ background: lit ? "#FFD60A" : "transparent" }}
              />
            );
          })}
        </div>
        {/* quick coin chips */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[10, 25, 50].map((s) => (
            <motion.button
              key={s}
              type="button"
              onClick={() => setStake((v) => Math.min(STAKE_MAX, v + s))}
              whileTap={{ x: 2, y: 2 }}
              className="flex min-h-[44px] items-center justify-center gap-1 bg-[#FFD60A] font-[family-name:var(--font-body)] text-xs font-bold text-[#120A24]"
              style={{ boxShadow: "2px 2px 0 0 #B8860B" }}
            >
              <PixelCoin size={12} /> +{s}
            </motion.button>
          ))}
        </div>
      </div>

      {/* live return */}
      <div className="bg-[#120A24] p-3 text-center" style={{ boxShadow: "0 0 0 2px #22E06B" }}>
        <HudLabel className="block text-[9px] text-[#22E06B]">SE DER GREEN</HudLabel>
        <span className="block font-[family-name:var(--font-body)] text-2xl font-bold tabular-nums text-[#22E06B]">
          R$ {brl(animatedPayout)}
        </span>
      </div>

      <motion.button
        type="button"
        onClick={onPlace}
        whileTap={{ x: 4, y: 4 }}
        className="block min-h-[48px] w-full bg-[#22E06B] px-4 py-3.5 font-[family-name:var(--font-display)] text-[11px] text-[#06140C]"
        style={{ boxShadow: "4px 4px 0 0 #047857" }}
      >
        ▶ FAZER APOSTA
      </motion.button>

      <p className="flex items-start gap-1.5 font-[family-name:var(--font-body)] text-[10px] leading-relaxed text-[#9D8FC7]">
        <span className="mt-0.5 shrink-0">
          <PixelShield size={12} />
        </span>
        {goal.label} · prazo {goal.prazo}. Retorno vem de quem desistiu, dividido entre quem
        cumpriu.
      </p>
    </div>
  );
}

/* ── 3 · CONFIRMAÇÃO (aposta em jogo) ──────────────────────────────────── */
function ConfirmScreen({
  locked,
  onBack,
  onSettle,
}: {
  locked: { goal: Goal; stake: number; payout: number; odds: number };
  onBack: () => void;
  onSettle: () => void;
}) {
  return (
    <div className="space-y-3">
      <ScreenHead title="APOSTA FEITA" onBack={onBack} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 22 }}
        className="bg-[#1C1140] p-4 text-center"
        style={{ boxShadow: "0 0 0 3px #8B5CF6" }}
      >
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.12, repeat: 2 }}
          className="font-[family-name:var(--font-display)] text-base text-[#8B5CF6]"
        >
          CUPOM REGISTRADO
        </motion.div>
        <p className="mt-2 font-[family-name:var(--font-body)] text-sm font-semibold text-[#EDE9FE]">
          {locked.goal.label}
        </p>
        <p className="font-[family-name:var(--font-body)] text-xs text-[#9D8FC7]">
          prazo {locked.goal.prazo}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#120A24] p-3 text-center" style={{ boxShadow: "0 0 0 2px #FFD60A" }}>
          <HudLabel className="block text-[9px] text-[#FFD60A]">STAKE</HudLabel>
          <span className="font-[family-name:var(--font-body)] text-lg font-bold tabular-nums text-[#FFD60A]">
            R$ {brl(locked.stake)}
          </span>
        </div>
        <div className="bg-[#120A24] p-3 text-center" style={{ boxShadow: "0 0 0 2px #8B5CF6" }}>
          <HudLabel className="block text-[9px] text-[#8B5CF6]">COTAÇÃO</HudLabel>
          <span className="font-[family-name:var(--font-body)] text-lg font-bold tabular-nums text-[#EDE9FE]">
            {odds(locked.odds)}x
          </span>
        </div>
      </div>

      <div className="bg-[#06140C] p-4 text-center" style={{ boxShadow: "0 0 0 2px #22E06B" }}>
        <HudLabel className="block text-[9px] text-[#22E06B]">RETORNO POTENCIAL</HudLabel>
        <span className="font-[family-name:var(--font-body)] text-3xl font-extrabold tabular-nums text-[#22E06B]">
          R$ {brl(locked.payout)}
        </span>
      </div>

      {/* progress toward the goal */}
      <div className="bg-[#1C1140] p-3" style={{ boxShadow: "0 0 0 2px #2E1065" }}>
        <div className="flex items-center justify-between">
          <HudLabel className="text-[10px] text-[#9D8FC7]">PROGRESSO</HudLabel>
          <span className="font-[family-name:var(--font-body)] text-xs font-bold text-[#22E06B]">
            quase lá
          </span>
        </div>
        <div className="mt-2 flex h-3 gap-[2px] bg-[#2E1065] p-[2px]">
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="h-full flex-1"
              style={{ background: i < 13 ? "#22E06B" : "transparent" }}
            />
          ))}
        </div>
      </div>

      <motion.button
        type="button"
        onClick={onSettle}
        whileTap={{ x: 4, y: 4 }}
        className="block min-h-[48px] w-full bg-[#22E06B] px-4 py-3.5 font-[family-name:var(--font-display)] text-[11px] text-[#06140C]"
        style={{ boxShadow: "4px 4px 0 0 #047857" }}
      >
        ✓ CUMPRI A META
      </motion.button>
      <p className="text-center font-[family-name:var(--font-body)] text-[10px] text-[#9D8FC7]">
        (no app real, isto é o check-in que valida a meta)
      </p>
    </div>
  );
}

/* ── 4 · DEU GREEN (payout) ────────────────────────────────────────────── */
function GreenScreen({
  locked,
  onAgain,
}: {
  locked: { goal: Goal; stake: number; payout: number; odds: number };
  onAgain: () => void;
}) {
  const me = USERS[8];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 py-4 text-center">
      <motion.div
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 16 }}
      >
        <PixelAvatar src={me.avatar} alt={me.name} size={84} ring="#22E06B" glow="#22E06B" />
      </motion.div>

      <div>
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.12, repeat: 3 }}
          className="font-[family-name:var(--font-display)] text-2xl text-[#22E06B]"
        >
          DEU GREEN!
        </motion.div>
        <p className="mt-2 font-[family-name:var(--font-display)] text-[10px] leading-relaxed text-[#EDE9FE]">
          APOSTA PAGA
        </p>
      </div>

      <div
        className="w-full bg-[#06140C] p-5"
        style={{ boxShadow: "0 0 0 3px #22E06B, 6px 6px 0 0 #047857" }}
      >
        <HudLabel className="block text-[9px] text-[#22E06B]">VOCÊ RECEBEU</HudLabel>
        <span className="font-[family-name:var(--font-body)] text-4xl font-extrabold tabular-nums text-[#22E06B]">
          R$ {brl(locked.payout)}
        </span>
        <p className="mt-2 font-[family-name:var(--font-body)] text-xs text-[#EDE9FE]/70">
          stake R$ {brl(locked.stake)} · cotação {odds(locked.odds)}x · {locked.goal.label}
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <PixelStar key={i} size={18} fill="#FFD60A" />
        ))}
        <span className="font-[family-name:var(--font-body)] text-xs text-[#9D8FC7]">
          +120 XP · LEVEL UP
        </span>
      </div>

      <motion.button
        type="button"
        onClick={onAgain}
        whileTap={{ x: 4, y: 4 }}
        className="mt-1 min-h-[48px] w-full bg-[#FFD60A] px-4 py-3.5 font-[family-name:var(--font-display)] text-[11px] text-[#120A24]"
        style={{ boxShadow: "4px 4px 0 0 #B8860B" }}
      >
        ↻ APOSTAR DE NOVO
      </motion.button>
    </div>
  );
}

/* ── 5 · LEADERBOARD ───────────────────────────────────────────────────── */
function BoardScreen() {
  return (
    <div className="space-y-3">
      <HudLabel className="block text-[11px] text-[#9D8FC7]">HIGH SCORES</HudLabel>
      <GreenLeaderboard compact />
      <div
        className="flex items-center gap-2 bg-[#1C1140] p-3"
        style={{ boxShadow: "0 0 0 2px #6D28D9" }}
      >
        <PixelShield size={18} />
        <p className="font-[family-name:var(--font-body)] text-[11px] leading-snug text-[#9D8FC7]">
          Só o topo e a sua linha aparecem em destaque — sem mural de quem deu red.
        </p>
      </div>
    </div>
  );
}

/* ── shared screen header ──────────────────────────────────────────────── */
function ScreenHead({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <motion.button
        type="button"
        onClick={onBack}
        whileTap={{ x: -2 }}
        aria-label="Voltar"
        className="grid h-9 w-9 shrink-0 place-items-center bg-[#1C1140]"
        style={{ boxShadow: "0 0 0 2px #2E1065" }}
      >
        <ChevronLeft size={18} strokeWidth={3} color="#9D8FC7" />
      </motion.button>
      <HudLabel className="text-[11px] text-[#9D8FC7]">{title}</HudLabel>
    </div>
  );
}
