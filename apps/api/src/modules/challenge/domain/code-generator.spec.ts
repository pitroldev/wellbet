import { describe, expect, it, vi } from "vitest";

import { GESTURES } from "./challenge.entity.js";
import { generateCode, type RandomSource } from "./code-generator.js";

// Palavras possíveis (espelha a lista enxuta da fonte; usada só para asserts de pertinência).
const WORDS = ["pedra", "verde", "rio", "sol", "mar", "lobo", "ferro", "nuvem", "fogo", "pao"];

/**
 * RandomSource determinístico controlado por teste. `int` retorna valores
 * roteirizados na ordem das chamadas; `nonce` retorna um valor fixo.
 */
function scriptedRng(ints: number[], nonceValue = "nonce-xyz"): RandomSource {
  return makeRng(ints, nonceValue).rng;
}

/**
 * Cria o RNG roteirizado expondo também os spies `int`/`nonce` como variáveis
 * independentes, evitando acessar métodos pelo objeto (regra unbound-method).
 */
function makeRng(ints: number[], nonceValue = "nonce-xyz") {
  const queue = [...ints];
  const int = vi.fn((maxExclusive: number) => {
    const next = queue.shift();
    return next === undefined ? 0 : next % maxExclusive;
  });
  const nonce = vi.fn(() => nonceValue);
  const rng: RandomSource = { int, nonce };
  return { rng, int, nonce };
}

describe("generateCode — geração pura do código dinâmico", () => {
  it("determinístico: mesmas escolhas do RNG → mesmo código", () => {
    // Ordem das chamadas int: word(idx), number(0..89), gesture(idx).
    const rng = scriptedRng([1, 5, 2], "abc123");

    const code = generateCode(rng);

    expect(code).toEqual({
      word: WORDS[1], // "verde"
      number: 10 + 5,
      gesture: GESTURES[2], // "open_palm"
      nonce: "abc123",
    });
  });

  it("chama o RNG nas faixas certas: WORDS.length, 90, GESTURES.length", () => {
    const { rng, int, nonce } = makeRng([0, 0, 0]);

    generateCode(rng);

    expect(int).toHaveBeenNthCalledWith(1, WORDS.length);
    expect(int).toHaveBeenNthCalledWith(2, 90);
    expect(int).toHaveBeenNthCalledWith(3, GESTURES.length);
    expect(int).toHaveBeenCalledTimes(3);
    expect(nonce).toHaveBeenCalledTimes(1);
  });

  it("escolhe a palavra pelo índice do RNG", () => {
    const rng = scriptedRng([3, 0, 0]);
    expect(generateCode(rng).word).toBe(WORDS[3]);
  });

  it("escolhe o gesto pelo índice do RNG (dentro de GESTURES)", () => {
    const rng = scriptedRng([0, 0, 4]);
    const code = generateCode(rng);
    expect(code.gesture).toBe(GESTURES[4]);
    expect(GESTURES).toContain(code.gesture);
  });

  it("repassa o nonce opaco do RNG sem transformação", () => {
    const rng = scriptedRng([0, 0, 0], "deadbeef");
    expect(generateCode(rng).nonce).toBe("deadbeef");
  });

  describe("faixa do número (2 dígitos: 10..99)", () => {
    it("piso: int=0 → número 10", () => {
      expect(generateCode(scriptedRng([0, 0, 0])).number).toBe(10);
    });

    it("teto: int=89 → número 99", () => {
      expect(generateCode(scriptedRng([0, 89, 0])).number).toBe(99);
    });

    it("intermediário: int=40 → número 50", () => {
      expect(generateCode(scriptedRng([0, 40, 0])).number).toBe(50);
    });
  });

  describe("varredura: todos os índices produzem campos válidos", () => {
    it("cobre todas as palavras possíveis", () => {
      for (let i = 0; i < WORDS.length; i++) {
        const code = generateCode(scriptedRng([i, 0, 0]));
        expect(code.word).toBe(WORDS[i]);
      }
    });

    it("cobre todos os gestos possíveis", () => {
      for (let i = 0; i < GESTURES.length; i++) {
        const code = generateCode(scriptedRng([0, 0, i]));
        expect(code.gesture).toBe(GESTURES[i]);
      }
    });

    it("número sempre em [10, 99] para todo int de número em [0, 89]", () => {
      for (let i = 0; i < 90; i++) {
        const { number } = generateCode(scriptedRng([0, i, 0]));
        expect(number).toBeGreaterThanOrEqual(10);
        expect(number).toBeLessThanOrEqual(99);
      }
    });
  });

  it("integração com crypto-like RNG: campos sempre dentro do domínio válido", () => {
    // RNG aleatório real (não roteirizado) deve sempre produzir um código bem formado.
    const rng: RandomSource = {
      int: (maxExclusive) => Math.floor(Math.random() * maxExclusive),
      nonce: () => "n",
    };
    for (let i = 0; i < 200; i++) {
      const code = generateCode(rng);
      expect(WORDS).toContain(code.word);
      expect(GESTURES).toContain(code.gesture);
      expect(code.number).toBeGreaterThanOrEqual(10);
      expect(code.number).toBeLessThanOrEqual(99);
    }
  });
});
