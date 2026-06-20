/**
 * Geração pura do código dinâmico (palavra + número + gesto + nonce).
 *
 * Server-side, uso único, TTL (doc de Validação §4). A aleatoriedade é injetada
 * para testes determinísticos; em produção usa `crypto`.
 */
import { GESTURES, type Gesture } from "./challenge.entity.js";

/** Lista enxuta de palavras fáceis de ler/falar no vídeo. */
const WORDS: readonly string[] = [
  "pedra",
  "verde",
  "rio",
  "sol",
  "mar",
  "lobo",
  "ferro",
  "nuvem",
  "fogo",
  "pao",
];

export interface RandomSource {
  /** Inteiro em [0, maxExclusive). */
  int(maxExclusive: number): number;
  /** Nonce opaco de uso único (hex). */
  nonce(): string;
}

export interface GeneratedCode {
  readonly word: string;
  readonly number: number;
  readonly gesture: Gesture;
  readonly nonce: string;
}

/** Gera o código dinâmico a partir de uma fonte de aleatoriedade. */
export function generateCode(rng: RandomSource): GeneratedCode {
  const word = WORDS[rng.int(WORDS.length)] ?? WORDS[0]!;
  const number = 10 + rng.int(90); // 2 dígitos, fácil de mostrar
  const gesture = GESTURES[rng.int(GESTURES.length)] ?? GESTURES[0]!;
  const nonce = rng.nonce();
  return { word, number, gesture, nonce };
}
