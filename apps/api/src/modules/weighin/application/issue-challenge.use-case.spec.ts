import { describe, expect, it, vi } from "vitest";

import type { Env } from "@/config/config.module.js";
import { IssueChallengeUseCase } from "./issue-challenge.use-case.js";

// expiresAt relativo ao agora real porque o código do challenge usa `new Date()`.
function makeChallengeResult(over: Partial<Record<string, unknown>> = {}) {
  return {
    challengeId: "ch-1",
    word: "azul",
    number: 42,
    gesture: "thumbs_up",
    nonce: "nonce-1",
    expiresAt: new Date(Date.now() + 120_000),
    ...over,
  };
}

function makePresigned(over: Partial<Record<string, unknown>> = {}) {
  return {
    url: "https://r2.example/put?sig=abc",
    key: "weighins/u-1/bet-1/final-uuid.mp4",
    expiresAt: new Date(Date.now() + 600_000),
    requiredHeaders: { "Content-Type": "video/mp4" },
    ...over,
  };
}

function makeDeps() {
  const issueCode = { execute: vi.fn() };
  const storage = { presignUpload: vi.fn(), presignDownload: vi.fn() };
  // env fake mínima: o use-case só lê STORAGE_PRESIGN_TTL_SECONDS.
  const env = { STORAGE_PRESIGN_TTL_SECONDS: 600 } as unknown as Env;
  const uc = new IssueChallengeUseCase(issueCode as never, storage, env);
  return { issueCode, storage, env, uc };
}

/** Argumento da n-ésima chamada de presignUpload, com guard de presença. */
function presignArg(
  storage: ReturnType<typeof makeDeps>["storage"],
  call = 0,
): { key: string; contentType: string; expiresInSeconds?: number } {
  const args = storage.presignUpload.mock.calls.at(call) as
    | [{ key: string; contentType: string; expiresInSeconds?: number }]
    | undefined;
  if (!args) throw new Error(`presignUpload não foi chamada ${call + 1}x`);
  return args[0];
}

describe("IssueChallengeUseCase (weighin) — abre sessão de captura", () => {
  it("caminho feliz: emite código + pré-assina upload e devolve ambos", async () => {
    const { issueCode, storage, uc } = makeDeps();
    const challenge = makeChallengeResult();
    const presigned = makePresigned();
    issueCode.execute.mockResolvedValue(challenge);
    storage.presignUpload.mockResolvedValue(presigned);

    const result = await uc.execute({ userId: "u-1", betId: "bet-1", kind: "final" });

    expect(issueCode.execute).toHaveBeenCalledWith({ userId: "u-1" });
    expect(result.challenge).toEqual({
      challengeId: "ch-1",
      word: "azul",
      number: 42,
      gesture: "thumbs_up",
      nonce: "nonce-1",
      expiresAt: challenge.expiresAt,
    });
    expect(result.upload).toEqual({
      url: "https://r2.example/put?sig=abc",
      objectKey: "weighins/u-1/bet-1/final-uuid.mp4",
      expiresAt: presigned.expiresAt,
      requiredHeaders: { "Content-Type": "video/mp4" },
    });
  });

  it("monta a objectKey com segmento bet-<id> quando há aposta", async () => {
    const { issueCode, storage, uc } = makeDeps();
    issueCode.execute.mockResolvedValue(makeChallengeResult());
    storage.presignUpload.mockResolvedValue(makePresigned());

    await uc.execute({ userId: "u-1", betId: "bet-99", kind: "mid" });

    expect(presignArg(storage).key).toMatch(/^weighins\/u-1\/bet-bet-99\/mid-[0-9a-f-]{36}\.mp4$/);
  });

  it("monta a objectKey com segmento 'adhoc' quando não há aposta (betId undefined)", async () => {
    const { issueCode, storage, uc } = makeDeps();
    issueCode.execute.mockResolvedValue(makeChallengeResult());
    storage.presignUpload.mockResolvedValue(makePresigned());

    await uc.execute({ userId: "u-7", kind: "baseline" });

    expect(presignArg(storage).key).toMatch(/^weighins\/u-7\/adhoc\/baseline-[0-9a-f-]{36}\.mp4$/);
  });

  it("trata betId null como adhoc (falsy → segmento 'adhoc')", async () => {
    const { issueCode, storage, uc } = makeDeps();
    issueCode.execute.mockResolvedValue(makeChallengeResult());
    storage.presignUpload.mockResolvedValue(makePresigned());

    await uc.execute({ userId: "u-1", betId: null, kind: "final" });

    expect(presignArg(storage).key).toContain("weighins/u-1/adhoc/final-");
  });

  it("gera uma objectKey distinta a cada chamada (uuid por captura)", async () => {
    const { issueCode, storage, uc } = makeDeps();
    issueCode.execute.mockResolvedValue(makeChallengeResult());
    storage.presignUpload.mockResolvedValue(makePresigned());

    await uc.execute({ userId: "u-1", betId: "bet-1", kind: "final" });
    await uc.execute({ userId: "u-1", betId: "bet-1", kind: "final" });

    expect(presignArg(storage, 0).key).not.toBe(presignArg(storage, 1).key);
  });

  it("default do contentType é video/mp4 quando não informado", async () => {
    const { issueCode, storage, uc } = makeDeps();
    issueCode.execute.mockResolvedValue(makeChallengeResult());
    storage.presignUpload.mockResolvedValue(makePresigned());

    await uc.execute({ userId: "u-1", betId: "bet-1", kind: "final" });

    expect(storage.presignUpload).toHaveBeenCalledWith(
      expect.objectContaining({ contentType: "video/mp4" }),
    );
  });

  it("repassa o contentType informado pelo comando", async () => {
    const { issueCode, storage, uc } = makeDeps();
    issueCode.execute.mockResolvedValue(makeChallengeResult());
    storage.presignUpload.mockResolvedValue(makePresigned());

    await uc.execute({
      userId: "u-1",
      betId: "bet-1",
      kind: "final",
      contentType: "video/quicktime",
    });

    expect(storage.presignUpload).toHaveBeenCalledWith(
      expect.objectContaining({ contentType: "video/quicktime" }),
    );
  });

  it("repassa o TTL de presign vindo da env", async () => {
    const { issueCode, storage, uc } = makeDeps();
    issueCode.execute.mockResolvedValue(makeChallengeResult());
    storage.presignUpload.mockResolvedValue(makePresigned());

    await uc.execute({ userId: "u-1", betId: "bet-1", kind: "final" });

    expect(storage.presignUpload).toHaveBeenCalledWith(
      expect.objectContaining({ expiresInSeconds: 600 }),
    );
  });

  it("a key passada ao storage é a mesma usada na objectKey do resultado", async () => {
    const { issueCode, storage, uc } = makeDeps();
    issueCode.execute.mockResolvedValue(makeChallengeResult());
    // o adapter ecoa a key recebida (comportamento típico do presign)
    storage.presignUpload.mockImplementation((input: { key: string }) =>
      Promise.resolve(makePresigned({ key: input.key })),
    );

    const result = await uc.execute({ userId: "u-1", betId: "bet-1", kind: "final" });

    expect(result.upload.objectKey).toBe(presignArg(storage).key);
  });

  it("devolve objectKey/url/expiresAt a partir do PresignedUrl do storage (não da key local)", async () => {
    const { issueCode, storage, uc } = makeDeps();
    issueCode.execute.mockResolvedValue(makeChallengeResult());
    const presigned = makePresigned({
      url: "https://cdn/x",
      key: "server-normalized-key.mp4",
    });
    storage.presignUpload.mockResolvedValue(presigned);

    const result = await uc.execute({ userId: "u-1", betId: "bet-1", kind: "final" });

    expect(result.upload.url).toBe("https://cdn/x");
    expect(result.upload.objectKey).toBe("server-normalized-key.mp4");
    expect(result.upload.expiresAt).toBe(presigned.expiresAt);
  });

  it("requiredHeaders opcional ausente → undefined no resultado", async () => {
    const { issueCode, storage, uc } = makeDeps();
    issueCode.execute.mockResolvedValue(makeChallengeResult());
    storage.presignUpload.mockResolvedValue(makePresigned({ requiredHeaders: undefined }));

    const result = await uc.execute({ userId: "u-1", betId: "bet-1", kind: "final" });

    expect(result.upload.requiredHeaders).toBeUndefined();
  });

  it("propaga falha do use-case de código e NÃO chama o storage", async () => {
    const { issueCode, storage, uc } = makeDeps();
    issueCode.execute.mockRejectedValue(new Error("rng down"));

    await expect(uc.execute({ userId: "u-1", betId: "bet-1", kind: "final" })).rejects.toThrow(
      "rng down",
    );
    expect(storage.presignUpload).not.toHaveBeenCalled();
  });

  it("propaga falha do storage após o código ter sido emitido", async () => {
    const { issueCode, storage, uc } = makeDeps();
    issueCode.execute.mockResolvedValue(makeChallengeResult());
    storage.presignUpload.mockRejectedValue(new Error("r2 unreachable"));

    await expect(uc.execute({ userId: "u-1", betId: "bet-1", kind: "final" })).rejects.toThrow(
      "r2 unreachable",
    );
    expect(issueCode.execute).toHaveBeenCalledTimes(1);
  });
});
