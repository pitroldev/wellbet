import { describe, expect, it, vi } from "vitest";

import { Challenge } from "@/modules/challenge/domain/challenge.entity.js";
import { User } from "@/modules/identity/domain/user.entity.js";
import { Review } from "@/modules/review/domain/review.entity.js";
import { WeighIn, type WeighInProps } from "@/modules/weighin/domain/weighin.entity.js";
import { NotFoundError } from "@/shared/errors.js";
import { GetReviewDetailUseCase } from "./get-review-detail.use-case.js";

function weighin(over: Partial<WeighInProps> = {}): WeighIn {
  return WeighIn.create({
    id: "w-1",
    userId: "u-1",
    betId: "bet-1",
    challengeId: "ch-1",
    kind: "final",
    weightKg: 79,
    videoObjectKey: "weighins/u-1/final.mp4",
    status: "in_review",
    lossPerWeekKg: 1.2,
    capturedAt: new Date("2026-06-21T10:00:00.000Z"),
    ...over,
  });
}

function challenge(): Challenge {
  return Challenge.create({
    id: "ch-1",
    userId: "u-1",
    word: "azul",
    number: 42,
    gesture: "thumbs_up",
    nonce: "n-1",
    issuedAt: new Date(),
    expiresAt: new Date(Date.now() + 60_000),
  });
}

function makeDeps() {
  const weighins = { save: vi.fn(), findById: vi.fn(), findPrevious: vi.fn(), listByUser: vi.fn() };
  const reviews = { listQueue: vi.fn(), save: vi.fn(), findById: vi.fn(), findByWeighin: vi.fn() };
  const challenges = {
    save: vi.fn(),
    findById: vi.fn(),
    findByNonce: vi.fn(),
    markConsumed: vi.fn(),
  };
  const users = {
    findById: vi.fn(),
    save: vi.fn(),
    findByEmail: vi.fn(),
    findByAuthUserId: vi.fn(),
  };
  const storage = { presignUpload: vi.fn(), presignDownload: vi.fn() };
  const uc = new GetReviewDetailUseCase(weighins, reviews, challenges, users, storage);
  return { weighins, reviews, challenges, users, storage, uc };
}

function arrange(d: ReturnType<typeof makeDeps>): void {
  d.weighins.findById.mockResolvedValue(weighin());
  d.storage.presignDownload.mockResolvedValue({
    url: "https://signed/v",
    key: "k",
    expiresAt: new Date(),
  });
  d.users.findById.mockResolvedValue(
    User.create({ id: "u-1", email: "a@b.com", name: "Fulano", role: "user" }),
  );
  d.challenges.findById.mockResolvedValue(challenge());
  d.reviews.findByWeighin.mockResolvedValue(undefined);
}

describe("GetReviewDetailUseCase", () => {
  it("junta pesagem + vídeo + código esperado; sem review → verdict null", async () => {
    const d = makeDeps();
    arrange(d);

    const result = await d.uc.execute("w-1");

    expect(d.storage.presignDownload).toHaveBeenCalledWith({ key: "weighins/u-1/final.mp4" });
    expect(result).toMatchObject({
      weighinId: "w-1",
      userName: "Fulano",
      kind: "final",
      videoUrl: "https://signed/v",
      expectedCode: { word: "azul", number: 42, gesture: "thumbs_up" },
      verdict: null,
    });
  });

  it("inclui o veredito quando a pesagem já foi decidida", async () => {
    const d = makeDeps();
    arrange(d);
    const review = Review.create({ id: "r-1", weighinId: "w-1" });
    review.decide({
      reviewerId: "rev",
      verdict: "rejected",
      reason: "vídeo cortado",
      failedChecks: ["continuous_video"],
    });
    d.reviews.findByWeighin.mockResolvedValue(review);

    const result = await d.uc.execute("w-1");

    expect(result).toMatchObject({ verdict: "rejected", reason: "vídeo cortado" });
    expect(result.failedChecks).toEqual(["continuous_video"]);
  });

  it("pesagem sem desafio → expectedCode null (sem buscar o challenge)", async () => {
    const d = makeDeps();
    arrange(d);
    d.weighins.findById.mockResolvedValue(weighin({ challengeId: null }));

    const result = await d.uc.execute("w-1");

    expect(d.challenges.findById).not.toHaveBeenCalled();
    expect(result.expectedCode).toBeNull();
  });

  it("pesagem inexistente → NotFoundError", async () => {
    const d = makeDeps();
    d.weighins.findById.mockResolvedValue(undefined);

    await expect(d.uc.execute("x")).rejects.toBeInstanceOf(NotFoundError);
  });
});
