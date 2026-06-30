import { z } from "zod";
import { VERDICTS } from "./types";

/**
 * Schema Zod do veredito de revisão.
 *
 * Os itens do checklist são DINÂMICOS (critérios configuráveis em
 * `approval_criteria`, carregados via @charya/contracts), por isso `items` é um
 * mapa `key → resultado` com chave `string` (e não mais um enum fixo). A
 * consistência das keys é garantida pela UI (renderiza só critérios habilitados).
 */
const itemResultSchema = z.enum(["ok", "fail", "na"]);

const itemsSchema = z.record(z.string(), itemResultSchema);

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
