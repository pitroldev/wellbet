"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Wallet,
  Flame,
  Ticket,
  Home,
  Trophy,
  User,
  Check,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  Layers,
  Minus,
  Plus,
  Target,
  Zap,
  RotateCcw,
} from "lucide-react";
import { USERS } from "@/lib/avatars";
import { cn } from "@/lib/utils";
import { EASE_SOFT, GLOW, HudLabel, mono, OddsChip, OddsTick } from "./primitives";
import { AvatarMedallion, AvatarStack } from "./avatar-medallion";

/* ──────────────────────────────────────────────────────────────────────────
   SEÇÃO 3 — PROTÓTIPO DE CELULAR JOGÁVEL (mini-app de bet de verdade).
   Fluxo com useState + AnimatePresence:
     home → "Nova aposta" → cupom (stake/cotação → retorno ao vivo)
       → confirmação ("Fazer aposta") → DEU GREEN (payout + celebração)
       → "Apostar de novo" (volta ao início).
   A tab bar troca de tela; botões funcionam; transições animadas.
   Runtime-safe: zero Math.random/Date/window no render.
   ────────────────────────────────────────────────────────────────────────── */

type Screen = "home" | "cupom" | "confirm" | "green" | "profile";

type Goal = { id: string; titulo: string; prazo: string; odd: number };

const GOALS: Goal[] = [
  { id: "peso", titulo: "Perder 8 kg", prazo: "4 meses", odd: 2.4 },
  { id: "corrida", titulo: "Correr 100 km", prazo: "30 dias", odd: 1.85 },
  { id: "academia", titulo: "Treinar 20x", prazo: "este mês", odd: 1.62 },
  { id: "sono", titulo: "Dormir 7h · 21 dias", prazo: "3 semanas", odd: 3.1 },
];

const STAKE_MIN = 25;
const STAKE_MAX = 1500;
const STAKE_STEP = 25;
const CONFETTI = 28;

const brl = (n: number) =>
  n.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const card = "rounded-2xl border border-[rgba(139,131,168,0.16)] bg-[#171327] p-3";

/* ── transição padrão de tela (slide horizontal) ─────────────────────────── */
const screenVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

export function PhoneScreens() {
  const me = USERS[0];

  // ── estado do mini-app ──────────────────────────────────────────────────
  const [screen, setScreen] = useState<Screen>("home");
  const [dir, setDir] = useState(1); // direção da transição
  const [goalId, setGoalId] = useState("peso");
  const [stake, setStake] = useState(200);
  const [balance, setBalance] = useState(1240);
  const [greens, setGreens] = useState(312);
  const [hasActiveBet, setHasActiveBet] = useState(true);

  const goal = useMemo(() => GOALS.find((g) => g.id === goalId)!, [goalId]);

  // cotação reage ao stake (micro-boost por compromisso maior — nunca grátis)
  const odd = useMemo(() => {
    const boost = ((stake - STAKE_MIN) / (STAKE_MAX - STAKE_MIN)) * 0.18;
    return Number((goal.odd + boost).toFixed(2));
  }, [goal, stake]);

  const payout = Math.round(stake * odd);
  const profit = payout - stake;
  const pct = (stake - STAKE_MIN) / (STAKE_MAX - STAKE_MIN);

  // navegação com direção (para a animação) e troca de tela
  const go = (next: Screen, direction = 1) => {
    setDir(direction);
    setScreen(next);
  };

  const step = (d: number) => setStake((s) => Math.min(STAKE_MAX, Math.max(STAKE_MIN, s + d)));

  // confirmar a aposta: debita banca, marca aposta ativa, vai pra confirmação
  const confirmBet = () => {
    setHasActiveBet(true);
    go("confirm", 1);
  };

  // resolver como GREEN: credita payout, registra green
  const resolveGreen = () => {
    setBalance((b) => b + payout);
    setGreens((g) => g + 1);
    go("green", 1);
  };

  // recomeçar: volta ao início mantendo banca acumulada
  const restart = () => {
    setStake(200);
    setGoalId("peso");
    go("home", -1);
  };

  // tab bar troca de tela diretamente
  const tabs: { icon: typeof Home; screen: Screen; label: string }[] = [
    { icon: Home, screen: "home", label: "Início" },
    { icon: Ticket, screen: "cupom", label: "Cupom" },
    { icon: Trophy, screen: "green", label: "Greens" },
    { icon: User, screen: "profile", label: "Perfil" },
  ];

  const activeTab: Screen = screen === "confirm" ? "cupom" : screen;

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-full max-w-[360px] overflow-hidden rounded-[2.6rem] border-[8px] border-[#241d3a] bg-[#0E0B1A]"
        style={{
          aspectRatio: "1206 / 2622",
          boxShadow:
            "0 40px 90px -36px rgba(139,92,246,0.55), inset 0 0 0 1px rgba(139,131,168,0.18)",
        }}
      >
        {/* notch */}
        <div className="absolute left-1/2 top-2 z-30 h-5 w-28 -translate-x-1/2 rounded-full bg-[#241d3a]" />
        {/* status bar */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 pt-3 text-[10px] text-[#8B83A8]">
          <span className={mono()}>9:41</span>
          <span className={cn(mono(), "tracking-tight")}>5G · 100%</span>
        </div>

        {/* área de tela (scroll interno) */}
        <div className="absolute inset-0 overflow-hidden pb-[68px] pt-9">
          <div className="h-full overflow-y-auto px-3">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={screen}
                custom={dir}
                variants={screenVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: EASE_SOFT }}
                className="min-h-full"
              >
                {screen === "home" && (
                  <HomeScreen
                    me={me}
                    balance={balance}
                    greens={greens}
                    hasActiveBet={hasActiveBet}
                    onNew={() => go("cupom", 1)}
                  />
                )}
                {screen === "cupom" && (
                  <CupomScreen
                    goal={goal}
                    goalId={goalId}
                    setGoalId={setGoalId}
                    stake={stake}
                    setStake={setStake}
                    step={step}
                    pct={pct}
                    odd={odd}
                    payout={payout}
                    profit={profit}
                    onBack={() => go("home", -1)}
                    onConfirm={confirmBet}
                  />
                )}
                {screen === "confirm" && (
                  <ConfirmScreen
                    goal={goal}
                    stake={stake}
                    odd={odd}
                    payout={payout}
                    onBack={() => go("cupom", -1)}
                    onGreen={resolveGreen}
                  />
                )}
                {screen === "green" && (
                  <GreenScreen
                    goal={goal}
                    stake={stake}
                    payout={payout}
                    profit={profit}
                    greens={greens}
                    onAgain={restart}
                  />
                )}
                {screen === "profile" && (
                  <ProfileScreen me={me} balance={balance} greens={greens} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* tab bar — troca de tela */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-[rgba(139,131,168,0.16)] bg-[#0E0B1A]/95 px-2 py-2.5 backdrop-blur">
          {tabs.map((t) => {
            const on = activeTab === t.screen;
            return (
              <button
                key={t.screen}
                type="button"
                onClick={() => go(t.screen, t.screen === "home" ? -1 : 1)}
                aria-label={t.label}
                aria-current={on}
                className="relative grid min-h-[44px] min-w-[44px] place-items-center rounded-xl transition active:scale-90"
              >
                {on && (
                  <motion.span
                    layoutId="tabGlow"
                    className="absolute inset-x-2 inset-y-1 rounded-xl bg-[#34F5A0]/10"
                    transition={{ duration: 0.3, ease: EASE_SOFT }}
                  />
                )}
                <t.icon className="relative h-5 w-5" color={on ? GLOW.green : GLOW.muted} />
              </button>
            );
          })}
        </div>
      </div>

      <p className={cn(mono(), "mt-4 text-center text-[11px] text-[#8B83A8]")}>
        protótipo jogável · toque na tab bar ou siga o fluxo de aposta
      </p>
    </div>
  );
}

/* ── TELA: Home ───────────────────────────────────────────────────────────── */
function HomeScreen({
  me,
  balance,
  greens,
  hasActiveBet,
  onNew,
}: {
  me: (typeof USERS)[number];
  balance: number;
  greens: number;
  hasActiveBet: boolean;
  onNew: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AvatarMedallion src={me.avatar} alt={me.name} size={34} tone="purple" />
          <div>
            <span className="block text-[11px] text-[#8B83A8]">Boa, Bruno</span>
            <span className="block text-sm font-semibold text-[#EDEAF7]">Tier Estável</span>
          </div>
        </div>
        <span
          className={cn(
            mono(),
            "flex items-center gap-1 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-2 py-1 text-[11px] text-[#EDEAF7]",
          )}
        >
          <Flame className="h-3 w-3" color={GLOW.green} />
          47d
        </span>
      </div>

      {/* saldo — count-up reativo ao estado da banca */}
      <div
        className={cn(
          card,
          "border-[#34F5A0]/25 bg-gradient-to-br from-[#34F5A0]/[0.1] to-transparent",
        )}
      >
        <div className="flex items-center gap-1.5">
          <Wallet className="h-3.5 w-3.5" color={GLOW.green} />
          <HudLabel tone="green">Banca disponível</HudLabel>
        </div>
        <OddsTick
          value={balance}
          decimals={0}
          prefix="R$ "
          duration={0.6}
          className="mt-1 block text-3xl font-bold text-[#EDEAF7]"
        />
        <div className="mt-1 flex items-center gap-1 text-[11px] text-[#34F5A0]">
          <TrendingUp className="h-3 w-3" />
          <span className={mono()}>{greens} greens na comunidade hoje</span>
        </div>
      </div>

      {/* aposta ativa */}
      {hasActiveBet && (
        <div className={card}>
          <div className="flex items-center justify-between">
            <HudLabel tone="purple">Aposta ativa</HudLabel>
            <OddsChip tone="green">2.40×</OddsChip>
          </div>
          <p className="mt-1 text-sm font-medium text-[#EDEAF7]">Perder 8 kg</p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[rgba(139,131,168,0.16)]">
            <motion.div
              className="h-full rounded-full bg-[#34F5A0]"
              style={{ boxShadow: `0 0 8px ${GLOW.green}` }}
              initial={{ width: 0 }}
              animate={{ width: "68%" }}
              transition={{ duration: 1, ease: EASE_SOFT }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[11px]">
            <span className="text-[#8B83A8]">5,4 / 8 kg</span>
            <span className={cn(mono(), "text-[#34F5A0]")}>retorno R$ 480</span>
          </div>
        </div>
      )}

      {/* acumuladora mini */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" color={GLOW.purple} />
            <HudLabel tone="purple">Múltipla da semana</HudLabel>
          </span>
          <span className={cn(mono(), "text-sm font-bold text-[#8B5CF6]")}>1.62×</span>
        </div>
        <div className="mt-2 flex gap-1">
          {[1, 1, 1, 0, 0, 0, 0].map((on, i) => (
            <span
              key={i}
              className={cn(
                "h-6 flex-1 rounded-md",
                on
                  ? "bg-[#34F5A0]/85 shadow-[0_0_6px_rgba(52,245,160,0.5)]"
                  : "border border-[#8B5CF6]/30 bg-[#8B5CF6]/5",
              )}
            />
          ))}
        </div>
      </div>

      <motion.button
        type="button"
        onClick={onNew}
        whileTap={{ scale: 0.97 }}
        className={cn(
          mono(),
          "flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#8B5CF6] text-sm font-bold uppercase tracking-wide text-white shadow-[0_0_24px_-6px_rgba(139,92,246,0.9)]",
        )}
      >
        <Ticket className="h-4 w-4" />
        Nova aposta
      </motion.button>
    </div>
  );
}

/* ── TELA: Cupom (montar a aposta, retorno ao vivo) ───────────────────────── */
function CupomScreen({
  goal,
  goalId,
  setGoalId,
  stake,
  setStake,
  step,
  pct,
  odd,
  payout,
  profit,
  onBack,
  onConfirm,
}: {
  goal: Goal;
  goalId: string;
  setGoalId: (id: string) => void;
  stake: number;
  setStake: (n: number) => void;
  step: (d: number) => void;
  pct: number;
  odd: number;
  payout: number;
  profit: number;
  onBack: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar"
          className="grid h-8 w-8 place-items-center rounded-lg border border-[rgba(139,131,168,0.24)] text-[#EDEAF7] transition active:scale-90"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <Ticket className="h-4 w-4" color={GLOW.purple} />
        <h4 className="text-sm font-semibold text-[#EDEAF7]">Monte seu cupom</h4>
      </div>

      {/* escolher meta */}
      <div>
        <HudLabel>Palpite (sua meta)</HudLabel>
        <div className="mt-2 space-y-1.5">
          {GOALS.map((g) => {
            const on = g.id === goalId;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setGoalId(g.id)}
                aria-pressed={on}
                className={cn(
                  "flex min-h-[48px] w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left transition active:scale-[0.99]",
                  on
                    ? "border-[#8B5CF6] bg-[#8B5CF6]/15 shadow-[0_0_16px_-6px_rgba(139,92,246,0.9)]"
                    : "border-[rgba(139,131,168,0.2)] bg-[#0E0B1A]/60",
                )}
              >
                <span className="flex items-center gap-2">
                  <Target className="h-4 w-4 shrink-0" color={on ? GLOW.purple : GLOW.muted} />
                  <span>
                    <span className="block text-[13px] font-medium text-[#EDEAF7]">{g.titulo}</span>
                    <span className="block text-[10px] text-[#8B83A8]">{g.prazo}</span>
                  </span>
                </span>
                <OddsChip tone={on ? "green" : "muted"} active={on}>
                  {g.odd.toFixed(2)}×
                </OddsChip>
              </button>
            );
          })}
        </div>
      </div>

      {/* stake */}
      <div className={card}>
        <HudLabel>Banca (stake)</HudLabel>
        <div className="mt-1 flex items-center gap-2">
          <button
            type="button"
            onClick={() => step(-STAKE_STEP)}
            disabled={stake <= STAKE_MIN}
            aria-label="Diminuir stake"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[rgba(139,131,168,0.24)] bg-[#0E0B1A]/60 text-[#EDEAF7] transition active:scale-90 disabled:opacity-35"
          >
            <Minus className="h-4 w-4" />
          </button>
          <div className="flex flex-1 items-baseline justify-center">
            <span className={cn(mono(), "text-xs text-[#8B83A8]")}>R$</span>
            <OddsTick
              value={stake}
              decimals={0}
              duration={0.3}
              className="ml-1 text-2xl font-bold text-[#EDEAF7]"
            />
          </div>
          <button
            type="button"
            onClick={() => step(STAKE_STEP)}
            disabled={stake >= STAKE_MAX}
            aria-label="Aumentar stake"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[rgba(139,131,168,0.24)] bg-[#0E0B1A]/60 text-[#EDEAF7] transition active:scale-90 disabled:opacity-35"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <input
          type="range"
          min={STAKE_MIN}
          max={STAKE_MAX}
          step={STAKE_STEP}
          value={stake}
          onChange={(e) => setStake(Number(e.target.value))}
          aria-label="Ajustar stake"
          className="glow-range-phone mt-3 h-9 w-full cursor-pointer appearance-none bg-transparent"
          style={{
            background: `linear-gradient(90deg, ${GLOW.green} 0%, ${GLOW.purple} ${pct * 100}%, rgba(139,131,168,0.18) ${pct * 100}%)`,
            borderRadius: 999,
            height: 8,
          }}
        />
        <div className="mt-2 flex gap-1.5">
          {[100, 200, 500, 1000].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setStake(v)}
              className={cn(
                mono(),
                "flex-1 rounded-md border px-1 py-1 text-center text-[11px] transition active:scale-95",
                stake === v
                  ? "border-[#8B5CF6] bg-[#8B5CF6]/15 text-[#EDEAF7]"
                  : "border-[rgba(139,131,168,0.2)] text-[#8B83A8]",
              )}
            >
              {brl(v)}
            </button>
          ))}
        </div>
      </div>

      {/* cotação + retorno ao vivo */}
      <div className="grid grid-cols-3 gap-2">
        <div className={cn(card, "p-2.5")}>
          <HudLabel>Cotação</HudLabel>
          <OddsTick
            value={odd}
            decimals={2}
            suffix="×"
            className="mt-0.5 block text-base font-bold text-[#8B5CF6]"
          />
        </div>
        <div className={cn(card, "border-[#34F5A0]/30 bg-[#34F5A0]/[0.07] p-2.5")}>
          <HudLabel tone="green">Retorno</HudLabel>
          <OddsTick
            value={payout}
            decimals={0}
            prefix="R$ "
            className="mt-0.5 block text-base font-bold text-[#34F5A0]"
          />
        </div>
        <div className={cn(card, "p-2.5")}>
          <HudLabel>Lucro</HudLabel>
          <OddsTick
            value={profit}
            decimals={0}
            prefix="+"
            className="mt-0.5 block text-base font-bold text-[#34F5A0]"
          />
        </div>
      </div>

      <motion.button
        type="button"
        onClick={onConfirm}
        whileTap={{ scale: 0.97 }}
        className={cn(
          mono(),
          "flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#8B5CF6] text-sm font-bold uppercase tracking-wide text-white shadow-[0_0_22px_-6px_rgba(139,92,246,0.9)]",
        )}
      >
        <Zap className="h-4 w-4" />
        Fazer aposta · R$ {brl(stake)}
      </motion.button>
      <p className="pb-1 text-center text-[10px] text-[#8B83A8]">
        {goal.titulo} · a única aposta em que você torce pra você ganhar.
      </p>

      <style>{`
        .glow-range-phone::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 22px; height: 22px; border-radius: 999px;
          background: ${GLOW.green}; border: 3px solid #0E0B1A;
          box-shadow: 0 0 12px ${GLOW.green}; cursor: pointer; margin-top: -7px;
        }
        .glow-range-phone::-moz-range-thumb {
          width: 22px; height: 22px; border-radius: 999px;
          background: ${GLOW.green}; border: 3px solid #0E0B1A;
          box-shadow: 0 0 12px ${GLOW.green}; cursor: pointer;
        }
      `}</style>
    </div>
  );
}

/* ── TELA: Confirmação ────────────────────────────────────────────────────── */
function ConfirmScreen({
  goal,
  stake,
  odd,
  payout,
  onBack,
  onGreen,
}: {
  goal: Goal;
  stake: number;
  odd: number;
  payout: number;
  onBack: () => void;
  onGreen: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar"
          className="grid h-8 w-8 place-items-center rounded-lg border border-[rgba(139,131,168,0.24)] text-[#EDEAF7] transition active:scale-90"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <Check className="h-4 w-4" color={GLOW.green} />
        <h4 className="text-sm font-semibold text-[#EDEAF7]">Aposta feita!</h4>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE_SOFT }}
          className={cn(card, "border-[#8B5CF6]/40 bg-[#8B5CF6]/[0.08]")}
        >
          <HudLabel tone="purple">Cupom #CHY-8842 · confirmado</HudLabel>
          <p className="mt-1 text-base font-semibold text-[#EDEAF7]">{goal.titulo}</p>
          <p className="text-[11px] text-[#8B83A8]">{goal.prazo}</p>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              ["Stake", `R$ ${brl(stake)}`, "text-[#EDEAF7]"],
              ["Cotação", `${odd.toFixed(2)}×`, "text-[#8B5CF6]"],
              ["Retorno", `R$ ${brl(payout)}`, "text-[#34F5A0]"],
            ].map(([k, v, c]) => (
              <div
                key={k}
                className="rounded-lg border border-[rgba(139,131,168,0.16)] bg-[#0E0B1A]/60 p-2"
              >
                <div className="text-[9px] uppercase tracking-wider text-[#8B83A8]">{k}</div>
                <div className={cn(mono(), "mt-0.5 text-sm font-bold", c)}>{v}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-3 flex items-center gap-2 rounded-xl border border-[rgba(139,131,168,0.16)] bg-[#171327] p-3">
          <span className="relative flex h-2.5 w-2.5">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-[#34F5A0]"
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.6, 1] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#34F5A0]" />
          </span>
          <span className="text-[12px] text-[#8B83A8]">
            Acompanhando seu progresso rumo ao green…
          </span>
        </div>

        <div className="mt-auto pt-4">
          <p className="mb-2 text-center text-[11px] text-[#8B83A8]">
            Simule o desfecho: você cumpriu a meta.
          </p>
          <motion.button
            type="button"
            onClick={onGreen}
            whileTap={{ scale: 0.97 }}
            className={cn(
              mono(),
              "flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#34F5A0] text-sm font-bold uppercase tracking-wide text-[#0E0B1A] shadow-[0_0_24px_-6px_rgba(52,245,160,0.9)]",
            )}
          >
            <Trophy className="h-4 w-4" />
            Cumpri a meta · deu green
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/* ── TELA: DEU GREEN (payout + celebração) ────────────────────────────────── */
function GreenScreen({
  goal,
  stake,
  payout,
  profit,
  greens,
  onAgain,
}: {
  goal: Goal;
  stake: number;
  payout: number;
  profit: number;
  greens: number;
  onAgain: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="relative">
          {/* ripple do "deu green" */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#34F5A0]"
              initial={{ scale: 0.6, opacity: 0.6 }}
              animate={{ scale: 2.4, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: i * 0.6,
              }}
            />
          ))}
          {/* confete A MÃO (offsets determinísticos por index) */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {Array.from({ length: CONFETTI }).map((_, i) => {
              const angle = (i / CONFETTI) * Math.PI * 2;
              const dist = 80 + ((i * 31) % 60);
              const c = i % 3 === 0 ? GLOW.green : i % 3 === 1 ? GLOW.purple : "#EDEAF7";
              return (
                <motion.span
                  key={i}
                  aria-hidden
                  className="absolute rounded-[1px]"
                  style={{ width: 6, height: 11, background: c }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
                  animate={{
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist,
                    opacity: 0,
                    scale: 0.3,
                    rotate: (i % 2 ? 1 : -1) * 240,
                  }}
                  transition={{
                    duration: 1.1,
                    ease: "easeOut",
                    delay: (i % 5) * 0.02,
                  }}
                />
              );
            })}
          </div>

          <motion.div
            className="relative grid h-20 w-20 place-items-center rounded-full bg-[#34F5A0]"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 16 }}
          >
            <Check className="h-10 w-10" strokeWidth={3} color={GLOW.bg} />
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={cn(
            mono(),
            "mt-5 text-2xl font-bold uppercase tracking-[0.04em] text-[#34F5A0]",
          )}
          style={{ textShadow: "0 0 18px rgba(52,245,160,0.55)" }}
        >
          Deu green!
        </motion.p>
        <p className="mt-1 text-[12px] text-[#8B83A8]">Meta cumprida · {goal.titulo}</p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-5 w-full rounded-2xl border border-[#34F5A0]/30 bg-[#34F5A0]/[0.08] p-4"
        >
          <HudLabel tone="green">Retorno creditado</HudLabel>
          <OddsTick
            value={payout}
            decimals={0}
            prefix="R$ "
            duration={1.1}
            className="mt-1 block text-4xl font-bold text-[#34F5A0]"
          />
          <div className={cn(mono(), "mt-1 text-[11px] text-[#8B83A8]")}>
            banca R$ {brl(stake)} · lucro +R$ {brl(profit)}
          </div>
        </motion.div>
      </div>

      <div className={cn(card, "mt-3")}>
        <div className="flex items-center gap-2">
          <AvatarStack
            people={[USERS[1], USERS[8], USERS[6]].map((u) => ({
              name: u.name,
              avatar: u.avatar,
            }))}
            size={26}
            tone="green"
          />
          <span className="text-[11px] text-[#8B83A8]">+{greens} pessoas deram green hoje</span>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={onAgain}
        whileTap={{ scale: 0.97 }}
        className={cn(
          mono(),
          "mt-3 flex min-h-[48px] w-full items-center justify-center gap-1 rounded-xl border border-[#34F5A0]/45 bg-[#34F5A0]/12 text-sm font-bold uppercase tracking-wide text-[#34F5A0]",
        )}
      >
        <RotateCcw className="h-4 w-4" />
        Apostar de novo
        <ChevronRight className="h-4 w-4" />
      </motion.button>
    </div>
  );
}

/* ── TELA: Perfil (acessível pela tab bar) ────────────────────────────────── */
function ProfileScreen({
  me,
  balance,
  greens,
}: {
  me: (typeof USERS)[number];
  balance: number;
  greens: number;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col items-center pt-2 text-center">
        <AvatarMedallion src={me.avatar} alt={me.name} size={72} tone="green" pulse />
        <p className="mt-3 text-base font-semibold text-[#EDEAF7]">{me.name}</p>
        <p className={cn(mono(), "text-[11px] text-[#8B83A8]")}>{me.handle} · Tier Estável</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className={cn(card, "text-center")}>
          <HudLabel tone="green">Banca</HudLabel>
          <OddsTick
            value={balance}
            decimals={0}
            prefix="R$ "
            duration={0.6}
            className="mt-1 block text-xl font-bold text-[#EDEAF7]"
          />
        </div>
        <div className={cn(card, "text-center")}>
          <HudLabel tone="purple">Streak</HudLabel>
          <div className={cn(mono(), "mt-1 text-xl font-bold text-[#8B5CF6]")}>047 d</div>
        </div>
      </div>

      <div className={card}>
        <HudLabel>Histórico de greens</HudLabel>
        <div className="mt-2 space-y-1.5">
          {[
            ["Perder 4 kg", "R$ 360", true],
            ["Treinar 16x", "R$ 240", true],
            ["Ler 3 livros", "R$ 180", true],
          ].map(([t, v]) => (
            <div
              key={t as string}
              className="flex items-center justify-between rounded-lg border-b border-[rgba(139,131,168,0.12)] py-1.5"
            >
              <span className="flex items-center gap-1.5 text-[13px] text-[#EDEAF7]">
                <Check className="h-3.5 w-3.5" color={GLOW.green} strokeWidth={3} />
                {t}
              </span>
              <span className={cn(mono(), "text-sm font-semibold text-[#34F5A0]")}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={cn(card, "flex items-center gap-2 border-[#34F5A0]/25 bg-[#34F5A0]/[0.06]")}>
        <Trophy className="h-4 w-4 shrink-0" color={GLOW.green} />
        <span className="text-[12px] text-[#8B83A8]">
          Você faz parte dos <span className="text-[#34F5A0]">{greens}</span> greens de hoje.
        </span>
      </div>
    </div>
  );
}
