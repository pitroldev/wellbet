/**
 * Inicialização do OpenTelemetry SDK (Node).
 *
 * IMPORTANTE: este módulo é importado por SIDE-EFFECT no TOPO de `main.ts`,
 * ANTES de qualquer outro import da aplicação. As auto-instrumentations
 * precisam fazo patch dos módulos (http, pg, express) antes deles serem
 * carregados — por isso a ordem importa.
 *
 * Tracing vendor-neutro via OTLP (http/protobuf). Os spans são correlacionados
 * aos logs Pino através do contexto de trace ativo (ver `logger.ts`).
 */
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { NodeSDK } from "@opentelemetry/sdk-node";

let sdk: NodeSDK | undefined;

/**
 * Inicia o SDK do OTel. Idempotente: chamadas subsequentes são no-op.
 * Lê configuração direto de `process.env` (não de @charya/env) porque roda
 * ANTES do bootstrap do Nest, onde a env validada ainda não está disponível.
 */
export function startOtel(): void {
  if (sdk) return;
  // Gate alinhado ao schema @charya/env: OTEL_ENABLED ausente (ou diferente de
  // "true"/"1") é tratado como DESABILITADO — o default do schema é "false".
  // Evita divergência entre este gate (process.env cru, pré-boot) e o serverEnv.
  if (process.env.OTEL_ENABLED !== "true" && process.env.OTEL_ENABLED !== "1") return;

  // Endpoint base do collector (mesmo nome do schema @charya/env e do
  // .env.example): OTEL_EXPORTER_OTLP_ENDPOINT (ex.: http://localhost:4318).
  // Derivamos o caminho específico de traces anexando `/v1/traces` — sem
  // variável órfã separada para o endpoint de traces.
  const otlpBase = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  const traceExporter = new OTLPTraceExporter({
    url: otlpBase ? `${otlpBase.replace(/\/+$/, "")}/v1/traces` : undefined,
  });

  sdk = new NodeSDK({
    serviceName: process.env.OTEL_SERVICE_NAME ?? "charya-api",
    traceExporter,
    instrumentations: [
      getNodeAutoInstrumentations({
        // Ruído alto, baixo valor — desligado por padrão.
        "@opentelemetry/instrumentation-fs": { enabled: false },
      }),
    ],
  });

  sdk.start();

  // Flush limpo dos spans no shutdown.
  const shutdown = (): void => {
    void sdk
      ?.shutdown()
      .catch((err: unknown) => {
        console.error("[otel] erro no shutdown", err);
      })
      .finally(() => process.exit(0));
  };
  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
}

/** Para o SDK explicitamente (usado em testes/teardown). */
export async function stopOtel(): Promise<void> {
  await sdk?.shutdown();
  sdk = undefined;
}
