/**
 * Testes do store de captura (Jest — Vitest não suporta RN).
 *
 * Valida o avanço de etapas do roteiro (MVP §4) e o reset. Não toca módulos
 * nativos (o store é puro JS); MMKV está mockado no jest-setup.
 */
import { CAPTURE_STEPS } from "../types";
import { selectCurrentStep, useWeighInStore } from "../store";
import type { Challenge } from "../types";

// Fixture com o shape de `Challenge` (@charya/schemas). Os ids/timestamps são
// branded em runtime via Zod; no teste de UI usamos um cast simples — o store
// só transporta o objeto, não o re-valida.
const challenge = {
  id: "11111111-1111-4111-8111-111111111111",
  betId: "22222222-2222-4222-8222-222222222222",
  capturePoint: "T0",
  word: "pomar",
  code: "4827",
  gesture: "thumbs_up",
  nonce: "pomar-4827-thumbs_up",
  issuedAt: "2026-06-20T12:00:00.000Z",
  expiresAt: "2026-06-20T12:05:00.000Z",
} as unknown as Challenge;

beforeEach(() => {
  useWeighInStore.getState().reset();
});

describe("useWeighInStore", () => {
  it("inicia em idle e na primeira etapa", () => {
    const s = useWeighInStore.getState();
    expect(s.phase).toBe("idle");
    expect(selectCurrentStep(s)).toBe(CAPTURE_STEPS[0]);
  });

  it("begin define o desafio e vai para instructions", () => {
    useWeighInStore.getState().begin("T0", challenge);
    const s = useWeighInStore.getState();
    expect(s.phase).toBe("instructions");
    expect(s.challenge?.id).toBe("ch_1");
    expect(s.stepIndex).toBe(0);
  });

  it("nextStep avança sem ultrapassar a última etapa", () => {
    const { nextStep } = useWeighInStore.getState();
    for (let i = 0; i < CAPTURE_STEPS.length + 3; i++) nextStep();
    const s = useWeighInStore.getState();
    expect(s.stepIndex).toBe(CAPTURE_STEPS.length - 1);
    expect(selectCurrentStep(s)).toBe(CAPTURE_STEPS[CAPTURE_STEPS.length - 1]);
  });

  it("setVideo move para review", () => {
    useWeighInStore.getState().setVideo({ uri: "file:///v.mp4", durationMs: 12000 });
    expect(useWeighInStore.getState().phase).toBe("review");
  });

  it("reset volta ao estado inicial", () => {
    useWeighInStore.getState().begin("T1", challenge);
    useWeighInStore.getState().reset();
    const s = useWeighInStore.getState();
    expect(s.phase).toBe("idle");
    expect(s.challenge).toBeNull();
  });
});
