import { describe, expect, it } from "vitest";

import { Challenge, type ChallengeProps } from "./challenge.entity.js";

// expiresAt/issuedAt relativos ao agora real porque os métodos usam `new Date()`
// como default interno (now = new Date()).
function challenge(over: Partial<ChallengeProps> = {}): Challenge {
  return Challenge.create({
    id: "ch-1",
    userId: "u-1",
    word: "azul",
    number: 42,
    gesture: "thumbs_up",
    nonce: "nonce-1",
    issuedAt: new Date("2026-06-21T10:00:00.000Z"),
    expiresAt: new Date(Date.now() + 5 * 60_000),
    consumedAt: null,
    ...over,
  });
}

describe("Challenge — entidade de domínio (código dinâmico, uso único, TTL)", () => {
  describe("getters", () => {
    it("expõe id, userId e nonce a partir das props", () => {
      const ch = challenge({ id: "ch-9", userId: "u-9", nonce: "nz-9" });
      expect(ch.id).toBe("ch-9");
      expect(ch.userId).toBe("u-9");
      expect(ch.nonce).toBe("nz-9");
    });
  });

  describe("isExpired", () => {
    it("false enquanto now está antes do expiresAt", () => {
      const ch = challenge({ expiresAt: new Date("2026-06-21T10:05:00.000Z") });
      expect(ch.isExpired(new Date("2026-06-21T10:04:59.999Z"))).toBe(false);
    });

    it("true quando now passou do expiresAt", () => {
      const ch = challenge({ expiresAt: new Date("2026-06-21T10:05:00.000Z") });
      expect(ch.isExpired(new Date("2026-06-21T10:05:00.001Z"))).toBe(true);
    });

    it("borda: exatamente no expiresAt NÃO está expirado (estrito >)", () => {
      const at = new Date("2026-06-21T10:05:00.000Z");
      const ch = challenge({ expiresAt: at });
      expect(ch.isExpired(new Date(at.getTime()))).toBe(false);
    });

    it("usa `new Date()` como default — recém-emitido (futuro) não está expirado", () => {
      const ch = challenge({ expiresAt: new Date(Date.now() + 60_000) });
      expect(ch.isExpired()).toBe(false);
    });

    it("usa `new Date()` como default — já vencido (passado) está expirado", () => {
      const ch = challenge({ expiresAt: new Date(Date.now() - 60_000) });
      expect(ch.isExpired()).toBe(true);
    });
  });

  describe("isConsumed", () => {
    it("false quando consumedAt é null", () => {
      expect(challenge({ consumedAt: null }).isConsumed()).toBe(false);
    });

    it("false quando consumedAt é undefined (prop opcional ausente)", () => {
      expect(challenge({ consumedAt: undefined }).isConsumed()).toBe(false);
    });

    it("true quando consumedAt é uma data", () => {
      expect(challenge({ consumedAt: new Date() }).isConsumed()).toBe(true);
    });
  });

  describe("isValid", () => {
    it("válido: não expirado e não consumido", () => {
      const ch = challenge({
        expiresAt: new Date(Date.now() + 60_000),
        consumedAt: null,
      });
      expect(ch.isValid()).toBe(true);
    });

    it("inválido quando expirado (mesmo não consumido)", () => {
      const ch = challenge({
        expiresAt: new Date(Date.now() - 60_000),
        consumedAt: null,
      });
      expect(ch.isValid()).toBe(false);
    });

    it("inválido quando consumido (mesmo não expirado)", () => {
      const ch = challenge({
        expiresAt: new Date(Date.now() + 60_000),
        consumedAt: new Date(),
      });
      expect(ch.isValid()).toBe(false);
    });

    it("inválido quando expirado E consumido", () => {
      const ch = challenge({
        expiresAt: new Date(Date.now() - 60_000),
        consumedAt: new Date(),
      });
      expect(ch.isValid()).toBe(false);
    });

    it("respeita o `now` injetado ao decidir validade", () => {
      const ch = challenge({
        expiresAt: new Date("2026-06-21T10:05:00.000Z"),
        consumedAt: null,
      });
      expect(ch.isValid(new Date("2026-06-21T10:04:00.000Z"))).toBe(true);
      expect(ch.isValid(new Date("2026-06-21T10:06:00.000Z"))).toBe(false);
    });
  });

  describe("consume", () => {
    it("marca o consumedAt com o `now` informado e passa a estar consumido", () => {
      const ch = challenge({ consumedAt: null });
      const at = new Date("2026-06-21T11:00:00.000Z");

      ch.consume(at);

      expect(ch.isConsumed()).toBe(true);
      expect(ch.toJSON().consumedAt).toEqual(at);
    });

    it("usa `new Date()` como default quando `now` não é passado", () => {
      const ch = challenge({ consumedAt: null });

      ch.consume();

      expect(ch.isConsumed()).toBe(true);
      expect(ch.toJSON().consumedAt).toBeInstanceOf(Date);
    });

    it("idempotente: segunda chamada é no-op e preserva o consumedAt original", () => {
      const ch = challenge({ consumedAt: null });
      const first = new Date("2026-06-21T11:00:00.000Z");
      const second = new Date("2026-06-21T12:00:00.000Z");

      ch.consume(first);
      ch.consume(second);

      expect(ch.toJSON().consumedAt).toEqual(first);
    });

    it("no-op quando já vem consumido na construção", () => {
      const original = new Date("2026-06-21T09:00:00.000Z");
      const ch = challenge({ consumedAt: original });

      ch.consume(new Date("2026-06-21T13:00:00.000Z"));

      expect(ch.toJSON().consumedAt).toEqual(original);
    });

    it("consumir invalida o desafio (isValid passa a false)", () => {
      const ch = challenge({
        expiresAt: new Date(Date.now() + 60_000),
        consumedAt: null,
      });
      expect(ch.isValid()).toBe(true);

      ch.consume();

      expect(ch.isValid()).toBe(false);
    });
  });

  describe("toJSON", () => {
    it("reflete todas as props da entidade", () => {
      const props: ChallengeProps = {
        id: "ch-2",
        userId: "u-2",
        word: "verde",
        number: 77,
        gesture: "peace_sign",
        nonce: "nonce-2",
        issuedAt: new Date("2026-06-21T08:00:00.000Z"),
        expiresAt: new Date("2026-06-21T08:02:00.000Z"),
        consumedAt: null,
      };
      const ch = Challenge.create(props);

      expect(ch.toJSON()).toEqual(props);
    });

    it("retorna uma cópia nova a cada chamada (não compartilha referência)", () => {
      const ch = challenge({ consumedAt: null });

      const a = ch.toJSON();
      const b = ch.toJSON();

      expect(a).not.toBe(b);
      expect(a).toEqual(b);
    });

    it("expõe o consumedAt atualizado após consume()", () => {
      const ch = challenge({ consumedAt: null });
      const at = new Date("2026-06-21T11:30:00.000Z");

      ch.consume(at);

      expect(ch.toJSON().consumedAt).toEqual(at);
    });
  });
});
