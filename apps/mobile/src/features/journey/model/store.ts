/**
 * Journey store — a ESPINHA do app (local-first, Zustand + MMKV).
 *
 * Modela o estágio da jornada e dirige a home: cada estágio expõe exatamente um
 * próximo passo (Duolingo). A API real entra como costura nas actions; aqui o
 * estado é local-autoritativo, então o app fica 100% navegável sem backend.
 *
 * O ONBOARDING agora é um funil linear (welcome→quiz→motivação→medidas→meta→odds→
 * conta→vídeo) que vai ACUMULANDO no store (quiz, medidas, betDraft) e fecha tudo
 * em `completeOnboarding()` (cria a bet + marca baseline revisado + onboardingDone).
 */
import { create } from "zustand";

import { kv, StorageKeys } from "@/shared/lib/storage";

import { hitTarget } from "./derive";
import type { BetDraft, BetPhase, CheckIn, JourneyBet, JourneyStage, QuizAnswers } from "./types";

/** Quanto antes do prazo a janela da pesagem final abre (24h). */
const WINDOW_LEAD_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * 86_400_000;

interface Persisted {
  hasAccount: boolean;
  name: string | null;
  onboardingDone: boolean;
  quiz: QuizAnswers | null;
  heightCm: number | null;
  /** Rascunho da aposta coletado no onboarding (meta+prazo+valor). */
  betDraft: BetDraft | null;
  baselineWeightKg: number | null;
  baselineReviewedAt: number | null;
  bet: JourneyBet | null;
  betPhase: BetPhase;
  /** Peso da pesagem final, guardado enquanto está "em revisão". */
  pendingFinalKg: number | null;
  checkIns: CheckIn[];
  lessonsSeenIds: string[];
  lastLessonAt: number | null;
}

type NewBetInput = Pick<
  JourneyBet,
  "startWeightKg" | "targetWeightKg" | "stakeAmount" | "deadlineAt"
> &
  Partial<Pick<JourneyBet, "betId" | "brcode">>;

interface JourneyActions {
  createAccount(name: string): void;
  /** Sincroniza o flag de conta com a sessão real (login/logout). */
  setHasAccount(v: boolean): void;
  /** Onboarding passo 2 — guarda as respostas do quiz (NÃO finaliza o onboarding). */
  setQuiz(quiz: QuizAnswers): void;
  /** Onboarding passo 4 — peso + altura (baseline ainda NÃO revisado: falta o vídeo). */
  setMeasures(weightKg: number, heightCm: number): void;
  /** Onboarding passos 5–6 — meta, prazo e valor da aposta (rascunho). */
  setBetDraft(draft: BetDraft): void;
  /** Onboarding passo 10 — fecha o funil: cria a bet, marca baseline revisado, conclui. */
  completeOnboarding(): void;
  /** Registra o baseline e, no MVP local, aprova na hora (sem revisor real). */
  setBaseline(weightKg: number): void;
  createBet(input: NewBetInput): void;
  confirmPayment(): void;
  /** Envia a pesagem final (guarda o peso) → vai pra revisão. */
  submitFinal(weightKg: number): void;
  /** Conclui a revisão da final: decide won/lost pelo peso guardado. */
  resolveFinal(): void;
  settle(won: boolean): void;
  /** Encerra a aposta atual e limpa pra uma nova rodada (mantém conta/baseline). */
  newRound(): void;
  addCheckIn(weightKg: number): void;
  markLessonSeen(id: string): void;
  /** Helper de DEMO: abre a janela da pesagem final agora (encurta o prazo). */
  fastForwardToWindow(): void;
  reset(): void;
}

export type JourneyState = Persisted & JourneyActions;

const initial: Persisted = {
  hasAccount: false,
  name: null,
  onboardingDone: false,
  quiz: null,
  heightCm: null,
  betDraft: null,
  baselineWeightKg: null,
  baselineReviewedAt: null,
  bet: null,
  betPhase: "none",
  pendingFinalKg: null,
  checkIns: [],
  lessonsSeenIds: [],
  lastLessonAt: null,
};

function load(): Persisted {
  return { ...initial, ...(kv.getJSON<Partial<Persisted>>(StorageKeys.journey) ?? {}) };
}

export const useJourney = create<JourneyState>((set, get) => {
  function commit(patch: Partial<Persisted>) {
    set(patch as Partial<JourneyState>);
    const s = get();
    const snapshot: Persisted = {
      hasAccount: s.hasAccount,
      name: s.name,
      onboardingDone: s.onboardingDone,
      quiz: s.quiz,
      heightCm: s.heightCm,
      betDraft: s.betDraft,
      baselineWeightKg: s.baselineWeightKg,
      baselineReviewedAt: s.baselineReviewedAt,
      bet: s.bet,
      betPhase: s.betPhase,
      pendingFinalKg: s.pendingFinalKg,
      checkIns: s.checkIns,
      lessonsSeenIds: s.lessonsSeenIds,
      lastLessonAt: s.lastLessonAt,
    };
    kv.setJSON(StorageKeys.journey, snapshot);
  }

  return {
    ...load(),

    createAccount: (name) => commit({ hasAccount: true, name }),
    setHasAccount: (v) => commit({ hasAccount: v }),
    setQuiz: (quiz) => commit({ quiz }),
    setMeasures: (weightKg, heightCm) => commit({ baselineWeightKg: weightKg, heightCm }),
    setBetDraft: (draft) => commit({ betDraft: draft }),
    completeOnboarding: () => {
      const { baselineWeightKg, betDraft } = get();
      if (baselineWeightKg == null || betDraft == null) return;
      commit({
        baselineReviewedAt: Date.now(),
        bet: {
          createdAt: Date.now(),
          startWeightKg: baselineWeightKg,
          targetWeightKg: betDraft.targetWeightKg,
          stakeAmount: betDraft.stakeAmount,
          deadlineAt: Date.now() + betDraft.weeks * WEEK_MS,
        },
        betPhase: "payment",
        onboardingDone: true,
      });
    },
    setBaseline: (weightKg) =>
      commit({ baselineWeightKg: weightKg, baselineReviewedAt: Date.now() }),
    createBet: (input) =>
      commit({ bet: { createdAt: Date.now(), ...input }, betPhase: "payment" }),
    confirmPayment: () => commit({ betPhase: "active" }),
    submitFinal: (weightKg) => commit({ betPhase: "final-review", pendingFinalKg: weightKg }),
    resolveFinal: () => {
      const { bet, pendingFinalKg } = get();
      if (bet == null || pendingFinalKg == null) return;
      commit({ betPhase: hitTarget(bet, pendingFinalKg) ? "won" : "lost", pendingFinalKg: null });
    },
    settle: (won) => commit({ betPhase: won ? "won" : "lost" }),
    newRound: () =>
      commit({ bet: null, betPhase: "none", pendingFinalKg: null, checkIns: [], betDraft: null }),
    addCheckIn: (weightKg) =>
      commit({ checkIns: [...get().checkIns, { at: Date.now(), weightKg }] }),
    markLessonSeen: (id) =>
      commit({
        lessonsSeenIds: get().lessonsSeenIds.includes(id)
          ? get().lessonsSeenIds
          : [...get().lessonsSeenIds, id],
        lastLessonAt: Date.now(),
      }),
    fastForwardToWindow: () => {
      const bet = get().bet;
      if (bet == null) return;
      commit({ bet: { ...bet, deadlineAt: Date.now() } });
    },
    reset: () => commit({ ...initial }),
  };
});

/** A janela da pesagem final está aberta? (perto do prazo). */
export function isWindowOpen(bet: JourneyBet, now = Date.now()): boolean {
  return now >= bet.deadlineAt - WINDOW_LEAD_MS;
}

/** Deriva o estágio da jornada a partir do estado — a home liga nisto. */
export function selectStage(s: JourneyState): JourneyStage {
  if (!s.onboardingDone) return "onboarding";
  if (s.baselineWeightKg == null) return "no-baseline";
  if (s.baselineReviewedAt == null) return "baseline-review";
  if (s.bet == null || s.betPhase === "none") return "no-bet";
  // A conta só é pedida DEPOIS de pesar + montar o bilhete (compromisso antes do Pix).
  if (!s.hasAccount) return "no-account";
  if (s.betPhase === "payment") return "payment";
  if (s.betPhase === "won") return "won";
  if (s.betPhase === "lost") return "lost";
  if (s.betPhase === "final-review") return "final-review";
  return isWindowOpen(s.bet) ? "window" : "active";
}
