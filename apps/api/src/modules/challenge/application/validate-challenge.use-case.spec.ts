import { describe, expect, it, vi } from "vitest";

import { Challenge, type ChallengeProps } from "@/modules/challenge/domain/challenge.entity.js";
import { ErrorCode } from "@/shared/errors.js";
import { ValidateChallengeUseCase } from "./validate-challenge.use-case.js";

// expiresAt relativo ao agora real porque o use-case usa `new Date()` interno.
function challenge(over: Partial<ChallengeProps> = {}): Challenge {
  return Challenge.create({
    id: "ch-1",
    userId: "u-1",
    word: "azul",
    number: 42,
    gesture: "thumbs_up",
    nonce: "nonce-1",
    issuedAt: new Date(),
    expiresAt: new Date(Date.now() + 5 * 60_000),
    consumedAt: null,
    ...over,
  });
}

function makeDeps() {
  const repo = {
    save: vi.fn(),
    findById: vi.fn(),
    findByNonce: vi.fn(),
    markConsumed: vi.fn(),
  };
  const uc = new ValidateChallengeUseCase(repo);
  return { repo, uc };
}

const cmd = { userId: "u-1", nonce: "nonce-1" };

describe("ValidateChallengeUseCase (anti-replay)", () => {
  it("código válido → consome (uso único) e retorna o challengeId", async () => {
    const { repo, uc } = makeDeps();
    repo.findByNonce.mockResolvedValue(challenge());

    const result = await uc.execute(cmd);

    expect(result.challengeId).toBe("ch-1");
    expect(repo.markConsumed).toHaveBeenCalledWith("ch-1", expect.any(Date));
  });

  it("nonce desconhecido → CHALLENGE_INVALID, sem consumir", async () => {
    const { repo, uc } = makeDeps();
    repo.findByNonce.mockResolvedValue(undefined);

    await expect(uc.execute(cmd)).rejects.toMatchObject({ code: ErrorCode.CHALLENGE_INVALID });
    expect(repo.markConsumed).not.toHaveBeenCalled();
  });

  it("nonce de OUTRO usuário → CHALLENGE_INVALID (não vaza existência)", async () => {
    const { repo, uc } = makeDeps();
    repo.findByNonce.mockResolvedValue(challenge({ userId: "intruso" }));

    await expect(uc.execute(cmd)).rejects.toMatchObject({ code: ErrorCode.CHALLENGE_INVALID });
    expect(repo.markConsumed).not.toHaveBeenCalled();
  });

  it("código expirado → CHALLENGE_EXPIRED", async () => {
    const { repo, uc } = makeDeps();
    repo.findByNonce.mockResolvedValue(challenge({ expiresAt: new Date(Date.now() - 60_000) }));

    await expect(uc.execute(cmd)).rejects.toMatchObject({ code: ErrorCode.CHALLENGE_EXPIRED });
    expect(repo.markConsumed).not.toHaveBeenCalled();
  });

  it("código já usado (replay) → CHALLENGE_ALREADY_USED", async () => {
    const { repo, uc } = makeDeps();
    repo.findByNonce.mockResolvedValue(challenge({ consumedAt: new Date() }));

    await expect(uc.execute(cmd)).rejects.toMatchObject({ code: ErrorCode.CHALLENGE_ALREADY_USED });
    expect(repo.markConsumed).not.toHaveBeenCalled();
  });
});
