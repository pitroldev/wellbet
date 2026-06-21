import { describe, expect, it, vi } from "vitest";

import { WeighIn, type WeighInProps } from "@/modules/weighin/domain/weighin.entity.js";
import { ListWeighInsUseCase } from "./list-weighins.use-case.js";

function weighin(over: Partial<WeighInProps> = {}): WeighIn {
  return WeighIn.create({
    id: "w-1",
    userId: "u-1",
    betId: "bet-1",
    challengeId: "c-1",
    kind: "final",
    weightKg: 79,
    videoObjectKey: "weighins/u-1/secret.mp4",
    status: "in_review",
    lossPerWeekKg: 0.5,
    capturedAt: new Date("2026-06-21T10:00:00.000Z"),
    ...over,
  });
}

function makeDeps() {
  const repo = {
    save: vi.fn(),
    findById: vi.fn(),
    findPrevious: vi.fn(),
    listByUser: vi.fn(),
  };
  const uc = new ListWeighInsUseCase(repo);
  return { repo, uc };
}

describe("ListWeighInsUseCase", () => {
  it("mapeia o histórico (capturedAt ISO; sem vazar vídeo/challenge/userId)", async () => {
    const { repo, uc } = makeDeps();
    repo.listByUser.mockResolvedValue([weighin()]);

    const result = await uc.execute({ userId: "u-1" });

    expect(repo.listByUser).toHaveBeenCalledWith({ userId: "u-1", kind: undefined });
    expect(result[0]).toEqual({
      weighinId: "w-1",
      kind: "final",
      weightKg: 79,
      status: "in_review",
      lossPerWeekKg: 0.5,
      betId: "bet-1",
      capturedAt: "2026-06-21T10:00:00.000Z",
    });
    expect(result[0]).not.toHaveProperty("videoObjectKey");
    expect(result[0]).not.toHaveProperty("challengeId");
    expect(result[0]).not.toHaveProperty("userId");
  });

  it("repassa o filtro por tipo (kind) ao repositório", async () => {
    const { repo, uc } = makeDeps();
    repo.listByUser.mockResolvedValue([]);

    await uc.execute({ userId: "u-1", kind: "baseline" });

    expect(repo.listByUser).toHaveBeenCalledWith({ userId: "u-1", kind: "baseline" });
  });
});
