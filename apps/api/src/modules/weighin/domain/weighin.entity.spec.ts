import { describe, expect, it } from "vitest";

import { WeighIn, type WeighInProps } from "./weighin.entity.js";

function makeWeighIn(over: Partial<WeighInProps> = {}): WeighIn {
  return WeighIn.create({
    id: "w-1",
    userId: "u-1",
    betId: "bet-1",
    challengeId: "ch-1",
    kind: "final",
    weightKg: 79,
    videoObjectKey: "weighins/u-1/bet-1/final.mp4",
    status: "pending",
    lossPerWeekKg: null,
    capturedAt: new Date("2026-06-21T10:00:00.000Z"),
    ...over,
  });
}

describe("WeighIn — entidade de domínio", () => {
  describe("create + getters + toJSON", () => {
    it("expõe as props via getters", () => {
      const w = makeWeighIn({ weightKg: 80.5, lossPerWeekKg: 1.2 });

      expect(w.id).toBe("w-1");
      expect(w.userId).toBe("u-1");
      expect(w.kind).toBe("final");
      expect(w.weightKg).toBe(80.5);
      expect(w.status).toBe("pending");
      expect(w.lossPerWeekKg).toBe(1.2);
    });

    it("toJSON devolve uma cópia fiel de todas as props", () => {
      const w = makeWeighIn();

      expect(w.toJSON()).toEqual({
        id: "w-1",
        userId: "u-1",
        betId: "bet-1",
        challengeId: "ch-1",
        kind: "final",
        weightKg: 79,
        videoObjectKey: "weighins/u-1/bet-1/final.mp4",
        status: "pending",
        lossPerWeekKg: null,
        capturedAt: new Date("2026-06-21T10:00:00.000Z"),
      });
    });

    it("toJSON devolve um snapshot novo e desacoplado do estado interno", () => {
      const w = makeWeighIn({ status: "pending" });
      const before = w.toJSON();

      // mutação posterior do estado não retroage no snapshot já tirado
      w.applyVerdict("approved");

      expect(before.status).toBe("pending");
      expect(w.toJSON().status).toBe("approved");
      // cada chamada produz um objeto distinto (cópia, não referência interna)
      expect(w.toJSON()).not.toBe(w.toJSON());
    });

    it("preserva betId/challengeId nulos (pesagem adhoc sem desafio)", () => {
      const w = makeWeighIn({ betId: null, challengeId: null });
      const json = w.toJSON();

      expect(json.betId).toBeNull();
      expect(json.challengeId).toBeNull();
    });

    it("lossPerWeekKg começa em null e o getter o reflete", () => {
      const w = makeWeighIn({ lossPerWeekKg: null });
      expect(w.lossPerWeekKg).toBeNull();
    });
  });

  describe("block (regra dura de sanidade, §6)", () => {
    it("pending → blocked, gravando o lossPerWeekKg", () => {
      const w = makeWeighIn({ status: "pending" });

      w.block(2.5);

      expect(w.status).toBe("blocked");
      expect(w.lossPerWeekKg).toBe(2.5);
    });

    it("não muta as demais props ao bloquear", () => {
      const w = makeWeighIn({ status: "pending", weightKg: 79 });

      w.block(3);
      const json = w.toJSON();

      expect(json.weightKg).toBe(79);
      expect(json.id).toBe("w-1");
      expect(json.videoObjectKey).toBe("weighins/u-1/bet-1/final.mp4");
    });

    it("aceita zero como perda (limite inferior)", () => {
      const w = makeWeighIn({ status: "pending" });

      w.block(0);

      expect(w.status).toBe("blocked");
      expect(w.lossPerWeekKg).toBe(0);
    });
  });

  describe("enqueueForReview (fila humana, §5)", () => {
    it("pending → in_review, gravando o lossPerWeekKg numérico", () => {
      const w = makeWeighIn({ status: "pending" });

      w.enqueueForReview(0.8);

      expect(w.status).toBe("in_review");
      expect(w.lossPerWeekKg).toBe(0.8);
    });

    it("aceita lossPerWeekKg null (ex.: baseline sem pesagem anterior)", () => {
      const w = makeWeighIn({ status: "pending", lossPerWeekKg: 1.5 });

      w.enqueueForReview(null);

      expect(w.status).toBe("in_review");
      expect(w.lossPerWeekKg).toBeNull();
    });

    it("não muta as demais props ao enfileirar", () => {
      const w = makeWeighIn({ status: "pending" });

      w.enqueueForReview(1.1);
      const json = w.toJSON();

      expect(json.kind).toBe("final");
      expect(json.userId).toBe("u-1");
      expect(json.capturedAt).toEqual(new Date("2026-06-21T10:00:00.000Z"));
    });
  });

  describe("applyVerdict (veredito do revisor, §7)", () => {
    it("approved → approved", () => {
      const w = makeWeighIn({ status: "in_review" });

      w.applyVerdict("approved");

      expect(w.status).toBe("approved");
    });

    it("rejected → rejected", () => {
      const w = makeWeighIn({ status: "in_review" });

      w.applyVerdict("rejected");

      expect(w.status).toBe("rejected");
    });

    it("pending (revisor pediu nova captura) → recapture", () => {
      const w = makeWeighIn({ status: "in_review" });

      w.applyVerdict("pending");

      expect(w.status).toBe("recapture");
    });

    it("preserva o lossPerWeekKg já registrado ao aplicar o veredito", () => {
      const w = makeWeighIn({ status: "in_review", lossPerWeekKg: 0.9 });

      w.applyVerdict("approved");

      expect(w.lossPerWeekKg).toBe(0.9);
      expect(w.toJSON().lossPerWeekKg).toBe(0.9);
    });

    it("não muta as demais props ao decidir", () => {
      const w = makeWeighIn({ status: "in_review", weightKg: 78.2 });

      w.applyVerdict("rejected");
      const json = w.toJSON();

      expect(json.weightKg).toBe(78.2);
      expect(json.videoObjectKey).toBe("weighins/u-1/bet-1/final.mp4");
    });
  });

  describe("transições encadeadas (fluxo manual-first)", () => {
    it("pending → in_review → approved", () => {
      const w = makeWeighIn({ status: "pending" });

      w.enqueueForReview(0.7);
      expect(w.status).toBe("in_review");

      w.applyVerdict("approved");
      expect(w.status).toBe("approved");
      // o loss persiste por toda a cadeia
      expect(w.lossPerWeekKg).toBe(0.7);
    });

    it("pending → blocked (regra dura curto-circuita a revisão)", () => {
      const w = makeWeighIn({ status: "pending" });

      w.block(4);

      expect(w.status).toBe("blocked");
      expect(w.lossPerWeekKg).toBe(4);
    });

    it("in_review → recapture e depois reenfileirável (nova captura)", () => {
      const w = makeWeighIn({ status: "in_review", lossPerWeekKg: 1.0 });

      w.applyVerdict("pending");
      expect(w.status).toBe("recapture");

      // após recapturar, o fluxo pode reenfileirar com novo loss
      w.enqueueForReview(0.5);
      expect(w.status).toBe("in_review");
      expect(w.lossPerWeekKg).toBe(0.5);
    });
  });
});
