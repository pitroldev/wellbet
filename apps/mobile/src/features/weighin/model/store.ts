/**
 * Store Zustand do fluxo de captura da pesagem.
 *
 * Responsabilidade: estado de UI do fluxo (fase, etapa do roteiro atual,
 * vídeo gravado, desafio dinâmico ativo). NÃO faz I/O — upload/registro vão
 * pelos hooks de TanStack Query (`../api`). Estado de servidor não mora aqui.
 *
 * O rascunho é persistido em MMKV para sobreviver a um kill do app no meio do
 * fluxo (rede móvel instável).
 */
import { create } from "zustand";

import { kv, StorageKeys } from "@/shared/lib/storage";

import {
  CAPTURE_STEPS,
  type CapturePhase,
  type CapturePoint,
  type CaptureStep,
  type Challenge,
  type RecordedVideo,
} from "./types";

interface WeighInDraft {
  capturePoint: CapturePoint;
  challenge: Challenge | null;
  video: RecordedVideo | null;
}

interface WeighInState extends WeighInDraft {
  phase: CapturePhase;
  /** Índice da etapa atual do roteiro (0..5). */
  stepIndex: number;
  error: string | null;

  // ações
  begin: (capturePoint: CapturePoint, challenge: Challenge) => void;
  setPhase: (phase: CapturePhase) => void;
  nextStep: () => void;
  setVideo: (video: RecordedVideo) => void;
  setError: (message: string) => void;
  reset: () => void;
}

const initialDraft: WeighInDraft = {
  capturePoint: "T0",
  challenge: null,
  video: null,
};

export const useWeighInStore = create<WeighInState>((set, get) => ({
  ...initialDraft,
  phase: "idle",
  stepIndex: 0,
  error: null,

  begin: (capturePoint, challenge) => {
    set({
      capturePoint,
      challenge,
      video: null,
      phase: "instructions",
      stepIndex: 0,
      error: null,
    });
    kv.setJSON(StorageKeys.weighinDraft, {
      capturePoint,
      challengeId: challenge.challengeId,
    });
  },

  setPhase: (phase) => set({ phase }),

  nextStep: () => {
    const { stepIndex } = get();
    const next = Math.min(stepIndex + 1, CAPTURE_STEPS.length - 1);
    set({ stepIndex: next });
  },

  setVideo: (video) => set({ video, phase: "review" }),

  setError: (message) => set({ error: message, phase: "error" }),

  reset: () => {
    kv.remove(StorageKeys.weighinDraft);
    set({ ...initialDraft, phase: "idle", stepIndex: 0, error: null });
  },
}));

/** Selector: etapa atual do roteiro. */
export function selectCurrentStep(state: WeighInState): CaptureStep {
  return CAPTURE_STEPS[state.stepIndex] ?? CAPTURE_STEPS[0]!;
}
