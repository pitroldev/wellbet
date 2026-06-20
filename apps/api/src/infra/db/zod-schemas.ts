/**
 * Validadores Zod derivados das tabelas Drizzle (drizzle-zod).
 *
 * "Schema único do banco ao input" (§2/§10 do doc): em vez de redigitar os
 * campos, derivamos os schemas de insert/select diretamente das tabelas. Os
 * módulos http podem reusar/estender estes (ex.: `.pick`, `.extend`) mantendo
 * coerência com a persistência — e com `@charya/schemas` (mesmo domínio).
 */
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { bets, challenges, reviews, users, weighins } from "./schema.js";

export const userInsertSchema = createInsertSchema(users);
export const userSelectSchema = createSelectSchema(users);

export const challengeInsertSchema = createInsertSchema(challenges);
export const challengeSelectSchema = createSelectSchema(challenges);

export const weighinInsertSchema = createInsertSchema(weighins);
export const weighinSelectSchema = createSelectSchema(weighins);

export const reviewInsertSchema = createInsertSchema(reviews);
export const reviewSelectSchema = createSelectSchema(reviews);

export const betInsertSchema = createInsertSchema(bets);
export const betSelectSchema = createSelectSchema(bets);
