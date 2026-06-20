/**
 * Tipo Result — union discriminada para fluxos de domínio que preferem
 * retornar erro a lançá-lo (use-cases que querem mapear erro explicitamente).
 *
 * Convive com a taxonomia de `errors.ts`: o `E` default é `DomainError`.
 */
import type { DomainError } from "./errors.js";

export type Ok<T> = { readonly ok: true; readonly value: T };
export type Err<E> = { readonly ok: false; readonly error: E };
export type Result<T, E = DomainError> = Ok<T> | Err<E>;

export function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}

export function err<E>(error: E): Err<E> {
  return { ok: false, error };
}

export function isOk<T, E>(r: Result<T, E>): r is Ok<T> {
  return r.ok;
}

export function isErr<T, E>(r: Result<T, E>): r is Err<E> {
  return !r.ok;
}

/** Desempacota um Ok; lança o erro embutido se for Err. Útil no boundary HTTP. */
export function unwrap<T, E>(r: Result<T, E>): T {
  if (r.ok) return r.value;
  throw r.error;
}
