import { trace } from "@opentelemetry/api";
import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { ZodError } from "zod";

import { type DomainError, type ErrorCategory, ErrorCode } from "./errors.js";

/** Resposta de erro padronizada (contrato com o cliente). */
export interface ErrorResponseBody {
  // `ErrorCode` é uma união de literais string; o campo aceita também códigos
  // crus (ex.: derivados de status HTTP), então o tipo efetivo é `string`.
  code: string;
  message: string;
  details?: unknown;
  /** Correlação: traceId ativo (preenchido quando OTel está ligado). */
  traceId?: string;
}

const CATEGORY_TO_STATUS: Record<ErrorCategory, HttpStatus> = {
  validation: HttpStatus.BAD_REQUEST,
  not_found: HttpStatus.NOT_FOUND,
  unauthorized: HttpStatus.UNAUTHORIZED,
  forbidden: HttpStatus.FORBIDDEN,
  conflict: HttpStatus.CONFLICT,
  unprocessable: HttpStatus.UNPROCESSABLE_ENTITY,
  internal: HttpStatus.INTERNAL_SERVER_ERROR,
};

/** Status HTTP (de `HttpException`) → code estável do contrato de erro. */
const STATUS_TO_CODE: Record<number, ErrorCode> = {
  [HttpStatus.BAD_REQUEST]: ErrorCode.VALIDATION_FAILED,
  [HttpStatus.UNAUTHORIZED]: ErrorCode.UNAUTHORIZED,
  [HttpStatus.FORBIDDEN]: ErrorCode.FORBIDDEN,
  [HttpStatus.NOT_FOUND]: ErrorCode.NOT_FOUND,
  [HttpStatus.CONFLICT]: ErrorCode.CONFLICT,
};

/**
 * Filtro global de exceções.
 *
 * Traduz QUALQUER erro para o shape `{ code, message, details }`:
 *  - `DomainError`        → status pela categoria + code/message/details do erro
 *  - `ZodError`           → 400 VALIDATION_FAILED + issues (defesa extra; o
 *                           ZodValidationPipe do nestjs-zod já cobre o request)
 *  - `HttpException`      → status nativo + code derivado
 *  - desconhecido         → 500 INTERNAL (mensagem genérica, sem vazar stack)
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const { status, body } = this.toResponse(exception);

    // Correlação com tracing, se disponível.
    const traceId = this.activeTraceId();
    if (traceId) body.traceId = traceId;

    if (status >= 500) {
      this.logger.error(
        { err: exception, path: req.url, code: body.code },
        `Erro não tratado: ${body.message}`,
      );
    } else {
      this.logger.warn({ path: req.url, code: body.code }, body.message);
    }

    res.status(status).json(body);
  }

  private toResponse(exception: unknown): { status: number; body: ErrorResponseBody } {
    if (this.isDomainError(exception)) {
      return {
        status: CATEGORY_TO_STATUS[exception.category],
        body: {
          code: exception.code,
          message: exception.message,
          ...(exception.details ? { details: exception.details } : {}),
        },
      };
    }

    if (exception instanceof ZodError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        body: {
          code: ErrorCode.VALIDATION_FAILED,
          message: "Validação do payload falhou.",
          details: exception.issues,
        },
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const raw = exception.getResponse();
      const message =
        typeof raw === "string"
          ? raw
          : ((raw as { message?: string | string[] }).message ?? exception.message);
      return {
        status,
        body: {
          code: this.statusToCode(status),
          message: Array.isArray(message) ? message.join("; ") : message,
          ...(typeof raw === "object" ? { details: raw } : {}),
        },
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: {
        code: ErrorCode.INTERNAL,
        message: "Erro interno inesperado.",
      },
    };
  }

  private isDomainError(e: unknown): e is DomainError {
    return (
      typeof e === "object" && e !== null && "category" in e && "code" in e && e instanceof Error
    );
  }

  private statusToCode(status: number): ErrorCode {
    // Lookup por código HTTP (number). Usar um mapa em vez de `switch` evita
    // comparar um `number` cru contra membros do enum `HttpStatus`
    // (no-unsafe-enum-comparison) sem precisar de cast.
    return STATUS_TO_CODE[status] ?? ErrorCode.INTERNAL;
  }

  private activeTraceId(): string | undefined {
    // `@opentelemetry/api` é no-op quando o SDK não está iniciado.
    return trace.getActiveSpan()?.spanContext().traceId;
  }
}
