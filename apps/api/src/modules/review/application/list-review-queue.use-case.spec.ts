import { describe, expect, it, vi } from "vitest";

import { ListReviewQueueUseCase } from "./list-review-queue.use-case.js";
import type { ReviewQueueItem } from "./review.repository.port.js";

function queueItem(over: Partial<ReviewQueueItem> = {}): ReviewQueueItem {
  return {
    weighinId: "w-1",
    userId: "u-1",
    userName: "Fulano",
    kind: "final",
    weightKg: 79,
    videoObjectKey: "weighins/u-1/final.mp4",
    lossPerWeekKg: 1.2,
    capturedAt: new Date("2026-06-21T10:00:00.000Z"),
    reviewId: null,
    ...over,
  };
}

function makeDeps() {
  const repo = { listQueue: vi.fn(), save: vi.fn(), findById: vi.fn(), findByWeighin: vi.fn() };
  const storage = { presignUpload: vi.fn(), presignDownload: vi.fn() };
  const uc = new ListReviewQueueUseCase(repo, storage);
  return { repo, storage, uc };
}

describe("ListReviewQueueUseCase", () => {
  it("anexa a URL pré-assinada do vídeo e repassa userName/campos", async () => {
    const { repo, storage, uc } = makeDeps();
    repo.listQueue.mockResolvedValue([queueItem()]);
    storage.presignDownload.mockResolvedValue({
      url: "https://signed/video",
      key: "k",
      expiresAt: new Date(),
    });

    const result = await uc.execute({});

    expect(storage.presignDownload).toHaveBeenCalledWith({ key: "weighins/u-1/final.mp4" });
    expect(result[0]).toMatchObject({
      weighinId: "w-1",
      userName: "Fulano",
      videoUrl: "https://signed/video",
    });
  });

  it("limita o page size a 200 e repassa o offset", async () => {
    const { repo, uc } = makeDeps();
    repo.listQueue.mockResolvedValue([]);

    await uc.execute({ limit: 999, offset: 10 });

    expect(repo.listQueue).toHaveBeenCalledWith({ limit: 200, offset: 10 });
  });
});
