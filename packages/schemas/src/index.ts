/**
 * @charya/schemas — primitivos e validação COMPARTILHADOS (Zod 4).
 *
 * O contrato do fio (DTOs de request/response) vive em `@charya/contracts`,
 * gerado do OpenAPI da api (SSoT único). Aqui ficam só: primitivos comuns
 * (`common`), o enum canônico de status de pesagem (`weighin`) e a regra dura
 * de plausibilidade (`plausibility`) — coisas que a própria api consome.
 */

export * from "./common.js";
export * from "./weighin.js";
export * from "./plausibility.js";
