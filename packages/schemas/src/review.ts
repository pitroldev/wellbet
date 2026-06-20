import { z } from "zod";
import { NonEmptyString, ReviewId, Timestamp, Timestamps, UserId, WeighInId } from "./common.js";
import { PlausibilityOutcome } from "./plausibility.js";

/**
 * Revisão humana — o coração do MVP manual-first.
 *
 * Revisão humana de 100% das pesagens é o detector de fraude e, ao mesmo
 * tempo, a fonte de treino da Fase 2: para cada pesagem registramos veredito,
 * motivo e quais itens do checklist falharam (vira dataset rotulado).
 *
 * Ver `docs/Charya_Validacao_Peso_MVP.md` §5, §7 e §9.
 */

/* -------------------------------------------------------------------------- */
/* Veredito                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Veredito do revisor (§7):
 * - `APROVADO`  — checklist validado e regra de sanidade passou; settlement segue.
 * - `PENDENTE`  — algo ficou dúbio/faltou frame; recaptura orientada e reavalia.
 * - `REPROVADO` — fraude clara no checklist, ou bloqueio da regra dura.
 *
 * Política: **na dúvida, `PENDENTE`** — nunca aprovar no susto, nunca reprovar
 * honesto por vídeo ruim.
 */
export const Verdict = z.enum(["APROVADO", "PENDENTE", "REPROVADO"]);
export type Verdict = z.infer<typeof Verdict>;

/* -------------------------------------------------------------------------- */
/* Itens do checklist (os selos do MVP, §5)                                     */
/* -------------------------------------------------------------------------- */

/**
 * Cada selo que o revisor confere item a item. Os nomes refletem 1:1 a tabela
 * do §5 do doc de validação.
 */
export const ChecklistItem = z.enum([
  /** Frescor / anti-replay: código dinâmico bate e gesto foi feito. */
  "freshness",
  /** Vídeo contínuo: take único, sem corte, gravado no app. */
  "continuous_video",
  /** Balança zerada: vazia marca 0,0 limpo e estável antes de subir. */
  "scale_zeroed",
  /** Piso/cena: chão plano e nivelado, balança não inclinada, sem calço. */
  "floor_scene",
  /** Sem truque de corpo: sobe sem apoio, mãos à vista, peso estável. */
  "no_body_trick",
  /** Visor íntegro: número se firma do zero, sem display sobreposto. */
  "display_intact",
  /** Mesma pessoa: rosto bate entre T0/T1/T2. */
  "same_person",
  /** Plausibilidade: a perda faz sentido fisiológico para prazo/perfil. */
  "plausibility",
]);
export type ChecklistItem = z.infer<typeof ChecklistItem>;

/** Ordem canônica de exibição do checklist no console. */
export const CHECKLIST_ITEMS: readonly ChecklistItem[] = [
  "freshness",
  "continuous_video",
  "scale_zeroed",
  "floor_scene",
  "no_body_trick",
  "display_intact",
  "same_person",
  "plausibility",
];

/**
 * Resultado de um item do checklist:
 * - `pass` — selo aprovado.
 * - `fail` — selo reprovado (o `note` deve explicar; vira rótulo de fraude).
 * - `na`   — não avaliável (ex.: frame faltando) → empurra para `PENDENTE`.
 */
export const ChecklistItemStatus = z.enum(["pass", "fail", "na"]);
export type ChecklistItemStatus = z.infer<typeof ChecklistItemStatus>;

export const ChecklistEntry = z
  .object({
    item: ChecklistItem,
    status: ChecklistItemStatus,
    /** Observação do revisor; obrigatória quando `fail` (dataset Fase 2). */
    note: NonEmptyString.optional(),
  })
  .refine((e) => e.status !== "fail" || e.note !== undefined, {
    message: "Item reprovado exige uma observação (note).",
    path: ["note"],
  });
export type ChecklistEntry = z.infer<typeof ChecklistEntry>;

/**
 * Checklist completo: exatamente um registro por selo do §5.
 */
export const ReviewChecklist = z
  .array(ChecklistEntry)
  .length(CHECKLIST_ITEMS.length)
  .refine((entries) => new Set(entries.map((e) => e.item)).size === entries.length, {
    message: "Cada item do checklist deve aparecer exatamente uma vez.",
  })
  .refine((entries) => CHECKLIST_ITEMS.every((item) => entries.some((e) => e.item === item)), {
    message: "O checklist deve cobrir todos os itens do §5.",
  });
export type ReviewChecklist = z.infer<typeof ReviewChecklist>;

/* -------------------------------------------------------------------------- */
/* Decisão de revisão                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Decisão do revisor sobre uma pesagem. Carrega o veredito, o checklist item
 * a item, o motivo e as flags que alimentam o dataset da Fase 2 (§9).
 */
export const ReviewDecision = z
  .object({
    id: ReviewId,
    weighInId: WeighInId,
    /** Revisor que emitiu a decisão. */
    reviewerId: UserId,
    verdict: Verdict,
    checklist: ReviewChecklist,
    /** Motivo legível da decisão (sempre presente). */
    reason: NonEmptyString,
    /** Resultado da regra dura herdado da pesagem (contexto da decisão). */
    sanityOutcome: PlausibilityOutcome,

    /* --- Flags p/ virar dataset (Fase 2, §9) --- */
    /** Marca a pesagem como exemplo rotulado de fraude real encontrada. */
    isFraudExample: z.boolean().default(false),
    /** Itens do checklist que falharam (derivado, salvo p/ consulta rápida). */
    failedItems: z.array(ChecklistItem).default([]),
    /** Rótulos livres p/ curadoria do dataset (ex.: "peso de água"). */
    labels: z.array(NonEmptyString).default([]),

    decidedAt: Timestamp,
  })
  .extend(Timestamps.shape)
  .refine(
    (d) =>
      // REPROVADO exige ao menos um item falho OU bloqueio da regra dura.
      d.verdict !== "REPROVADO" || d.failedItems.length > 0 || d.sanityOutcome === "blocked",
    {
      message: "REPROVADO exige ao menos um item reprovado ou bloqueio da regra dura.",
      path: ["failedItems"],
    },
  )
  .refine(
    (d) =>
      // APROVADO não pode coexistir com bloqueio da regra dura.
      d.verdict !== "APROVADO" || d.sanityOutcome !== "blocked",
    {
      message: "Não é possível APROVAR uma pesagem bloqueada pela regra dura.",
      path: ["verdict"],
    },
  );
export type ReviewDecision = z.infer<typeof ReviewDecision>;

/* -------------------------------------------------------------------------- */
/* Contrato de submissão (input do console)                                    */
/* -------------------------------------------------------------------------- */

/**
 * Payload que o console envia ao gravar uma decisão. O servidor atribui `id`,
 * timestamps, deriva `failedItems` do checklist e confere consistência.
 */
export const SubmitReviewInput = z.object({
  weighInId: WeighInId,
  verdict: Verdict,
  checklist: ReviewChecklist,
  reason: NonEmptyString,
  isFraudExample: z.boolean().default(false),
  labels: z.array(NonEmptyString).default([]),
});
export type SubmitReviewInput = z.infer<typeof SubmitReviewInput>;
