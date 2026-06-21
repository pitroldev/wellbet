import { describe, expect, it } from "vitest";
import { checkPlausibility, lossPerWeekKg, WeightKg } from "./index.js";

/* -------------------------------------------------------------------------- */
/* common                                                                      */
/* -------------------------------------------------------------------------- */

describe("WeightKg", () => {
  it("aceita peso plausível com resolução de 0,1 kg", () => {
    expect(WeightKg.parse(82.4)).toBe(82.4);
  });

  it("rejeita peso fora da faixa sanitária", () => {
    expect(WeightKg.safeParse(5).success).toBe(false);
    expect(WeightKg.safeParse(500).success).toBe(false);
  });

  it("rejeita resolução mais fina que 0,1 kg", () => {
    expect(WeightKg.safeParse(82.43).success).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/* plausibility (a regra dura)                                                 */
/* -------------------------------------------------------------------------- */

describe("checkPlausibility", () => {
  it("calcula perda por semana", () => {
    expect(
      lossPerWeekKg({
        previousWeightKg: WeightKg.parse(90),
        currentWeightKg: WeightKg.parse(88),
        daysElapsed: 7,
      }),
    ).toBeCloseTo(2);
  });

  it("bloqueia perda fisicamente impossível (18 kg em 20 dias)", () => {
    const res = checkPlausibility({
      previousWeightKg: WeightKg.parse(100),
      currentWeightKg: WeightKg.parse(82),
      daysElapsed: 20,
    });
    expect(res.outcome).toBe("blocked");
  });

  it("sinaliza (flag) perda agressiva mas não impossível", () => {
    const res = checkPlausibility({
      previousWeightKg: WeightKg.parse(100),
      currentWeightKg: WeightKg.parse(97),
      daysElapsed: 7,
    });
    expect(res.outcome).toBe("flagged");
  });

  it("aprova (ok) perda plausível e também ganho de peso", () => {
    expect(
      checkPlausibility({
        previousWeightKg: WeightKg.parse(90),
        currentWeightKg: WeightKg.parse(89),
        daysElapsed: 7,
      }).outcome,
    ).toBe("ok");
    expect(
      checkPlausibility({
        previousWeightKg: WeightKg.parse(89),
        currentWeightKg: WeightKg.parse(90),
        daysElapsed: 7,
      }).outcome,
    ).toBe("ok");
  });
});
