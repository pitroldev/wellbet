/**
 * @charya/schemas — fonte única da verdade de validação (Zod 4).
 *
 * Compartilhado por api / admin / mobile. Cada módulo exporta seus schemas
 * Zod e o `z.infer` correspondente. Nada de lógica de runtime além das
 * funções puras de domínio (ex.: `checkPlausibility`).
 */

export * from "./common.js";
export * from "./identity.js";
export * from "./bet.js";
export * from "./weighin.js";
export * from "./review.js";
export * from "./plausibility.js";
