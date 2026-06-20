"use client";

import { createAuthClient } from "better-auth/react";
import { env } from "@/shared/env";

/**
 * Cliente Better Auth do admin.
 *
 * A sessão é compartilhada com a API (NestJS) — mesmo emissor, mesmo segredo —
 * conforme Arquitetura §4. `baseURL` aponta para a origem do serviço de auth.
 *
 * Pinado em better-auth >= 1.6.14 (lote de 15 advisories SSO/OIDC de jun/2026).
 */
export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_AUTH_URL,
});

export const { signIn, signOut, signUp, useSession, getSession } = authClient;

export type Session = typeof authClient.$Infer.Session;
