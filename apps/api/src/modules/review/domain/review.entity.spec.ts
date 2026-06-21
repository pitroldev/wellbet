import { describe, expect, it } from "vitest";

import {
  CHECKLIST_FLAGS,
  Review,
  type Checklist,
  type ChecklistFlag,
  type ChecklistResult,
  type ReviewProps,
} from "./review.entity.js";

function makeReview(over: Partial<ReviewProps> = {}): Review {
  return Review.create({
    id: "r-1",
    weighinId: "w-1",
    ...over,
  });
}

describe("Review — entidade de domínio (veredito da revisão humana)", () => {
  describe("create / getters", () => {
    it("expõe id e weighinId; verdict começa indefinido quando não informado", () => {
      const review = makeReview();
      expect(review.id).toBe("r-1");
      expect(review.weighinId).toBe("w-1");
      expect(review.verdict).toBeUndefined();
    });

    it("preserva um verdict pré-existente passado em create", () => {
      const review = makeReview({ verdict: "pending" });
      expect(review.verdict).toBe("pending");
    });

    it("preserva verdict null explícito", () => {
      const review = makeReview({ verdict: null });
      expect(review.verdict).toBeNull();
    });
  });

  describe("isDecided", () => {
    it("não decidida ao criar sem verdict nem decidedAt", () => {
      expect(makeReview().isDecided()).toBe(false);
    });

    it("verdict sem decidedAt → ainda NÃO decidida", () => {
      expect(makeReview({ verdict: "approved" }).isDecided()).toBe(false);
    });

    it("decidedAt sem verdict → ainda NÃO decidida", () => {
      expect(makeReview({ decidedAt: new Date() }).isDecided()).toBe(false);
    });

    it("verdict null + decidedAt → NÃO decidida (verdict == null)", () => {
      expect(makeReview({ verdict: null, decidedAt: new Date() }).isDecided()).toBe(false);
    });

    it("verdict + decidedAt null → NÃO decidida (decidedAt == null)", () => {
      expect(makeReview({ verdict: "approved", decidedAt: null }).isDecided()).toBe(false);
    });

    it("verdict + decidedAt presentes → decidida", () => {
      expect(makeReview({ verdict: "rejected", decidedAt: new Date() }).isDecided()).toBe(true);
    });

    it("passa de não-decidida para decidida após decide()", () => {
      const review = makeReview();
      expect(review.isDecided()).toBe(false);
      review.decide({ reviewerId: "rev", verdict: "approved" });
      expect(review.isDecided()).toBe(true);
    });
  });

  describe("decide — grava o veredito do revisor", () => {
    it("grava reviewerId/verdict e carimba decidedAt com o agora real (sem now)", () => {
      const review = makeReview();
      const before = Date.now();
      review.decide({ reviewerId: "rev-9", verdict: "approved" });
      const after = Date.now();

      const json = review.toJSON();
      expect(json.reviewerId).toBe("rev-9");
      expect(json.verdict).toBe("approved");
      expect(json.decidedAt).toBeInstanceOf(Date);
      const ts = (json.decidedAt as Date).getTime();
      expect(ts).toBeGreaterThanOrEqual(before);
      expect(ts).toBeLessThanOrEqual(after);
    });

    it("usa o now injetado em decidedAt quando fornecido", () => {
      const review = makeReview();
      const now = new Date("2026-06-21T12:00:00.000Z");
      review.decide({ reviewerId: "rev", verdict: "rejected", now });
      expect(review.toJSON().decidedAt).toEqual(now);
    });

    it("grava reason, failedChecks e checklist quando informados (reprovação granular)", () => {
      const review = makeReview();
      const checklist: Checklist = {
        continuous_video: "fail",
        same_person: "ok",
        scale_zero: "na",
      };
      review.decide({
        reviewerId: "rev",
        verdict: "rejected",
        reason: "vídeo cortado no take",
        failedChecks: ["continuous_video"],
        checklist,
      });

      const json = review.toJSON();
      expect(json.reason).toBe("vídeo cortado no take");
      expect(json.failedChecks).toEqual(["continuous_video"]);
      expect(json.checklist).toEqual({
        continuous_video: "fail",
        same_person: "ok",
        scale_zero: "na",
      });
    });

    it("reason/failedChecks/checklist omitidos → normalizados para null (não undefined)", () => {
      const review = makeReview();
      review.decide({ reviewerId: "rev", verdict: "approved" });

      const json = review.toJSON();
      expect(json.reason).toBeNull();
      expect(json.failedChecks).toBeNull();
      expect(json.checklist).toBeNull();
    });

    it("reason/failedChecks/checklist null explícitos permanecem null", () => {
      const review = makeReview();
      review.decide({
        reviewerId: "rev",
        verdict: "pending",
        reason: null,
        failedChecks: null,
        checklist: null,
      });

      const json = review.toJSON();
      expect(json.reason).toBeNull();
      expect(json.failedChecks).toBeNull();
      expect(json.checklist).toBeNull();
    });

    it("preserva o weighinId/id originais ao decidir (não sobrescreve identidade)", () => {
      const review = makeReview({ id: "r-42", weighinId: "w-99" });
      review.decide({ reviewerId: "rev", verdict: "approved" });

      const json = review.toJSON();
      expect(json.id).toBe("r-42");
      expect(json.weighinId).toBe("w-99");
    });

    it.each(["approved", "pending", "rejected"] as const)(
      "aceita o verdict %s e o reflete no getter e no toJSON",
      (verdict) => {
        const review = makeReview();
        review.decide({ reviewerId: "rev", verdict });
        expect(review.verdict).toBe(verdict);
        expect(review.toJSON().verdict).toBe(verdict);
      },
    );

    it("reprovação total: failedChecks pode listar TODOS os flags do checklist", () => {
      const review = makeReview();
      const all: ChecklistFlag[] = [...CHECKLIST_FLAGS];
      review.decide({ reviewerId: "rev", verdict: "rejected", failedChecks: all });
      expect(review.toJSON().failedChecks).toEqual(all);
    });

    it("failedChecks vazio é preservado (array vazio, não null)", () => {
      const review = makeReview();
      review.decide({ reviewerId: "rev", verdict: "approved", failedChecks: [] });
      expect(review.toJSON().failedChecks).toEqual([]);
    });

    it("checklist vazio é preservado (objeto vazio, não null)", () => {
      const review = makeReview();
      review.decide({ reviewerId: "rev", verdict: "approved", checklist: {} });
      expect(review.toJSON().checklist).toEqual({});
    });

    it("re-decidir SOBRESCREVE o veredito anterior (revisor mudou de ideia)", () => {
      const review = makeReview();
      review.decide({
        reviewerId: "rev-a",
        verdict: "rejected",
        reason: "suspeita",
        failedChecks: ["plausibility"],
        checklist: { plausibility: "fail" },
        now: new Date("2026-06-21T10:00:00.000Z"),
      });
      review.decide({
        reviewerId: "rev-b",
        verdict: "approved",
        now: new Date("2026-06-21T11:00:00.000Z"),
      });

      const json = review.toJSON();
      expect(json.reviewerId).toBe("rev-b");
      expect(json.verdict).toBe("approved");
      // omitidos na 2ª decisão → resetados para null, não herdados da 1ª.
      expect(json.reason).toBeNull();
      expect(json.failedChecks).toBeNull();
      expect(json.checklist).toBeNull();
      expect(json.decidedAt).toEqual(new Date("2026-06-21T11:00:00.000Z"));
    });
  });

  describe("toJSON — reflete o checklist tristate (ok/fail/na)", () => {
    it("cobre os três resultados tristate por item", () => {
      const results: ChecklistResult[] = ["ok", "fail", "na"];
      expect(results).toHaveLength(3);

      const review = makeReview();
      const checklist: Checklist = {
        freshness: "ok",
        continuous_video: "fail",
        scale_zero: "na",
      };
      review.decide({ reviewerId: "rev", verdict: "pending", checklist });

      expect(review.toJSON().checklist).toEqual({
        freshness: "ok",
        continuous_video: "fail",
        scale_zero: "na",
      });
    });

    it("checklist parcial (Partial): itens não avaliados simplesmente não aparecem", () => {
      const review = makeReview();
      review.decide({
        reviewerId: "rev",
        verdict: "approved",
        checklist: { same_person: "ok" },
      });
      const checklist = review.toJSON().checklist as Checklist;
      expect(checklist.same_person).toBe("ok");
      expect(checklist.display_integrity).toBeUndefined();
      expect(Object.keys(checklist)).toEqual(["same_person"]);
    });

    it("retorna uma cópia rasa dos props (mutar o retorno não afeta a entidade)", () => {
      const review = makeReview();
      review.decide({ reviewerId: "rev", verdict: "approved" });

      const a = review.toJSON() as { reviewerId: string; verdict: string };
      a.reviewerId = "hacker";
      a.verdict = "rejected";

      const b = review.toJSON();
      expect(b.reviewerId).toBe("rev");
      expect(b.verdict).toBe("approved");
    });

    it("toJSON de uma review recém-criada espelha exatamente os props de create", () => {
      const review = makeReview({ reviewerId: "rev-seed", verdict: "pending" });
      expect(review.toJSON()).toEqual({
        id: "r-1",
        weighinId: "w-1",
        reviewerId: "rev-seed",
        verdict: "pending",
      });
    });
  });

  describe("CHECKLIST_FLAGS — fonte única dos itens do checklist (§5)", () => {
    it("contém os 8 itens esperados, na ordem do documento", () => {
      expect(CHECKLIST_FLAGS).toEqual([
        "freshness",
        "continuous_video",
        "scale_zero",
        "floor_scene",
        "no_body_trick",
        "display_integrity",
        "same_person",
        "plausibility",
      ]);
    });

    it("não tem itens duplicados", () => {
      expect(new Set(CHECKLIST_FLAGS).size).toBe(CHECKLIST_FLAGS.length);
    });

    it("todo flag é uma chave válida de Checklist com resultado tristate", () => {
      const review = makeReview();
      const checklist: Checklist = {};
      for (const flag of CHECKLIST_FLAGS) {
        checklist[flag] = "ok";
      }
      review.decide({ reviewerId: "rev", verdict: "approved", checklist });
      expect(Object.keys(review.toJSON().checklist as Checklist)).toEqual([...CHECKLIST_FLAGS]);
    });
  });
});
