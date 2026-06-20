import type { Metadata } from "next";
import type { JSX } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

export const metadata: Metadata = {
  title: "Apostas — Charya",
};

/**
 * Apostas (Server Component). Leitura → RSC. A listagem com filtros/paginação
 * interativos será extraída para um Client Component (TanStack Table) quando o
 * endpoint de apostas estiver disponível em @charya/contracts.
 */
export default function BetsPage(): JSX.Element {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold">Apostas</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Apostas e settlement vinculados às pesagens aprovadas.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Em construção</CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: tabela de apostas (TanStack Table) + filtros por estado de
              settlement, consumindo hooks de TanStack Query sobre
              @charya/contracts. */}
          <p className="text-sm text-[var(--color-muted-foreground)]">
            A listagem de apostas será conectada ao endpoint de apostas da API.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
