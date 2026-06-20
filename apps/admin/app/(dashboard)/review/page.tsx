import type { Metadata } from "next";
import type { JSX } from "react";
import { QueueTable } from "@/features/review";

export const metadata: Metadata = {
  title: "Fila de revisão — Charya",
};

/**
 * Fila de revisão (Server Component).
 *
 * A listagem é leitura → RSC. A tabela em si (`QueueTable`) é Client porque
 * sort/filter/paginação são interativos e os dados vêm de TanStack Query
 * (Arquitetura §4: RSC para leitura, Client onde há interação).
 */
export default function ReviewQueuePage(): JSX.Element {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold">Fila de revisão</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Revisão humana de 100% das pesagens — checklist item a item e veredito (MVP manual-first).
        </p>
      </header>
      <QueueTable />
    </div>
  );
}
