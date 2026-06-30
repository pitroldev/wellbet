/**
 * Tipos de domínio da revisão humana (MVP manual-first).
 *
 * Fonte da verdade dos schemas é @charya/schemas (Zod 4). Estes tipos espelham
 * o contrato esperado e devem ser substituídos pelos `z.infer` do pacote assim
 * que ele expuser os schemas de review (ver ChecklistForm.tsx).
 */

/** Veredito do revisor — Validação §7. */
export const VERDICTS = ["APROVADO", "PENDENTE", "REPROVADO"] as const;
export type Verdict = (typeof VERDICTS)[number];

/** Tipo de captura — Validação §3. */
export const CAPTURES = ["T0", "T1", "T2"] as const;
export type CaptureKind = (typeof CAPTURES)[number];

/**
 * Itens do checklist que o revisor aplica a cada pesagem — Validação §5.
 * Cada item vira uma coluna do dataset da Fase 2 (§9), por isso a chave é
 * estável e o resultado é tristate (vira flag quando reprova).
 */
export const CHECKLIST_ITEMS = [
  {
    key: "freshness",
    label: "Frescor / anti-replay",
    confer: "O código dinâmico no vídeo é o mesmo emitido para esta sessão e o gesto foi feito.",
    reprovaQuando: "Código errado/ausente, gesto não feito.",
  },
  {
    key: "continuous_video",
    label: "Vídeo contínuo",
    confer: "Take único, sem corte/emenda; gravado no app (não upload).",
    reprovaQuando: "Cortes, reencode de editor, origem externa.",
  },
  {
    key: "scale_zeroed",
    label: "Balança zerada (âncora do instrumento)",
    confer: "Antes de subir, balança vazia marca 0,0 limpo e estável; número sai do zero ao subir.",
    reprovaQuando: "Não mostra o zero, zero instável/deslocado, ou não está vazia.",
  },
  {
    key: "floor_scene",
    label: "Piso / cena",
    confer: "Chão plano e nivelado, balança não inclinada, sem calço/tapete grosso.",
    reprovaQuando: "Piso torto, balança tombada, calço aparente.",
  },
  {
    key: "no_body_trick",
    label: "Sem truque de corpo",
    confer: "Sobe sem apoio, mãos visíveis, peso estável.",
    reprovaQuando: "Apoio em parede/móvel, descarga de peso.",
  },
  {
    key: "display_integrity",
    label: "Visor íntegro",
    confer: "Número se firma do zero; sem visor sobreposto (borda/reflexo/fonte estranhos).",
    reprovaQuando: "Sinais de display falso.",
  },
  {
    key: "same_person",
    label: "Mesma pessoa",
    confer: "Rosto bate entre T0, T1, T2 (comparação visual dos 3 vídeos).",
    reprovaQuando: "Pessoa diferente entre capturas.",
  },
  {
    key: "plausibility",
    label: "Plausibilidade",
    confer: "A perda faz sentido fisiológico para o prazo/perfil.",
    reprovaQuando: "Perda incompatível (regra dura de sanidade, §6).",
  },
] as const;

export type ChecklistItemKey = (typeof CHECKLIST_ITEMS)[number]["key"];

/**
 * Resultado por item. A ESCRITA é binária (`ok` | `fail`) — o N/A foi removido
 * (critérios não-aplicáveis nem aparecem). `na` permanece no tipo só para LER
 * revisões legadas já decididas.
 */
export type ItemResult = "ok" | "fail" | "na";

/** Fatos de aplicabilidade (substituem o N/A) — vêm do servidor (review-detail). */
export interface ReviewContext {
  hasCode: boolean;
  hasComparison: boolean;
  hasPreviousWeight: boolean;
}

// A linha da fila de revisão (ReviewQueueEntryDto) vem de @charya/contracts —
// gerada do OpenAPI da api, fonte única do contrato.

/** Código dinâmico esperado (anti-replay) — estruturado p/ exibição legível. */
export interface ExpectedCode {
  word: string;
  number: number;
  gesture: string;
}

/** Veredito já registrado (decisão única) — usado no modo somente-leitura. */
export interface DecidedVerdict {
  verdict: Verdict;
  reason: string | null;
  failedItems: string[];
  items: Record<string, ItemResult>;
}

/** Sessão de revisão completa (player + 3 vídeos para comparação). */
export interface ReviewSession {
  id: string;
  userId: string;
  userName: string;
  capture: CaptureKind;
  weightKg: number;
  /** Peso da baseline (T0) da aposta — base para tendência/plausibilidade. */
  previousWeightKg: number | null;
  /** Semanas decorridas entre a baseline e esta captura. */
  weeks: number | null;
  /** Perda por semana calculada (regra de sanidade) — null se indisponível. */
  lossPerWeekKg: number | null;
  sanityPassed: boolean;
  /** URLs dos vídeos das 3 capturas (T0/T1/T2) para comparação de identidade. */
  videos: Record<CaptureKind, string | null>;
  /** Código dinâmico que o app emitiu para esta sessão (anti-replay). */
  expectedCode: ExpectedCode | null;
  submittedAt: string;
  /** Veredito já registrado (decisão única) — null se ainda pendente. */
  decided: DecidedVerdict | null;
  /** Fatos de aplicabilidade dos critérios (substituem o N/A). */
  context: ReviewContext;
}

/**
 * Payload do veredito gravado pelo revisor — vira dataset Fase 2 (§9).
 *
 * As chaves são `string` (slug do critério configurável), não mais o enum fixo:
 * o checklist é montado a partir dos critérios habilitados (tabela
 * `approval_criteria`).
 */
export interface VerdictSubmission {
  sessionId: string;
  verdict: Verdict;
  /** Motivo livre do revisor (obrigatório em PENDENTE/REPROVADO). */
  reason: string;
  /** Keys dos critérios que falharam — flags rotuladas. */
  failedItems: string[];
  /** Resultado item a item — ESCRITA binária (sem N/A). */
  items: Record<string, "ok" | "fail">;
}
