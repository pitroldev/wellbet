import { trace } from "@opentelemetry/api";
import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";

import { env } from "../config/env.js";

/**
 * Módulo de observabilidade.
 *
 * O OTel SDK em si é iniciado por side-effect em `main.ts` (antes do Nest).
 * Aqui configuramos o logging estruturado (Pino) correlacionado ao traceId.
 *
 * `nestjs-pino` instala um middleware de pino-http que cria um logger por
 * request; combinado com a auto-instrumentation do OTel, cada log carrega o
 * `trace_id`/`span_id` ativo, fechando o loop logs↔traces.
 */
@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: env.LOG_LEVEL ?? "info",
        // Em produção, transporte para OTLP; em dev, pretty no terminal.
        transport:
          env.NODE_ENV === "production"
            ? {
                target: "pino-opentelemetry-transport",
              }
            : {
                target: "pino-pretty",
                options: { singleLine: true, colorize: true },
              },
        // Correlação trace↔log: injeta trace_id/span_id do contexto ativo.
        // pino-opentelemetry-transport também faz isso no destino, mas
        // expor no log local ajuda no dev.
        mixin() {
          // Correlação trace↔log: injeta trace_id/span_id do contexto ativo.
          // `@opentelemetry/api` é no-op quando o SDK não está iniciado.
          const span = trace.getActiveSpan();
          if (!span) return {};
          const ctx = span.spanContext();
          return { trace_id: ctx.traceId, span_id: ctx.spanId };
        },
        // Redação de campos sensíveis nos logs.
        redact: {
          paths: ["req.headers.authorization", "req.headers.cookie", 'res.headers["set-cookie"]'],
          remove: true,
        },
        autoLogging: true,
      },
    }),
  ],
  exports: [LoggerModule],
})
export class ObservabilityModule {}
