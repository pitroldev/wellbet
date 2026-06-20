import { z } from "zod";
import { CHECKLIST_ITEMS, VERDICTS } from "./types";
import type { ChecklistItemKey } from "./types";

/**
 * Schema Zod do veredito de revisão.
 *
 * A fonte da verdade dos schemas de domínio é @charya/schemas (Zod 4). Este
 * schema é local e específico do formulário do console; quando o pacote expuser
 * `reviewVerdictSchema`, importá-lo daqui:
 *
 *   import { reviewVerdictSchema } from "@charya/schemas";
 *
 * e remover esta cópia. Mantido coerente com `VerdictSubmission` de ./types.
 */

const itemResultSchema = z.enum(["ok", "fail", "na"]);

const checklistKeys = CHECKLIST_ITEMS.map((i) => i.key) as [
  ChecklistItemKey,
  ...ChecklistItemKey[],
];

/**
 * Mapa item → resultado. `z.record` com chave enumerada garante que todos os
 * itens do checklist (§5) estejam presentes, mantendo o tipo
 * `Record<ChecklistItemKey, ItemResult>`.
 */
const itemsSchema = z.record(z.enum(checklistKeys), itemResultSchema);

export const verdictFormSchema = z
  .object({
    verdict: z.enum(VERDICTS),
    reason: z.string().trim().max(2000),
    items: itemsSchema,
  })
  .refine((data) => data.verdict === "APROVADO" || data.reason.trim().length >= 3, {
    // Política §7: na dúvida PENDENTE; PENDENTE/REPROVADO exigem motivo.
    message: "Motivo é obrigatório para PENDENTE ou REPROVADO.",
    path: ["reason"],
  });

export type VerdictFormValues = z.infer<typeof verdictFormSchema>;
