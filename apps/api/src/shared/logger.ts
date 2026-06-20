/**
 * Re-exports do logger Pino para uso fora do ciclo de request.
 *
 * Dentro de controllers/services, injete `PinoLogger`/`Logger` do nestjs-pino
 * (logger por request, já correlacionado ao traceId). Este arquivo cobre o
 * caso de logging em código que roda fora de uma request (workers/jobs).
 */
export { Logger as PinoLogger } from "nestjs-pino";
export { InjectPinoLogger } from "nestjs-pino";

import pino, { type Logger } from "pino";

/** Logger raiz para contextos sem request (ex.: handlers de fila pg-boss). */
export function createRootLogger(level = process.env.LOG_LEVEL ?? "info"): Logger {
  return pino({
    level,
    // Em produção o transport OTLP é configurado no ObservabilityModule;
    // aqui mantemos JSON puro para não duplicar destinos.
    formatters: {
      level: (label) => ({ level: label }),
    },
  });
}
