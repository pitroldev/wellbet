import { describe, expect, it } from "vitest";
import {
  Bet,
  BetGoal,
  Challenge,
  CapturePoint,
  checkPlausibility,
  CHECKLIST_ITEMS,
  isStaff,
  lossPerWeekKg,
  ReviewDecision,
  Role,
  User,
  WeighIn,
  WeightKg,
} from "./index.js";

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
/* identity                                                                    */
/* -------------------------------------------------------------------------- */

describe("Role / isStaff", () => {
  it("valida papéis conhecidos", () => {
    expect(Role.parse("reviewer")).toBe("reviewer");
    expect(Role.safeParse("superuser").success).toBe(false);
  });

  it("reconhece staff", () => {
    expect(isStaff("reviewer")).toBe(true);
    expect(isStaff("admin")).toBe(true);
    expect(isStaff("user")).toBe(false);
  });
});

describe("User", () => {
  it("faz parse de um usuário válido com defaults", () => {
    const user = User.parse({
      id: "11111111-1111-4111-8111-111111111111",
      email: "a@b.com",
      profile: { displayName: "Fulano" },
      createdAt: "2026-06-20T00:00:00Z",
      updatedAt: "2026-06-20T00:00:00Z",
    });
    expect(user.role).toBe("user");
    expect(user.emailVerified).toBe(false);
    expect(user.profile.sex).toBe("unspecified");
  });

  it("rejeita email inválido", () => {
    const res = User.safeParse({
      id: "11111111-1111-4111-8111-111111111111",
      email: "not-an-email",
      profile: { displayName: "Fulano" },
      createdAt: "2026-06-20T00:00:00Z",
      updatedAt: "2026-06-20T00:00:00Z",
    });
    expect(res.success).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/* bet                                                                         */
/* -------------------------------------------------------------------------- */

describe("BetGoal", () => {
  it("exige meta menor que o peso inicial", () => {
    expect(BetGoal.safeParse({ startWeightKg: 90, targetWeightKg: 80 }).success).toBe(true);
    expect(BetGoal.safeParse({ startWeightKg: 80, targetWeightKg: 90 }).success).toBe(false);
  });
});

describe("Bet", () => {
  it("faz parse de uma aposta válida", () => {
    const bet = Bet.parse({
      id: "22222222-2222-4222-8222-222222222222",
      userId: "11111111-1111-4111-8111-111111111111",
      goal: { startWeightKg: 90, targetWeightKg: 80 },
      window: {
        startsAt: "2026-06-01T00:00:00Z",
        endsAt: "2026-08-01T00:00:00Z",
      },
      stake: { amountCents: 10000, currency: "BRL" },
      payout: { amountCents: 18000, currency: "BRL" },
      createdAt: "2026-06-01T00:00:00Z",
      updatedAt: "2026-06-01T00:00:00Z",
    });
    expect(bet.status).toBe("draft");
  });

  it("rejeita janela com fim antes do início", () => {
    const res = Bet.safeParse({
      id: "22222222-2222-4222-8222-222222222222",
      userId: "11111111-1111-4111-8111-111111111111",
      goal: { startWeightKg: 90, targetWeightKg: 80 },
      window: {
        startsAt: "2026-08-01T00:00:00Z",
        endsAt: "2026-06-01T00:00:00Z",
      },
      stake: { amountCents: 10000, currency: "BRL" },
      payout: { amountCents: 18000, currency: "BRL" },
      createdAt: "2026-06-01T00:00:00Z",
      updatedAt: "2026-06-01T00:00:00Z",
    });
    expect(res.success).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/* weighin                                                                     */
/* -------------------------------------------------------------------------- */

describe("CapturePoint", () => {
  it("só aceita T0/T1/T2", () => {
    expect(CapturePoint.options).toEqual(["T0", "T1", "T2"]);
    expect(CapturePoint.safeParse("T3").success).toBe(false);
  });
});

describe("Challenge", () => {
  it("exige validade posterior à emissão e código de 4 dígitos", () => {
    const base = {
      id: "33333333-3333-4333-8333-333333333333",
      betId: "22222222-2222-4222-8222-222222222222",
      capturePoint: "T0",
      word: "mango",
      code: "4821",
      gesture: "thumbs_up",
      nonce: "mango-4821-thumbs_up",
      issuedAt: "2026-06-20T00:00:00Z",
      expiresAt: "2026-06-20T00:02:00Z",
    };
    expect(Challenge.safeParse(base).success).toBe(true);
    expect(Challenge.safeParse({ ...base, code: "12" }).success).toBe(false);
    expect(Challenge.safeParse({ ...base, expiresAt: "2026-06-19T00:00:00Z" }).success).toBe(false);
  });
});

describe("WeighIn (discriminated union por state)", () => {
  const capture = {
    challengeId: "33333333-3333-4333-8333-333333333333",
    videoRef: "https://r2.example.com/videos/abc.mp4",
    displayedNonce: "mango-4821-thumbs_up",
    declaredWeight: 88.2,
    deviceMeta: {
      platform: "ios",
      osVersion: "26.0",
      appVersion: "1.0.0",
      capturedInApp: true,
    },
    recordedAt: "2026-06-20T00:01:00Z",
  };
  const base = {
    id: "44444444-4444-4444-8444-444444444444",
    betId: "22222222-2222-4222-8222-222222222222",
    userId: "11111111-1111-4111-8111-111111111111",
    capturePoint: "T0",
    capture,
    createdAt: "2026-06-20T00:01:00Z",
    updatedAt: "2026-06-20T00:01:00Z",
  };

  it("faz parse do estado blocked com blockReason", () => {
    const w = WeighIn.parse({
      ...base,
      state: "blocked",
      blockReason: "Perda absurda.",
    });
    expect(w.state).toBe("blocked");
  });

  it("rejeita blocked sem blockReason", () => {
    expect(WeighIn.safeParse({ ...base, state: "blocked" }).success).toBe(false);
  });

  it("rejeita state desconhecido", () => {
    expect(WeighIn.safeParse({ ...base, state: "archived" }).success).toBe(false);
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

/* -------------------------------------------------------------------------- */
/* review                                                                      */
/* -------------------------------------------------------------------------- */

function fullChecklist(overrides: Partial<Record<string, "pass" | "fail" | "na">> = {}) {
  return CHECKLIST_ITEMS.map((item) => {
    const status = overrides[item] ?? "pass";
    return status === "fail" ? { item, status, note: "motivo do reprovo" } : { item, status };
  });
}

describe("ReviewDecision", () => {
  const base = {
    id: "55555555-5555-4555-8555-555555555555",
    weighInId: "44444444-4444-4444-8444-444444444444",
    reviewerId: "11111111-1111-4111-8111-111111111111",
    checklist: fullChecklist(),
    reason: "Tudo confere.",
    sanityOutcome: "ok",
    decidedAt: "2026-06-20T01:00:00Z",
    createdAt: "2026-06-20T01:00:00Z",
    updatedAt: "2026-06-20T01:00:00Z",
  };

  it("aprova quando checklist passa e sanidade ok", () => {
    const d = ReviewDecision.parse({ ...base, verdict: "APROVADO" });
    expect(d.verdict).toBe("APROVADO");
    expect(d.isFraudExample).toBe(false);
  });

  it("rejeita APROVADO sobre pesagem bloqueada pela regra dura", () => {
    const res = ReviewDecision.safeParse({
      ...base,
      verdict: "APROVADO",
      sanityOutcome: "blocked",
    });
    expect(res.success).toBe(false);
  });

  it("rejeita REPROVADO sem item falho nem bloqueio duro", () => {
    const res = ReviewDecision.safeParse({ ...base, verdict: "REPROVADO" });
    expect(res.success).toBe(false);
  });

  it("aceita REPROVADO com item falho e flag de fraude", () => {
    const d = ReviewDecision.parse({
      ...base,
      verdict: "REPROVADO",
      checklist: fullChecklist({ same_person: "fail" }),
      isFraudExample: true,
      failedItems: ["same_person"],
      labels: ["pessoa diferente"],
    });
    expect(d.verdict).toBe("REPROVADO");
    expect(d.failedItems).toContain("same_person");
  });

  it("exige note em item reprovado do checklist", () => {
    const res = ReviewDecision.safeParse({
      ...base,
      verdict: "REPROVADO",
      checklist: CHECKLIST_ITEMS.map((item) =>
        item === "freshness" ? { item, status: "fail" } : { item, status: "pass" },
      ),
      failedItems: ["freshness"],
    });
    expect(res.success).toBe(false);
  });
});
