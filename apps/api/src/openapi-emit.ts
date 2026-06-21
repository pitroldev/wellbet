// Deve vir ANTES de qualquer import que avalie o schema de env (AppModule →
// config → @charya/env). ESM executa os imports na ordem em que aparecem.
import "./skip-env.js";

import "reflect-metadata";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";
import { emitOpenApi } from "./openapi.js";

/**
 * Emite o openapi.json SEM subir a aplicação: cria o container do Nest mas NÃO
 * chama `app.init()`, então nenhum `onModuleInit` roda (sem conexão a Postgres
 * nem pg-boss). O contrato vem da metadata dos controllers/DTOs, então o CI gera
 * o cliente `@charya/contracts` sem precisar de banco.
 *
 * Use com `SKIP_ENV_VALIDATION=true` (não há env real ao emitir o contrato).
 */
async function main(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: false,
    abortOnError: false,
  });
  // Mesmo prefixo global do bootstrap (main.ts) para o contrato refletir as
  // rotas reais sob /api.
  app.setGlobalPrefix("api", { exclude: ["docs", "docs-json"] });
  emitOpenApi(app);
  await app.close();
}

void main();
