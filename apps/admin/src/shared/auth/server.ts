import "server-only";
import { cookies, headers } from "next/headers";
import { API_URL } from "@/shared/api/http";

/**
 * Leitura de sessão no servidor (RSC / layouts).
 *
 * Better Auth é servido pela API; aqui apenas repassamos os cookies da request
 * para o endpoint de sessão e tipamos o retorno. Quando o pacote de auth
 * compartilhado expuser um helper de server-side session, migrar para ele.
 */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface ServerSession {
  user: SessionUser;
  expiresAt: string;
}

export async function getServerSession(): Promise<ServerSession | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  // `headers()` reservado para futura propagação de tracing (OTel).
  await headers();

  try {
    const res = await fetch(`${API_URL}/api/auth/get-session`, {
      headers: { cookie: cookieHeader },
      // Sessão não deve ser cacheada entre requests.
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as ServerSession | null;
    return data && data.user ? data : null;
  } catch {
    // TODO: logar com Pino/OTel quando o logger do app estiver disponível.
    return null;
  }
}
