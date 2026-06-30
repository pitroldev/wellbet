/**
 * Gerador LOCAL do código dinâmico (anti-replay) para o fluxo local-first.
 *
 * No fluxo real, o desafio vem do servidor (HMAC, nonce de uso único, TTL curto)
 * via `useStartWeighIn`. Aqui — sem backend na captura — geramos um equivalente
 * no cliente só para a EXPERIÊNCIA de gravação (palavra + número + gesto na tela).
 * Quando o placeBet/weighin real entrar, troque por `useStartWeighIn`.
 */
import type { Challenge } from "./types";

const WORDS = ["FOGO", "RETA", "PULO", "GIRO", "FORTE", "RAIO", "NORTE", "VERDE", "CALMA", "FOCO"];
/** Gestos que o DynamicCodeOverlay sabe traduzir (i18n weighin.code.gestures.*). */
const GESTURES = ["thumbs_up", "open_palm", "peace_sign", "wave", "point_up"];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/** Gera um desafio local. Chame em handler/efeito (usa Math.random/Date.now). */
export function localChallenge(): Challenge {
  const code = String(1000 + Math.floor(Math.random() * 9000));
  return {
    challengeId: `local-${Date.now()}`,
    word: pick(WORDS),
    code,
    gesture: pick(GESTURES),
    nonce: `local-${Math.random().toString(36).slice(2, 10)}`,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  };
}
