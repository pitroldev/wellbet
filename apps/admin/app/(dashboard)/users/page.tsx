import type { Metadata } from "next";
import type { JSX } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

export const metadata: Metadata = {
  title: "Usuários — Charya",
};

/**
 * Usuários (Server Component). Leitura → RSC. A listagem interativa
 * (TanStack Table) será extraída para Client quando o endpoint de identidade
 * estiver disponível em @charya/contracts.
 */
export default function UsersPage(): JSX.Element {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold">Usuários</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Usuários e histórico de pesagens (T0/T1/T2) por pessoa.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Em construção</CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: tabela de usuários + drill-down para o histórico das 3
              capturas, usado também na comparação de identidade. */}
          <p className="text-sm text-[var(--color-muted-foreground)]">
            A listagem de usuários será conectada ao endpoint de identidade da API.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
