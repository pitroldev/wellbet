import { describe, expect, it, vi } from "vitest";

/**
 * Mock de @charya/schemas/plausibility.
 *
 * A função compartilhada vive no pacote schemas (fonte única banco↔front).
 * Aqui mockamos com a fórmula do doc (§6) para testar a REGRA DE DECISÃO do
 * domínio (`checkSanity`) de forma isolada, sem depender da instalação do
 * pacote. Quando @charya/schemas estiver presente, o contrato é o mesmo:
 *   lossPerWeekKg({ previousWeightKg, currentWeightKg, weeks }) -> number.
 */
vi.mock("@charya/schemas/plausibility", () => ({
  lossPerWeekKg: ({
    previousWeightKg,
    currentWeightKg,
    weeks,
  }: {
    previousWeightKg: number;
    currentWeightKg: number;
    weeks: number;
  }) => (previousWeightKg - currentWeightKg) / weeks,
}));

const { checkSanity } = await import("./sanity.js");

describe("checkSanity — regra dura de plausibilidade (doc Validação §6)", () => {
  const hardLimitKgPerWeek = 4;

  it("aprova perda gradual dentro do limite (segue para revisor)", () => {
    // 2 kg em 2 semanas = 1 kg/semana, abaixo de 4.
    const result = checkSanity({
      previousWeightKg: 92,
      currentWeightKg: 90,
      weeks: 2,
      hardLimitKgPerWeek,
    });

    expect(result.ok).toBe(true);
    expect(result.lossPerWeekKg).toBeCloseTo(1);
  });

  it("BLOQUEIA perda absurda (ex.: 18 kg em ~3 semanas → 6 kg/semana > 4)", () => {
    const result = checkSanity({
      previousWeightKg: 100,
      currentWeightKg: 82,
      weeks: 3,
      hardLimitKgPerWeek,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("implausible_loss");
      expect(result.lossPerWeekKg).toBeCloseTo(6);
      expect(result.hardLimitKgPerWeek).toBe(hardLimitKgPerWeek);
    }
  });

  it("é exatamente no limite → NÃO bloqueia (limite é estritamente maior)", () => {
    // 8 kg em 2 semanas = 4 kg/semana == limite. `> limite` é falso → ok.
    const result = checkSanity({
      previousWeightKg: 88,
      currentWeightKg: 80,
      weeks: 2,
      hardLimitKgPerWeek,
    });

    expect(result.ok).toBe(true);
    expect(result.lossPerWeekKg).toBeCloseTo(4);
  });

  it("ganho de peso (perda negativa) nunca bloqueia", () => {
    const result = checkSanity({
      previousWeightKg: 80,
      currentWeightKg: 82,
      weeks: 1,
      hardLimitKgPerWeek,
    });

    expect(result.ok).toBe(true);
    expect(result.lossPerWeekKg).toBeLessThan(0);
  });

  it("protege contra divisão por zero quando weeks <= 0", () => {
    const result = checkSanity({
      previousWeightKg: 90,
      currentWeightKg: 89,
      weeks: 0,
      hardLimitKgPerWeek,
    });

    // weeks=0 vira EPSILON → perda enorme → bloqueio, mas sem NaN/Infinity quebrar.
    expect(Number.isFinite(result.lossPerWeekKg)).toBe(true);
    expect(result.ok).toBe(false);
  });
});
