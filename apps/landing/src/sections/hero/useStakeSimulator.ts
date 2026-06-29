"use client";

import { useState } from "react";

/**
 * Estado do simulador de stake (lógica fora da view). Sem cotação/multiplicador
 * inventado: o número é o que você PÕE EM JOGO — o valor que a aversão à perda
 * coloca em risco. O "de volta + recompensa" é qualitativo (vem do bolo de quem
 * desistiu), não uma promessa de dobrar dinheiro.
 */
export function useStakeSimulator(initial = 200) {
  const [stake, setStake] = useState(initial);
  return { stake, setStake, min: 50, max: 500, step: 10 } as const;
}
