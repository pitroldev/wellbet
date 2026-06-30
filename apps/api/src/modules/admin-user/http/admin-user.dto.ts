import { createZodDto } from "nestjs-zod";
import { z } from "zod";

/**
 * DTOs da gestão de usuários (console de suporte/admin).
 *
 * Chaveado SEMPRE pelo `authUserId` (id do `user` do Better Auth) — a linha de
 * domínio (`users`: taxId/pixKey/bets/weighins) pode não existir antes do 1º /me.
 */
const role = z.enum(["user", "reviewer", "admin"]);
const betStatus = z.enum(["pending_payment", "open", "settling", "won", "lost", "voided"]);
const weighinStatus = z.enum([
  "pending",
  "blocked",
  "in_review",
  "approved",
  "rejected",
  "recapture",
]);
const verdict = z.enum(["approved", "pending", "rejected"]);

/* ----------------------------------- lista ---------------------------------- */

export const ListUsersQuerySchema = z.object({
  /** Busca poliglota: nome / e-mail / chave Pix / dígitos do CPF-CNPJ. */
  q: z.string().trim().max(200).optional(),
  role: role.optional(),
  emailVerified: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});
export class ListUsersQueryDto extends createZodDto(ListUsersQuerySchema) {}

export const AdminUserRowSchema = z.object({
  authUserId: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  role,
  emailVerified: z.boolean(),
  banned: z.boolean(),
  createdAt: z.iso.datetime(),
  domainUserId: z.string().nullable(),
  hasTaxId: z.boolean(),
  hasPixKey: z.boolean(),
  betsCount: z.number().int(),
  weighinsCount: z.number().int(),
});
export class AdminUserRowDto extends createZodDto(AdminUserRowSchema) {}

export const ListUsersResponseSchema = z.object({
  items: z.array(AdminUserRowSchema),
  total: z.number().int(),
});
export class ListUsersResponseDto extends createZodDto(ListUsersResponseSchema) {}

/* ---------------------------------- detalhe --------------------------------- */

const userBetSchema = z.object({
  betId: z.string(),
  status: betStatus,
  targetWeightKg: z.number(),
  stakeAmount: z.string(),
  payoutAmount: z.string().nullable(),
  currency: z.string(),
  payoutTransferId: z.string().nullable(),
  createdAt: z.iso.datetime(),
  settledAt: z.iso.datetime().nullable(),
});

const userWeighinSchema = z.object({
  id: z.string(),
  kind: z.enum(["baseline", "mid", "final"]),
  status: weighinStatus,
  weightKg: z.number(),
  lossPerWeekKg: z.number().nullable(),
  capturedAt: z.iso.datetime(),
  verdict: verdict.nullable(),
});

/** Sinais de triagem computados no servidor (decisão do suporte em segundos). */
const signalsSchema = z.object({
  newAccount: z.boolean(),
  rejectionsCount: z.number().int(),
  payoutPending: z.boolean(),
  noFinancialProfile: z.boolean(),
  emailUnverified: z.boolean(),
  orphan: z.boolean(),
});

/** Veredito único de payout ("cadê meu dinheiro?"). */
const payoutSchema = z.object({
  verdict: z.enum([
    "pago",
    "a_liquidar",
    "bloqueado_sem_pix",
    "bloqueado_pesagem_final",
    "sem_payout",
  ]),
  payoutTransferId: z.string().nullable(),
});

export const UserDetailSchema = z.object({
  identity: z.object({
    authUserId: z.string(),
    email: z.string(),
    name: z.string().nullable(),
    emailVerified: z.boolean(),
    role,
    image: z.string().nullable(),
    banned: z.boolean(),
    banReason: z.string().nullable(),
    bannedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  }),
  domain: z
    .object({
      userId: z.string(),
      name: z.string().nullable(),
      taxId: z.string().nullable(),
      pixKey: z.string().nullable(),
      createdAt: z.iso.datetime(),
    })
    .nullable(),
  signals: signalsSchema,
  payout: payoutSchema,
  bets: z.array(userBetSchema),
  weighins: z.array(userWeighinSchema),
});
export class UserDetailDto extends createZodDto(UserDetailSchema) {}

/* ----------------------------------- patch ---------------------------------- */

export const UpdateUserSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    role,
    emailVerified: z.boolean(),
    taxId: z.string().trim().max(32).nullable(),
    pixKey: z.string().trim().max(140).nullable(),
  })
  .partial();
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}

export const BanUserSchema = z.object({
  reason: z.string().trim().max(500).optional(),
});
export class BanUserDto extends createZodDto(BanUserSchema) {}

export const ResetPasswordResponseSchema = z.object({ sent: z.boolean() });
export class ResetPasswordResponseDto extends createZodDto(ResetPasswordResponseSchema) {}
