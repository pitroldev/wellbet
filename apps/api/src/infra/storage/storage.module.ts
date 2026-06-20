import { Global, Module } from "@nestjs/common";

import { R2StorageAdapter } from "./r2-storage.adapter.js";
import { STORAGE } from "./storage.port.js";

/**
 * Módulo de storage (infra). Liga o `STORAGE` port ao adapter R2.
 * @Global para os módulos de feature injetarem `STORAGE` sem reimportar.
 */
@Global()
@Module({
  providers: [
    {
      provide: STORAGE,
      useClass: R2StorageAdapter,
    },
  ],
  exports: [STORAGE],
})
export class StorageModule {}
