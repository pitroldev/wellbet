import { describe, expect, it, vi } from "vitest";

import { QueueName } from "@/infra/queue/queue.port.js";
import { Review } from "@/modules/review/domain/review.entity.js";
import { WeighIn, type WeighInKind } from "@/modules/weighin/domain/weighin.entity.js";
import { ConflictError } from "@/shared/errors.js";
import { SubmitVerdictUseCase } from "./submit-verdict.use-case.js";

function weighin(kind: WeighInKind, betId: string | null = "bet-1"): WeighIn {
  return WeighIn.create({
    id: "w-1",
    userId: "u-1",
    betId,
    challengeId: null,
    kind,
    weightKg: 79,
    videoObjectKey: "k",
    status: "in_review",
    capturedAt: new Date("2026-06-21T00:00:00.000Z"),
  });
}

function makeDeps() {
  const reviews = {
    listQueue: vi.fn(),
    save: vi.fn(),
    findById: vi.fn(),
    findByWeighin: vi.fn(),
  };
  const weighins = {
    save: vi.fn(),
    findById: vi.fn(),
    findPrevious: vi.fn(),
    listByUser: vi.fn(),
  };
  const queue = { publish: vi.fn(), subscribe: vi.fn() };
  const uc = new SubmitVerdictUseCase(reviews, weighins, queue);
  return { reviews, weighins, queue, uc };
}

const approve = { reviewerId: "r-1", weighinId: "w-1", verdict: "approved" as const };

describe("SubmitVerdictUseCase", () => {
  it("aprovação da pesagem FINAL com aposta → publica o settlement", async () => {
    const { weighins, reviews, queue, uc } = makeDeps();
    weighins.findById.mockResolvedValue(weighin("final"));
    reviews.findByWeighin.mockResolvedValue(undefined);

    await uc.execute(approve);

    expect(queue.publish).toHaveBeenCalledWith(
      QueueName.BET_SETTLE,
      expect.objectContaining({ betId: "bet-1", weighinId: "w-1" }),
      expect.objectContaining({ singletonKey: "settle:w-1" }),
    );
  });

  it("aprovar baseline/mid NÃO liquida (evita liquidar contra o peso errado)", async () => {
    const { weighins, reviews, queue, uc } = makeDeps();
    weighins.findById.mockResolvedValue(weighin("baseline"));
    reviews.findByWeighin.mockResolvedValue(undefined);

    await uc.execute(approve);

    expect(queue.publish).not.toHaveBeenCalled();
  });

  it("pesagem final aprovada SEM aposta → não liquida", async () => {
    const { weighins, reviews, queue, uc } = makeDeps();
    weighins.findById.mockResolvedValue(weighin("final", null));
    reviews.findByWeighin.mockResolvedValue(undefined);

    await uc.execute(approve);

    expect(queue.publish).not.toHaveBeenCalled();
  });

  it("reprovação → status rejected, sem settlement", async () => {
    const { weighins, reviews, queue, uc } = makeDeps();
    const w = weighin("final");
    weighins.findById.mockResolvedValue(w);
    reviews.findByWeighin.mockResolvedValue(undefined);

    await uc.execute({ ...approve, verdict: "rejected" });

    expect(w.status).toBe("rejected");
    expect(queue.publish).not.toHaveBeenCalled();
  });

  it("pesagem já decidida → ConflictError (veredito é decisão única)", async () => {
    const { weighins, reviews, uc } = makeDeps();
    weighins.findById.mockResolvedValue(weighin("final"));
    const decided = Review.create({ id: "rev-1", weighinId: "w-1" });
    decided.decide({ reviewerId: "r", verdict: "approved", reason: null, failedChecks: null });
    reviews.findByWeighin.mockResolvedValue(decided);

    await expect(uc.execute(approve)).rejects.toBeInstanceOf(ConflictError);
  });
});
