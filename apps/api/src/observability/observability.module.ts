import { trace } from "@opentelemetry/api";
import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";

import { env } from "@/config/env.js";

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
        // Redação de PII/segredos nos logs (pino redact).
        //
        // `remove: true` apaga o campo do log (não deixa nem o marcador
        // `[Redacted]`). Cobrimos:
        //  - headers de credencial (authorization, cookie) e set-cookie da resp;
        //  - segredos comuns em qualquer profundidade (password/token/secret)
        //    via wildcards `*.x` e `*.*.x` (pino só faz match em um nível por
        //    `*`, então listamos os dois níveis mais usados: body/headers e
        //    objetos aninhados);
        //  - apiKey/authorization soltos em payloads.
        redact: {
          paths: [
            // Credenciais em headers (req e res).
            "req.headers.authorization",
            "req.headers.cookie",
            'res.headers["set-cookie"]',
            "set-cookie",
            // Segredos em qualquer corpo/objeto logado (1 e 2 níveis).
            "*.password",
            "*.*.password",
            "*.token",
            "*.*.token",
            "*.accessToken",
            "*.*.accessToken",
            "*.refreshToken",
            "*.*.refreshToken",
            "*.secret",
            "*.*.secret",
            "*.apiKey",
            "*.*.apiKey",
            "*.authorization",
            "*.*.authorization",
          ],
          remove: true,
        },
        // Não logamos corpo de requisição por padrão (evita vazar
        // credenciais/PII no boot de /api/auth/*). `autoLogging` registra apenas
        // a linha req/res (método, rota, status), não o body. Mantemos `false`
        // o log automático nas rotas de auth para reduzir ainda mais a
        // superfície de PII.
        autoLogging: {
          ignore: (req) => (req.url ?? "").startsWith("/api/auth"),
        },
      },
    }),
  ],
  exports: [LoggerModule],
})
export class ObservabilityModule {}
