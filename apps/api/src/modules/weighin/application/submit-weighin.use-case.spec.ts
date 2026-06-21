import { describe, expect, it, vi } from "vitest";

// Isola o use-case da matemática de sanidade (testada em sanity.spec.ts):
// aqui controlamos ok/bloqueio para exercitar os ramos do submit.
vi.mock("@/modules/weighin/domain/sanity.js", () => ({
  checkSanity: vi.fn(),
}));

import { checkSanity, type SanityResult } from "@/modules/weighin/domain/sanity.js";

import { QueueName } from "@/infra/queue/queue.port.js";
import { WeighIn } from "@/modules/weighin/domain/weighin.entity.js";
import { WeightImplausibleError } from "@/shared/errors.js";
import type { Env } from "@/config/config.module.js";
import { SubmitWeighInUseCase } from "./submit-weighin.use-case.js";

function makeDeps() {
  const repo = { save: vi.fn(), findById: vi.fn(), findPrevious: vi.fn(), listByUser: vi.fn() };
  const queue = { publish: vi.fn(), subscribe: vi.fn() };
  const env = { WEIGHT_HARD_LIMIT_KG_PER_WEEK: 2 } as unknown as Env;
  const uc = new SubmitWeighInUseCase(repo, queue, env);
  return { repo, queue, uc };
}

const cmd = {
  userId: "u-1",
  betId: "bet-1",
  challengeId: "c-1",
  kind: "final" as const,
  weightKg: 79,
  videoObjectKey: "k.mp4",
  capturedAt: new Date("2026-06-15T00:00:00.000Z"),
};

function previousWeighin(weightKg: number): WeighIn {
  return WeighIn.create({
    id: "w-prev",
    userId: "u-1",
    betId: "bet-1",
    challengeId: null,
    kind: "baseline",
    weightKg,
    videoObjectKey: "p.mp4",
    status: "approved",
    capturedAt: new Date("2026-06-01T00:00:00.000Z"),
  });
}

function savedWeighIn(repo: { save: ReturnType<typeof vi.fn> }): WeighIn {
  return repo.save.mock.calls[0]?.[0] as WeighIn;
}

describe("SubmitWeighInUseCase", () => {
  it("primeira pesagem (sem anterior) → enfileira para revisão, sem checar sanidade", async () => {
    const { repo, queue, uc } = makeDeps();
    repo.findPrevious.mockResolvedValue(undefined);

    const result = await uc.execute(cmd);

    expect(checkSanity).not.toHaveBeenCalled();
    expect(result.status).toBe("in_review");
    expect(result.lossPerWeekKg).toBeNull();
    expect(savedWeighIn(repo).status).toBe("in_review");
    expect(queue.publish).toHaveBeenCalledWith(QueueName.REVIEW_ENQUEUE, {
      weighinId: result.weighinId,
    });
  });

  it("perda plausível → enfileira com a perda/semana calculada", async () => {
    const { repo, queue, uc } = makeDeps();
    repo.findPrevious.mockResolvedValue(previousWeighin(82));
    const sanity: SanityResult = { ok: true, lossPerWeekKg: 1.5 };
    vi.mocked(checkSanity).mockReturnValue(sanity);

    const result = await uc.execute(cmd);

    expect(result.status).toBe("in_review");
    expect(result.lossPerWeekKg).toBe(1.5);
    expect(queue.publish).toHaveBeenCalledOnce();
  });

  it("perda implausível → BLOQUEIO (status blocked + WeightImplausibleError, sem fila)", async () => {
    const { repo, queue, uc } = makeDeps();
    repo.findPrevious.mockResolvedValue(previousWeighin(90));
    const sanity: SanityResult = {
      ok: false,
      lossPerWeekKg: 5.5,
      hardLimitKgPerWeek: 2,
      reason: "implausible_loss",
    };
    vi.mocked(checkSanity).mockReturnValue(sanity);

    await expect(uc.execute(cmd)).rejects.toBeInstanceOf(WeightImplausibleError);

    expect(savedWeighIn(repo).status).toBe("blocked");
    expect(queue.publish).not.toHaveBeenCalled();
  });
});
