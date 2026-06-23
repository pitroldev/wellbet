"use client";

import { useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import {
  Home,
  Ticket,
  Trophy,
  User,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  Wifi,
  BatteryFull,
  SignalHigh,
} from "lucide-react";
import { USERS } from "@/lib/avatars";
import { FOIL, HOLO, SPRING, brl, odd } from "./tokens";
import {
  useFoil,
  FoilSheen,
  GlassLabel,
  IridText,
  IridBurst,
  ScanSweep,
  HoloCheck,
  AvatarHolo,
} from "./primitives";
import { useCountUp } from "./use-count-up";

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
 * PhonePrototype — mini-app JOGÁVEL da CHARYA numa moldura iPhone 16 Pro.
 * Estrutura: flex flex-col + aspect-[1206/2622]; conteúdo flex-1 min-h-0
 * rolável; status bar e tab bar shrink-0. Fluxo: home → cupom (passe foil) →
 * confirmação (validação) → DEU GREEN (burst) → de novo. Tab bar funcional.
 * Runtime-safe: pointer só em handlers; nada de random no render.
 */
export function PhonePrototype() {
  const me = USERS[2];

  const [screen, setScreen] = useState<Screen>("home");
  const [dir, setDir] = useState(1);
  const [goalId, setGoalId] = useState(GOALS[0].id);
  const [stake, setStake] = useState(100);
  const [balance, setBalance] = useState(START_BALANCE);
  const [burstKey, setBurstKey] = useState(0);
  const [scan, setScan] = useState(0);

  const goal = GOALS.find((g) => g.id === goalId) ?? GOALS[0];
  const liveOdd = Math.max(1.2, goal.baseOdd - Math.min(0.4, (stake - SMIN) / 1000));
  const payout = Math.round(stake * liveOdd);

  function go(next: Screen, direction: 1 | -1 = 1) {
    setDir(direction);
    setScreen(next);
  }
  function bump(d: 1 | -1) {
    setStake((s) => Math.max(SMIN, Math.min(SMAX, s + d * SSTEP)));
  }
  function placeBet() {
    setBalance((b) => Math.max(0, b - stake));
    setScan((s) => s + 1);
    go("confirm", 1);
  }
  function settleGreen() {
    setBalance((b) => b + payout);
    setBurstKey((k) => k + 1);
    go("green", 1);
  }
  function restart() {
    setStake(100);
    setGoalId(GOALS[0].id);
    go("home", -1);
  }

  const variants = {
    enter: (d: number) => ({ x: d * 48, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d * -48, opacity: 0 }),
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col items-center gap-4">
        {/* moldura iPhone 16 Pro */}
        <div
          className="relative flex aspect-[1206/2622] w-full max-w-[330px] flex-col overflow-hidden rounded-[3rem] border-[6px] border-[#1A1A2B] bg-[#0A0A12]"
          style={{
            boxShadow:
              "0 40px 90px -30px rgba(168, 85, 247,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          {/* glow de fundo ambiente */}
          <div className="pointer-events-none absolute -left-16 -top-10 h-52 w-52 rounded-full bg-[#A855F7]/25 blur-[70px]" />
          <div className="pointer-events-none absolute -bottom-10 -right-16 h-52 w-52 rounded-full bg-[#22D3EE]/15 blur-[70px]" />

          {/* dynamic island */}
          <div className="pointer-events-none absolute left-1/2 top-2 z-40 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

          {/* status bar (shrink-0) */}
          <div className="relative z-30 flex shrink-0 items-center justify-between px-6 pb-1 pt-3 text-[11px] font-semibold text-[#F2F2FA]">
            <span className="font-[family-name:var(--font-mono)] tabular-nums">9:41</span>
            <span className="flex items-center gap-1">
              <SignalHigh className="h-3.5 w-3.5" />
              <Wifi className="h-3.5 w-3.5" />
              <BatteryFull className="h-3.5 w-3.5" />
            </span>
          </div>

          {/* burst global do payout */}
          {burstKey > 0 && screen === "green" && (
            <div className="pointer-events-none absolute inset-0 z-40 grid place-items-center">
              <IridBurst burstKey={burstKey} count={30} />
            </div>
          )}

          {/* área de telas (flex-1 min-h-0 rolável) */}
          <div className="relative z-10 min-h-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={screen}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={SPRING}
                className="absolute inset-0 overflow-y-auto overflow-x-hidden"
              >
                {screen === "home" && (
                  <HomeScreen
                    me={me}
                    balance={balance}
                    goal={goal}
                    odd={liveOdd}
                    onNew={() => go("bet", 1)}
                  />
                )}
                {screen === "bet" && (
                  <BetScreen
                    goalId={goalId}
                    stake={stake}
                    liveOdd={liveOdd}
                    payout={payout}
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
                    scan={scan}
                    onSettle={settleGreen}
                    onHome={() => go("home", -1)}
                  />
                )}
                {screen === "green" && (
                  <GreenScreen
                    goal={goal}
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

          {/* tab bar (shrink-0) */}
          <TabBar screen={screen} onGo={go} />
        </div>

        <span className="text-center text-[11px] uppercase tracking-[0.2em] text-[#A6A6C8]">
          app jogável · toque e percorra o fluxo
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
  const activeTab =
    screen === "home" ? "home" : screen === "bet" ? "bet" : screen === "rank" ? "rank" : "me";

  function tap(id: string) {
    if (id === "home") onGo("home", -1);
    else if (id === "bet") onGo("bet", 1);
    else if (id === "rank") onGo("rank", 1);
    else onGo("home", -1);
  }

  return (
    <div className="relative z-30 flex shrink-0 items-stretch justify-around border-t border-white/10 bg-[#0A0A12]/80 px-2 pb-3 pt-2 backdrop-blur-xl">
      {tabs.map((t) => {
        const on = t.id === activeTab;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => tap(t.id)}
            className="flex flex-1 touch-manipulation flex-col items-center gap-1 py-1"
            style={{ minHeight: 44 }}
            aria-label={t.label}
            aria-pressed={on}
          >
            <motion.span
              animate={{ scale: on ? 1 : 0.92 }}
              transition={SPRING}
              className="grid h-9 w-9 place-items-center rounded-xl"
              style={{
                background: on ? FOIL : "transparent",
                color: on ? "#0A0A12" : HOLO.inkSoft,
              }}
            >
              <t.Icon size={18} strokeWidth={2.4} />
            </motion.span>
            <span
              className="text-[9px] font-semibold"
              style={{ color: on ? HOLO.ink : HOLO.inkFaint }}
            >
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
  goal,
  odd: oddVal,
  onNew,
}: {
  me: (typeof USERS)[number];
  balance: number;
  goal: Goal;
  odd: number;
  onNew: () => void;
}) {
  const animBalance = useCountUp(balance, 500);
  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <AvatarHolo src={me.avatar} alt={me.name} size={40} />
          <div>
            <p className="text-[11px] text-[#A6A6C8]">bom treino,</p>
            <p className="text-sm font-bold text-[#F2F2FA]">Rafael</p>
          </div>
        </div>
        <span className="rounded-full bg-white/[0.06] px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] text-[#22D3EE]">
          streak 18
        </span>
      </div>

      {/* banca (passe foil) */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 p-4">
        <span
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{ background: FOIL, backgroundSize: "200% 200%" }}
        />
        <div className="relative">
          <GlassLabel className="text-[#0A0A12]/70">sua banca</GlassLabel>
          <div className="font-[family-name:var(--font-mono)] text-3xl font-bold tabular-nums text-[#0A0A12]">
            R$ {brl(animBalance)}
          </div>
          <p className="mt-0.5 text-[11px] font-medium text-[#0A0A12]/70">
            o pote vem de quem desistiu — dividido entre quem cumpriu
          </p>
        </div>
      </div>

      {/* aposta ativa */}
      <div>
        <GlassLabel className="mb-2 block text-[#A6A6C8]">aposta ativa</GlassLabel>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="text-lg">{goal.emoji}</span>
              <span className="text-sm font-semibold text-[#F2F2FA]">{goal.title}</span>
            </span>
            <span className="rounded-lg bg-[#22D3EE]/10 px-2 py-1 font-[family-name:var(--font-mono)] text-xs font-bold text-[#22D3EE]">
              {odd(oddVal)}x
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full rounded-full" style={{ background: FOIL, width: "62%" }} />
          </div>
          <p className="mt-1.5 text-[11px] text-[#A6A6C8]">62% do caminho · faltam 11 dias</p>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={onNew}
        whileTap={{ scale: 0.97 }}
        className="mt-1 flex min-h-[52px] items-center justify-center gap-2 rounded-2xl text-base font-extrabold text-[#0A0A12]"
        style={{
          background: FOIL,
          boxShadow: "0 14px 36px -14px rgba(168, 85, 247,0.7)",
        }}
      >
        <Sparkles className="h-5 w-5" /> Novo passe
      </motion.button>
    </div>
  );
}

/* ════════ BET (cupom passe foil) ════════ */
function BetScreen({
  goalId,
  stake,
  liveOdd,
  payout,
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
  onPickGoal: (id: string) => void;
  onPickStake: (s: number) => void;
  onBump: (d: 1 | -1) => void;
  onBack: () => void;
  onPlace: () => void;
}) {
  const goal = GOALS.find((g) => g.id === goalId) ?? GOALS[0];
  const animPayout = useCountUp(payout, 480);
  const foil = useFoil(10);

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <button
        type="button"
        onClick={onBack}
        className="flex min-h-[40px] items-center gap-1 self-start text-sm text-[#A6A6C8]"
      >
        <ChevronLeft className="h-4 w-4" /> voltar
      </button>

      {/* mini passe foil reativo */}
      <motion.div
        {...foil.bind}
        style={{
          rotateX: foil.rotX,
          rotateY: foil.rotY,
          transformPerspective: 800,
          transformStyle: "preserve-3d",
        }}
        className="relative touch-none overflow-hidden rounded-3xl border border-white/12 p-4"
      >
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(165deg,rgba(20,20,34,0.9),rgba(10,10,18,0.96))",
          }}
        />
        <FoilSheen sx={foil.sx} sy={foil.sy} sActive={foil.sActive} intensity={0.6} />
        <div className="relative" style={{ transform: "translateZ(30px)" }}>
          <GlassLabel className="text-[#F2F2FA]/80">CHARYA · passe</GlassLabel>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xl">{goal.emoji}</span>
            <IridText className="font-[family-name:var(--font-display)] text-base font-extrabold leading-tight">
              {goal.title}
            </IridText>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-white/10 bg-black/30 px-2.5 py-1.5">
              <GlassLabel className="block text-[9px] text-[#22D3EE]">cotação</GlassLabel>
              <span className="font-[family-name:var(--font-mono)] text-base font-bold text-[#F2F2FA]">
                {odd(liveOdd)}x
              </span>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 px-2.5 py-1.5">
              <GlassLabel className="block text-[9px] text-[#34F5A0]">retorno</GlassLabel>
              <span className="font-[family-name:var(--font-mono)] text-base font-bold text-[#34F5A0]">
                R$ {brl(animPayout)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
      <p className="-mt-2 text-center text-[10px] text-[#A6A6C8]">
        arraste o passe — o foil desliza
      </p>

      {/* escolher meta */}
      <div>
        <GlassLabel className="mb-2 block text-[#A6A6C8]">sua meta</GlassLabel>
        <div className="grid gap-2">
          {GOALS.map((g) => {
            const active = g.id === goalId;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => onPickGoal(g.id)}
                className="flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left"
                style={{
                  borderColor: active ? "rgba(168, 85, 247,0.5)" : "rgba(255,255,255,0.1)",
                  background: active ? "rgba(168, 85, 247,0.1)" : "rgba(255,255,255,0.03)",
                }}
              >
                <span className="flex items-center gap-2">
                  <span>{g.emoji}</span>
                  <span className="text-[13px] font-medium text-[#F2F2FA]">{g.title}</span>
                </span>
                <span
                  className="font-[family-name:var(--font-mono)] text-xs font-bold"
                  style={{ color: active ? HOLO.cyan : HOLO.inkSoft }}
                >
                  {odd(g.baseOdd)}x
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* stake */}
      <div>
        <GlassLabel className="mb-2 block text-[#A6A6C8]">stake</GlassLabel>
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
          <button
            type="button"
            onClick={() => onBump(-1)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-[#F2F2FA]"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="font-[family-name:var(--font-mono)] text-2xl font-bold tabular-nums text-[#F2F2FA]">
            R$ {brl(stake)}
          </span>
          <button
            type="button"
            onClick={() => onBump(1)}
            className="grid h-10 w-10 place-items-center rounded-xl text-[#0A0A12]"
            style={{ background: FOIL }}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {STAKES.map((s) => {
            const on = stake === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => onPickStake(s)}
                className="min-h-[40px] flex-1 rounded-xl px-2 font-[family-name:var(--font-mono)] text-sm font-bold"
                style={{
                  color: on ? "#0A0A12" : HOLO.inkSoft,
                  background: on ? FOIL : "rgba(255,255,255,0.04)",
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <motion.button
        type="button"
        onClick={onPlace}
        whileTap={{ scale: 0.97 }}
        className="mt-1 flex min-h-[54px] items-center justify-center gap-2 rounded-2xl font-[family-name:var(--font-display)] text-base font-extrabold text-[#0A0A12]"
        style={{
          background: FOIL,
          boxShadow: "0 14px 36px -14px rgba(168, 85, 247,0.7)",
        }}
      >
        FAZER APOSTA <ChevronRight className="h-5 w-5" />
      </motion.button>
    </div>
  );
}

/* ════════ CONFIRM (validação do passe) ════════ */
function ConfirmScreen({
  goal,
  stake,
  liveOdd,
  payout,
  scan,
  onSettle,
  onHome,
}: {
  goal: Goal;
  stake: number;
  liveOdd: number;
  payout: number;
  scan: number;
  onSettle: () => void;
  onHome: () => void;
}) {
  return (
    <div className="flex h-full flex-col gap-4 px-4 py-4">
      <div className="relative overflow-hidden rounded-3xl border border-[#22D3EE]/30 p-5 text-center">
        <span
          aria-hidden
          className="absolute inset-0 opacity-25"
          style={{ background: FOIL, backgroundSize: "200% 200%" }}
        />
        <ScanSweep run={scan} tone="cyan" />
        <div className="relative">
          <GlassLabel className="text-[#22D3EE]">passe validado ✓</GlassLabel>
          <div className="mt-2 text-3xl">{goal.emoji}</div>
          <p className="mt-1 font-[family-name:var(--font-display)] text-base font-extrabold text-[#F2F2FA]">
            {goal.title}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-left">
            <Mini label="stake" value={`R$${brl(stake)}`} color={HOLO.purple} />
            <Mini label="cotação" value={`${odd(liveOdd)}x`} color={HOLO.cyan} />
            <Mini label="green" value={`R$${brl(payout)}`} color={HOLO.green} />
          </div>
        </div>
      </div>

      <p className="px-2 text-center text-[12px] leading-relaxed text-[#A6A6C8]">
        Sua aposta está ativa. Cumpra a meta e o passe resolve em verde — o retorno cai na sua
        banca.
      </p>

      <div className="mt-auto space-y-2">
        <motion.button
          type="button"
          onClick={onSettle}
          whileTap={{ scale: 0.97 }}
          className="flex min-h-[54px] w-full items-center justify-center rounded-2xl text-base font-extrabold text-[#06140C]"
          style={{
            background: HOLO.green,
            boxShadow: "0 14px 36px -14px rgba(52, 245, 160,0.7)",
          }}
        >
          Cumpri a meta → DEU GREEN
        </motion.button>
        <button
          type="button"
          onClick={onHome}
          className="min-h-[44px] w-full text-xs uppercase tracking-widest text-[#A6A6C8]"
        >
          voltar ao início
        </button>
      </div>
    </div>
  );
}

function Mini({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 px-2 py-1.5">
      <GlassLabel className="block text-[9px]" style={{ color }}>
        {label}
      </GlassLabel>
      <span className="font-[family-name:var(--font-mono)] text-[13px] font-bold text-[#F2F2FA]">
        {value}
      </span>
    </div>
  );
}

/* ════════ GREEN ════════ */
function GreenScreen({
  goal,
  payout,
  balance,
  onAgain,
  onRank,
}: {
  goal: Goal;
  payout: number;
  balance: number;
  onAgain: () => void;
  onRank: () => void;
}) {
  const animBalance = useCountUp(balance, 700);
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-4 px-5 py-6 text-center">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(100% 70% at 50% 30%, rgba(52, 245, 160,0.16), transparent 70%)",
        }}
      />
      <HoloCheck size={84} />
      <motion.h3
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 0.2, repeat: 2 }}
        className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[#34F5A0]"
      >
        DEU GREEN!
      </motion.h3>
      <p className="text-sm text-[#F2F2FA]">
        Você cumpriu <strong>{goal.title}</strong> e recebeu{" "}
        <strong className="font-[family-name:var(--font-mono)] text-[#34F5A0]">
          R$ {brl(payout)}
        </strong>
        .
      </p>
      <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <GlassLabel className="text-[#A6A6C8]">nova banca</GlassLabel>
        <div className="font-[family-name:var(--font-mono)] text-2xl font-bold tabular-nums text-[#F2F2FA]">
          R$ {brl(animBalance)}
        </div>
      </div>
      <div className="mt-1 w-full space-y-2">
        <motion.button
          type="button"
          onClick={onAgain}
          whileTap={{ scale: 0.97 }}
          className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl text-base font-extrabold text-[#0A0A12]"
          style={{
            background: FOIL,
            boxShadow: "0 14px 36px -14px rgba(168, 85, 247,0.7)",
          }}
        >
          <RotateCcw className="h-5 w-5" /> Apostar de novo
        </motion.button>
        <button
          type="button"
          onClick={onRank}
          className="min-h-[44px] w-full text-xs uppercase tracking-widest text-[#A6A6C8]"
        >
          ver ranking
        </button>
      </div>
    </div>
  );
}

/* ════════ RANK ════════ */
function RankScreen({ me, onBack }: { me: (typeof USERS)[number]; onBack: () => void }) {
  const rows = [
    { u: USERS[4], goal: "Correr 100 km", payout: 620 },
    { u: USERS[8], goal: "Treinar 5x/sem", payout: 504 },
    { u: USERS[1], goal: "Perder 6 kg", payout: 432 },
    { u: USERS[11], goal: "Sem açúcar 30d", payout: 351 },
    { u: USERS[6], goal: "12 livros/ano", payout: 289 },
  ];
  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex min-h-[40px] items-center gap-1 text-sm text-[#A6A6C8]"
        >
          <ChevronLeft className="h-4 w-4" /> início
        </button>
        <span className="flex items-center gap-1.5 font-[family-name:var(--font-display)] text-sm font-bold text-[#34F5A0]">
          <Trophy className="h-4 w-4" /> deu green hoje
        </span>
      </div>
      <div className="space-y-2">
        {rows.map((r, i) => {
          const top = i === 0;
          return (
            <div
              key={r.u.handle}
              className="flex items-center gap-2.5 rounded-xl border px-3 py-2.5"
              style={{
                borderColor: top ? "rgba(52, 245, 160,0.4)" : "rgba(255,255,255,0.08)",
                background: top ? "rgba(52, 245, 160,0.07)" : "rgba(255,255,255,0.02)",
              }}
            >
              <span
                className="w-4 text-center font-[family-name:var(--font-mono)] text-sm font-bold"
                style={{ color: top ? HOLO.green : HOLO.inkFaint }}
              >
                {i + 1}
              </span>
              <AvatarHolo src={r.u.avatar} alt={r.u.name} size={34} ring={top} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold text-[#F2F2FA]">
                  {r.u.name}
                </span>
                <span className="block truncate text-[10px] text-[#A6A6C8]">{r.goal}</span>
              </span>
              <span className="font-[family-name:var(--font-mono)] text-sm font-bold text-[#34F5A0]">
                R$ {brl(r.payout)}
              </span>
            </div>
          );
        })}
      </div>
      <div
        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
        style={{
          background: "rgba(168, 85, 247,0.1)",
          boxShadow: "inset 0 0 0 1px rgba(168, 85, 247,0.35)",
        }}
      >
        <span className="w-4 text-center font-[family-name:var(--font-mono)] text-sm font-bold text-[#A855F7]">
          12
        </span>
        <AvatarHolo src={me.avatar} alt="Você" size={34} />
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-semibold text-[#F2F2FA]">Você</span>
          <span className="block text-[10px] text-[#A6A6C8]">Perder 8 kg em 4 meses</span>
        </span>
        <span className="font-[family-name:var(--font-mono)] text-xs font-bold text-[#A855F7]">
          em curso
        </span>
      </div>
    </div>
  );
}
