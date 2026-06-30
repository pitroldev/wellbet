/**
 * Cliente de auth (Better Auth via BEARER). Fala direto com `/api/auth/*` e guarda
 * o token de sessão no SecureStore (`tokenStore`) — daí o `authenticatedFetch`
 * autentica TODAS as requests do contrato automaticamente. Sem deps extras.
 *
 * Requer o plugin `bearer` habilitado no servidor (devolve o token no header
 * `set-auth-token`; também aceito o `token` do corpo como fallback).
 */
import { env } from "@/shared/lib/env";
import { tokenStore } from "@/shared/lib/secure-store";

const ROOT = env.EXPO_PUBLIC_API_URL.replace(/\/+$/, "");
const AUTH_BASE = ROOT.endsWith("/api") ? `${ROOT}/auth` : `${ROOT}/api/auth`;

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

export class AuthError extends Error {
  readonly status: number;
  readonly code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "AuthError";
    this.status = status;
    this.code = code;
  }
}

async function authPost(path: string, body: unknown, withToken = false): Promise<Response> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (withToken) {
    const token = await tokenStore.getAccessToken();
    if (token != null) headers.Authorization = `Bearer ${token}`;
  }
  return fetch(`${AUTH_BASE}${path}`, { method: "POST", headers, body: JSON.stringify(body) });
}

async function parseBody(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function asError(status: number, data: unknown): AuthError {
  const e = (data ?? {}) as { code?: string; message?: string; error?: { code?: string; message?: string } };
  const message = e.message ?? e.error?.message ?? "auth_failed";
  const code = e.code ?? e.error?.code;
  return new AuthError(message, status, code);
}

/** Guarda o token de sessão vindo do header (bearer) ou do corpo. */
async function persistToken(res: Response, data: unknown): Promise<void> {
  const headerToken = res.headers.get("set-auth-token");
  const bodyToken = (data as { token?: string } | null)?.token;
  const token = headerToken ?? bodyToken ?? null;
  if (token != null && token.length > 0) await tokenStore.save({ accessToken: token });
}

function toUser(data: unknown): AuthUser {
  const u = ((data as { user?: Record<string, unknown> } | null)?.user ??
    data ??
    {}) as Record<string, unknown>;
  return {
    id: String(u.id ?? ""),
    email: String(u.email ?? ""),
    name: (u.name as string | undefined) ?? null,
  };
}

export async function signUp(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthUser> {
  const res = await authPost("/sign-up/email", input);
  const data = await parseBody(res);
  if (!res.ok) throw asError(res.status, data);
  await persistToken(res, data);
  return toUser(data);
}

export async function signIn(input: { email: string; password: string }): Promise<AuthUser> {
  const res = await authPost("/sign-in/email", input);
  const data = await parseBody(res);
  if (!res.ok) throw asError(res.status, data);
  await persistToken(res, data);
  return toUser(data);
}

export async function signOut(): Promise<void> {
  try {
    await authPost("/sign-out", {}, true);
  } catch {
    // ignora erro de rede — limpamos a sessão local de qualquer forma
  } finally {
    await tokenStore.clear();
  }
}

export async function forgotPassword(email: string): Promise<void> {
  const res = await authPost("/forget-password", { email, redirectTo: "charya://reset-password" });
  if (!res.ok) throw asError(res.status, await parseBody(res));
}

export async function resetPassword(input: { token: string; newPassword: string }): Promise<void> {
  const res = await authPost("/reset-password", input);
  if (!res.ok) throw asError(res.status, await parseBody(res));
}

export async function hasStoredSession(): Promise<boolean> {
  return (await tokenStore.getAccessToken()) != null;
}
