"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type JSX,
  type ReactNode,
} from "react";
import { appUrl } from "@/config";

/** Domínio do stake — o valor que a pessoa põe em jogo (mesma faixa do app). */
export const STAKE_MIN = 50;
export const STAKE_MAX = 500;
export const STAKE_STEP = 10;
export const STAKE_DEFAULT = 200;

/** Metas oferecidas no montador de bilhete (kg a perder). */
export const META_OPCOES = [5, 8, 12, 15] as const;
export const META_DEFAULT = 8;

/** Prazos oferecidos no montador de bilhete (meses). */
export const PRAZO_OPCOES = [2, 3, 4, 6] as const;
export const PRAZO_DEFAULT = 4;

/**
 * Régua de plausibilidade: acima de ~1 kg/semana a meta deixa de ser saudável.
 * Semanas por mês ≈ 4,345 (365,25 / 12 / 7) — aproximação estável e suficiente
 * pra régua de UX (não é promessa clínica).
 */
export const RITMO_MAX_KG_SEMANA = 1;
const SEMANAS_POR_MES = 4.345;

/**
 * Menor prazo do domínio em que a meta cabe num ritmo saudável (≤ ~1 kg/sem).
 * Componentes usam pra desabilitar/avisar ANTES do toque; o provider usa pra
 * subir o prazo automaticamente quando a meta escolhida estoura o ritmo
 * (microcopy sugerida: "ajustamos o prazo pra uma meta saudável").
 */
export function prazoMinimoSaudavel(metaKg: number): number {
  const saudavel = PRAZO_OPCOES.find(
    (meses) => metaKg / (meses * SEMANAS_POR_MES) <= RITMO_MAX_KG_SEMANA,
  );
  // meta fora do domínio: devolve o maior prazo (nenhuma META_OPCOES cai aqui)
  return saudavel ?? Math.max(...PRAZO_OPCOES);
}

export interface ApostaValue {
  /** Valor em jogo — alimenta o bilhete do hero e TODOS os CTAs de apostar. */
  stake: number;
  setStake: (n: number) => void;
  /** Meta do bilhete: quantos kg a pessoa aposta que perde. */
  metaKg: number;
  /** Troca a meta e, se o prazo atual ficar agressivo demais, sobe o prazo. */
  setMetaKg: (n: number) => void;
  /** Prazo do bilhete, em meses. */
  prazoMeses: number;
  setPrazoMeses: (n: number) => void;
}

const ApostaContext = createContext<ApostaValue | null>(null);

/**
 * Estado da APOSTA MONTADA — o bilhete (meta + prazo + valor) que a pessoa
 * constrói no hero e que atravessa a página inteira até o canhoto sticky.
 * Honesto por construção: só guarda o que a própria pessoa escolheu, nada de
 * urgência inventada nem contadores; sem storage, sem Date.now — o primeiro
 * render é idêntico no server e no cliente (SSG/hydration seguros).
 */
export function ApostaProvider({ children }: { children: ReactNode }): JSX.Element {
  const [stake, setStake] = useState(STAKE_DEFAULT);
  const [metaKg, setMetaKgState] = useState<number>(META_DEFAULT);
  const [prazoMeses, setPrazoMeses] = useState<number>(PRAZO_DEFAULT);

  // regra de plausibilidade: meta nova nunca deixa o bilhete acima de ~1 kg/sem
  const setMetaKg = useCallback((kg: number) => {
    setMetaKgState(kg);
    setPrazoMeses((atual) => Math.max(atual, prazoMinimoSaudavel(kg)));
  }, []);

  const value = useMemo(
    () => ({ stake, setStake, metaKg, setMetaKg, prazoMeses, setPrazoMeses }),
    [stake, metaKg, setMetaKg, prazoMeses],
  );

  return <ApostaContext.Provider value={value}>{children}</ApostaContext.Provider>;
}

/** Acesso à aposta — exige `<ApostaProvider>` acima (a página inteira usa um só). */
export function useAposta(): ApostaValue {
  const ctx = useContext(ApostaContext);
  if (!ctx) throw new Error("useAposta precisa de <ApostaProvider> acima na árvore");
  return ctx;
}

/**
 * Href único de conversão: leva o bilhete montado pro app via query string.
 * TODOS os CTAs de apostar (hero, canhoto, clímax, CTA final) usam este hook —
 * um só destino, um só formato, nada de link montado à mão.
 */
export function useApostaHref(): string {
  const { stake, metaKg, prazoMeses } = useAposta();
  return `${appUrl}?valor=${stake}&meta=${metaKg}&prazo=${prazoMeses}`;
}
