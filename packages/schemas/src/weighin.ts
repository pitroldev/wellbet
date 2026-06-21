import { z } from "zod";

/**
 * Status operacional da pesagem no fluxo manual-first. **Fonte única da
 * verdade** do enum de status, compartilhado por api / admin / mobile.
 *
 * O resto do contrato de pesagem (captura, código dinâmico, payload, etc.) vive
 * em `@charya/contracts` — gerado do OpenAPI da api, que é o SSoT do fio. Este
 * pacote guarda apenas primitivos/enums compartilhados e validação que a api
 * de fato consome (ver também `plausibility.ts`).
 *
 * - `pending`   — recebida; ainda não avaliada pela regra dura (§6).
 * - `blocked`   — bloqueada pela regra dura (perda fisicamente impossível).
 * - `in_review` — passou na sanidade; na fila do revisor humano (§5).
 * - `approved`  — revisor aprovou (§7).
 * - `rejected`  — revisor reprovou (§7).
 * - `recapture` — revisor pediu nova captura (§7).
 */
export const WeighInStatus = z.enum([
  "pending",
  "blocked",
  "in_review",
  "approved",
  "rejected",
  "recapture",
]);
export type WeighInStatus = z.infer<typeof WeighInStatus>;
