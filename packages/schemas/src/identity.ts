import { z } from "zod";
import { NonEmptyString, SessionId, Timestamp, Timestamps, UserId } from "./common.js";

/**
 * Identidade e autorização.
 *
 * No MVP a identidade do *apostador* é validada por revisão humana
 * (comparação visual dos 3 vídeos T0/T1/T2) — ver `review.ts`. Aqui modelamos
 * apenas a conta, a sessão e o papel (RBAC mínimo).
 */

/* -------------------------------------------------------------------------- */
/* Papéis                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Papéis do MVP:
 * - `user`     — apostador; cria apostas e envia pesagens.
 * - `reviewer` — opera o console de revisão (checklist + veredito).
 * - `admin`    — gestão da plataforma; superconjunto do reviewer.
 */
export const Role = z.enum(["user", "reviewer", "admin"]);
export type Role = z.infer<typeof Role>;

/** Papéis com acesso ao console de revisão (admin/console). */
export const STAFF_ROLES: readonly Role[] = ["reviewer", "admin"];

/** Indica se um papel pode operar a fila de revisão. */
export function isStaff(role: Role): boolean {
  return STAFF_ROLES.includes(role);
}

/* -------------------------------------------------------------------------- */
/* Usuário                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Perfil físico declarado no onboarding. Usado como contexto pela
 * plausibilidade e pelo revisor (não é prova de nada — é referência).
 */
export const BiologicalSex = z.enum(["male", "female", "unspecified"]);
export type BiologicalSex = z.infer<typeof BiologicalSex>;

export const UserProfile = z.object({
  displayName: NonEmptyString.max(80),
  sex: BiologicalSex.default("unspecified"),
  /** Altura em centímetros (opcional no MVP). */
  heightCm: z.int().min(100).max(250).optional(),
  /** Data de nascimento (ISO date, sem hora). */
  birthDate: z.iso.date().optional(),
});
export type UserProfile = z.infer<typeof UserProfile>;

export const User = z
  .object({
    id: UserId,
    email: z.email(),
    emailVerified: z.boolean().default(false),
    role: Role.default("user"),
    profile: UserProfile,
  })
  .extend(Timestamps.shape);
export type User = z.infer<typeof User>;

/** Visão pública/enxuta de um usuário (sem PII sensível além do nome). */
export const PublicUser = z.object({
  id: UserId,
  displayName: NonEmptyString,
  role: Role,
});
export type PublicUser = z.infer<typeof PublicUser>;

/* -------------------------------------------------------------------------- */
/* Sessão                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Sessão autenticada. O token em si é opaco e gerido pelo provedor de auth
 * (Better Auth) — aqui modelamos só os metadados que o app/console enxergam.
 */
export const Session = z.object({
  id: SessionId,
  userId: UserId,
  role: Role,
  issuedAt: Timestamp,
  expiresAt: Timestamp,
});
export type Session = z.infer<typeof Session>;

/**
 * Contexto do ator em uma requisição. Derivado da sessão e injetado nos
 * handlers; base das checagens de autorização.
 */
export const AuthContext = z.object({
  userId: UserId,
  role: Role,
  sessionId: SessionId,
});
export type AuthContext = z.infer<typeof AuthContext>;
