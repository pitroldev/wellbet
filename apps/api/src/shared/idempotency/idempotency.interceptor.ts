import { createHash } from "node:crypto";

import {
  type CallHandler,
  type ExecutionContext,
  Inject,
  Injectable,
  type NestInterceptor,
  SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import { type Observable, of } from "rxjs";
import { tap } from "rxjs/operators";

import { ConflictError, ErrorCode, ValidationError } from "../errors.js";
import { IDEMPOTENCY_STORE, type IdempotencyStorePort } from "./idempotency.port.js";

export const IDEMPOTENT_KEY = "charya:idempotent";

/**
 * Marca um handler como idempotente (escrita financeira/settlement).
 * O cliente deve enviar o header `Idempotency-Key`.
 */
export const Idempotent = () => SetMetadata(IDEMPOTENT_KEY, true);

const HEADER = "idempotency-key";

/**
 * Interceptor de idempotência.
 *
 * Em handlers marcados com `@Idempotent()`:
 *  1. Lê `Idempotency-Key` do header (obrigatório).
 *  2. Se já existe registro p/ a chave:
 *       - mesmo payload  → REPLAY da resposta original (não re-executa).
 *       - payload difere → 409 IDEMPOTENCY_KEY_REUSED.
 *  3. Caso novo → executa o handler e persiste {key, hash, resposta}.
 *
 * Garante exactly-once de efeito em settlement/apostas (§2 do doc).
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @Inject(IDEMPOTENCY_STORE)
    private readonly store: IdempotencyStorePort,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const isIdempotent = this.reflector.getAllAndOverride<boolean | undefined>(IDEMPOTENT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isIdempotent) return next.handle();

    const req = context.switchToHttp().getRequest<Request>();
    const key = req.header(HEADER);
    if (!key) {
      throw new ValidationError(`Header ${HEADER} é obrigatório para esta operação.`);
    }

    const requestHash = this.hashBody(req.body);
    const existing = await this.store.find(key);

    if (existing) {
      if (existing.requestHash !== requestHash) {
        throw new ConflictError(
          ErrorCode.IDEMPOTENCY_KEY_REUSED,
          "Idempotency-Key reutilizada com payload diferente.",
        );
      }
      // Replay determinístico da resposta original.
      return of(existing.responseBody);
    }

    return next.handle().pipe(
      tap((responseBody: unknown) => {
        void this.store.save({
          key,
          requestHash,
          responseBody,
          // O status real é resolvido pelo Nest; 200/201 cobre os casos de escrita.
          statusCode: 200,
          createdAt: new Date(),
        });
      }),
    );
  }

  private hashBody(body: unknown): string {
    const json = JSON.stringify(body ?? {});
    return createHash("sha256").update(json).digest("hex");
  }
}
