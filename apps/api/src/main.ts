/**
 * Bootstrap da Charya API.
 *
 * ORDEM CRÍTICA:
 *  1. `reflect-metadata` (DI do Nest depende dele).
 *  2. `startOtel()` — ANTES de qualquer import da aplicação, para as
 *     auto-instrumentations fazerem patch de http/pg/express antes de carregados.
 *  3. Só então importamos AppModule e subimos o Nest.
 */
import "reflect-metadata";

import { startOtel } from "./observability/otel.js";

// Inicia o OTel SDK por side-effect antes de tudo que será instrumentado.
startOtel();

import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import { Logger } from "nestjs-pino";

import { AppModule } from "./app.module.js";
import { env } from "./config/env.js";
import { emitOpenApi, setupSwagger } from "./openapi.js";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // Logs do framework também passam pelo Pino (correlacionado a trace).
    bufferLogs: true,
  });

  // Pino como logger do Nest (substitui o logger default).
  app.useLogger(app.get(Logger));

  // Headers de segurança (helmet). Esta é uma API JSON (não serve HTML próprio),
  // então:
  //  - `contentSecurityPolicy: false` — CSP é para documentos HTML; mantê-la
  //    default quebraria o Swagger UI (/docs) sem ganho para respostas JSON.
  //  - `crossOriginResourcePolicy: 'same-site'` — evita que outros sites
  //    embutam recursos da API.
  // Os demais defaults do helmet (HSTS, noSniff, frameguard DENY, hidePoweredBy,
  // referrerPolicy, etc.) ficam LIGADOS.
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "same-site" },
    }),
  );

  app.setGlobalPrefix("api", { exclude: ["docs", "docs-json"] });
  app.enableShutdownHooks();

  // Modo emissão de contrato: gera openapi.json e sai (usado no build/CI).
  if (process.argv.includes("--emit-openapi")) {
    await app.init();
    emitOpenApi(app);
    await app.close();
    return;
  }

  setupSwagger(app);

  await app.listen(env.PORT ?? 3000);

  console.log(`[charya-api] ouvindo na porta ${env.PORT ?? 3000}`);
}

void bootstrap();
