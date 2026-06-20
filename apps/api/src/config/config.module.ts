import { Global, Module } from "@nestjs/common";

import { ENV, env, type Env } from "./env.js";

/**
 * Módulo global de configuração.
 *
 * Expõe a env tipada (validada por @charya/env) via DI sob o token `ENV`.
 * É @Global para qualquer módulo injetar `@Inject(ENV) env: Env` sem reimportar.
 */
@Global()
@Module({
  providers: [
    {
      provide: ENV,
      useValue: env,
    },
  ],
  exports: [ENV],
})
export class ConfigModule {}

export type { Env };
export { ENV };
