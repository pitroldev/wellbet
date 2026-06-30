import type { Metadata } from "next";
import type { JSX } from "react";

import { UsersManager } from "@/features/users/UsersManager";

export const metadata: Metadata = {
  title: "Usuários — Charya",
};

/**
 * Gestão de usuários (Server Component). O grosso (busca + tabela + drawer 360)
 * é um Client Component (`UsersManager`) sobre o SDK admin de @charya/contracts.
 * Ferramenta do SUPORTE: achar a conta e resolver o ticket num só lugar.
 */
export default function UsersPage(): JSX.Element {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold">Usuários</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Busque uma conta e resolva o ticket — reset de senha, verificação, dados e diagnóstico de
          payout num só lugar.
        </p>
      </header>
      <UsersManager />
    </div>
  );
}
