// Pula a validação de env (@charya/env) ao emitir o contrato OpenAPI: não há
// env real ao gerar o spec. Importado ANTES do AppModule em openapi-emit.ts
// (ESM executa os imports em ordem), então o schema de env nem é avaliado.
process.env.SKIP_ENV_VALIDATION ??= "true";
