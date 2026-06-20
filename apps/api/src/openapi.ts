import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { cleanupOpenApiDoc } from "nestjs-zod";

/**
 * Setup do OpenAPI (@nestjs/swagger).
 *
 * `cleanupOpenApiDoc` (nestjs-zod v5) pós-processa o documento para os DTOs
 * Zod aparecerem corretos no schema OpenAPI. O documento é a FONTE DO CONTRATO:
 * o cliente tipado em `@charya/contracts` é gerado dele (Hey API) e o CI checa
 * spec-drift (§5/§8).
 */
export function buildOpenApiDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("Charya API")
    .setDescription("Backend Charya Bet — pesagem, desafio, revisão, aposta.")
    .setVersion("0.0.0")
    .addCookieAuth("better-auth.session_token")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  return cleanupOpenApiDoc(document);
}

/** Monta o Swagger UI em /docs e expõe o JSON em /docs-json. */
export function setupSwagger(app: INestApplication): void {
  const document = buildOpenApiDocument(app);
  SwaggerModule.setup("docs", app, document);
}

/**
 * Emite o openapi.json em disco (usado no build/CI para gerar o cliente e
 * checar drift). Acionado por `node dist/main.js --emit-openapi`.
 */
export function emitOpenApi(app: INestApplication): void {
  const document = buildOpenApiDocument(app);
  const outPath = resolve(process.cwd(), "openapi.json");
  writeFileSync(outPath, JSON.stringify(document, null, 2));

  console.log(`[openapi] escrito em ${outPath}`);
}
