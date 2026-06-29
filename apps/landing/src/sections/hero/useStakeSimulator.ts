"use client";

import { useState } from "react";

const MIN = 50;
const MAX = 500;
const STEP = 10;

/**
 * Estado do simulador de stake (lógica fora da view). Sem cotação/multiplicador
 * inventado: o número é o que você PÕE EM JOGO — o valor que a aversão à perda
 * coloca em risco. `pct` (0–1) alimenta a alavanca tátil (barra/inclinação).
 */
export function useStakeSimulator(initial = 200) {
  const [stake, setStake] = useState(initial);
  const pct = (stake - MIN) / (MAX - MIN);
  return { stake, setStake, min: MIN, max: MAX, step: STEP, pct } as const;
}

export type StakeSim = ReturnType<typeof useStakeSimulator>;
