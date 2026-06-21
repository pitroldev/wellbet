import type { Metadata } from "next";
import type { JSX } from "react";

import { BetsTable } from "@/features/bets/BetsTable";

export const metadata: Metadata = {
  title: "Apostas — Charya",
};

/**
 * Apostas (Server Component). A listagem com filtro de status + paginação é um
 * Client Component (`BetsTable`, TanStack Table) sobre o SDK de @charya/contracts
 * (GET /bets/all, restrito a admin/reviewer).
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
      <BetsTable />
    </div>
  );
}
