import { describe, expect, it, vi } from "vitest";

import type { Env } from "@/config/config.module.js";
import { Challenge, GESTURES } from "@/modules/challenge/domain/challenge.entity.js";
import { IssueChallengeUseCase } from "./issue-challenge.use-case.js";

const WORDS = ["pedra", "verde", "rio", "sol", "mar", "lobo", "ferro", "nuvem", "fogo", "pao"];

// O RNG do use-case é o cryptoRng interno (NÃO injetado), então palavra/número/
// gesto/nonce são não-determinísticos. Asserta-se shape/faixa/efeito, não valores.
function makeDeps(over: Partial<Env> = {}) {
  const repo = {
    save: vi.fn(),
    findById: vi.fn(),
    findByNonce: vi.fn(),
    markConsumed: vi.fn(),
  };
  const env = { CHALLENGE_CODE_TTL_SECONDS: 120, ...over } as unknown as Env;
  const uc = new IssueChallengeUseCase(repo, env);
  return { repo, env, uc };
}

const cmd = { userId: "u-1" };

describe("IssueChallengeUseCase — emite e persiste o código dinâmico", () => {
  it("retorna um código bem formado dentro do domínio válido", async () => {
    const { uc } = makeDeps();

    const result = await uc.execute(cmd);

    expect(WORDS).toContain(result.word);
    expect(GESTURES as readonly string[]).toContain(result.gesture);
    expect(result.number).toBeGreaterThanOrEqual(10);
    expect(result.number).toBeLessThanOrEqual(99);
    expect(typeof result.nonce).toBe("string");
    expect(result.nonce.length).toBeGreaterThan(0);
    expect(typeof result.challengeId).toBe("string");
    expect(result.challengeId.length).toBeGreaterThan(0);
    expect(result.expiresAt).toBeInstanceOf(Date);
  });

  it("persiste o desafio exatamente uma vez", async () => {
    const { repo, uc } = makeDeps();

    await uc.execute(cmd);

    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledWith(expect.any(Challenge));
  });

  it("o desafio persistido bate com o resultado retornado e é válido", async () => {
    const { repo, uc } = makeDeps();

    const result = await uc.execute(cmd);

    const saved = repo.save.mock.calls[0]![0] as Challenge;
    const json = saved.toJSON();
    expect(saved.id).toBe(result.challengeId);
    expect(saved.userId).toBe("u-1");
    expect(saved.nonce).toBe(result.nonce);
    expect(json.word).toBe(result.word);
    expect(json.number).toBe(result.number);
    expect(json.gesture).toBe(result.gesture);
    expect(json.expiresAt).toEqual(result.expiresAt);
    expect(json.consumedAt).toBeNull();
    // Recém-emitido: ainda válido (não expirado, não consumido).
    expect(saved.isValid()).toBe(true);
    expect(saved.isConsumed()).toBe(false);
  });

  it("o id do desafio é distinto do nonce de validação (ids opacos separados)", async () => {
    const { uc } = makeDeps();

    const result = await uc.execute(cmd);

    expect(result.challengeId).not.toBe(result.nonce);
  });

  it("fixa o expiresAt = now + TTL (env) em segundos", async () => {
    const { uc } = makeDeps({ CHALLENGE_CODE_TTL_SECONDS: 300 });

    const before = Date.now();
    const result = await uc.execute(cmd);
    const after = Date.now();

    const ttlMs = 300 * 1000;
    expect(result.expiresAt.getTime()).toBeGreaterThanOrEqual(before + ttlMs);
    expect(result.expiresAt.getTime()).toBeLessThanOrEqual(after + ttlMs);
  });

  it("issuedAt fica no passado/agora e expiresAt no futuro (TTL > 0)", async () => {
    const { repo, uc } = makeDeps({ CHALLENGE_CODE_TTL_SECONDS: 60 });

    const before = Date.now();
    await uc.execute(cmd);
    const after = Date.now();

    const json = (repo.save.mock.calls[0]![0] as Challenge).toJSON();
    expect(json.issuedAt.getTime()).toBeGreaterThanOrEqual(before);
    expect(json.issuedAt.getTime()).toBeLessThanOrEqual(after);
    expect(json.expiresAt.getTime()).toBeGreaterThan(json.issuedAt.getTime());
  });

  it("usa fallback de 120s quando CHALLENGE_CODE_TTL_SECONDS é nulo/ausente", async () => {
    const { uc } = makeDeps({ CHALLENGE_CODE_TTL_SECONDS: undefined });

    const before = Date.now();
    const result = await uc.execute(cmd);
    const after = Date.now();

    const ttlMs = 120 * 1000;
    expect(result.expiresAt.getTime()).toBeGreaterThanOrEqual(before + ttlMs);
    expect(result.expiresAt.getTime()).toBeLessThanOrEqual(after + ttlMs);
  });

  it("propaga o userId do comando para o desafio", async () => {
    const { repo, uc } = makeDeps();

    await uc.execute({ userId: "outro-user" });

    const saved = repo.save.mock.calls[0]![0] as Challenge;
    expect(saved.userId).toBe("outro-user");
  });

  it("duas emissões geram nonces e ids distintos (anti-replay/frescor)", async () => {
    const { uc } = makeDeps();

    const a = await uc.execute(cmd);
    const b = await uc.execute(cmd);

    expect(a.nonce).not.toBe(b.nonce);
    expect(a.challengeId).not.toBe(b.challengeId);
  });

  it("propaga falha do repositório (não engole erro de persistência)", async () => {
    const { repo, uc } = makeDeps();
    repo.save.mockRejectedValue(new Error("db down"));

    await expect(uc.execute(cmd)).rejects.toThrow("db down");
  });
});
