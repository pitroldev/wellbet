"use client";

import * as React from "react";
import Link from "next/link";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { type ReviewQueueEntryDto } from "@charya/contracts";
import { useReviewQueue } from "@/shared/api/review";
import { Button, Input } from "@/shared/ui";

const KIND_LABEL: Record<ReviewQueueEntryDto["kind"], string> = {
  baseline: "Inicial (T0)",
  mid: "Meio (T1)",
  final: "Final (T2)",
};

const columns: ColumnDef<ReviewQueueEntryDto>[] = [
  {
    accessorKey: "userName",
    header: "Usuário",
    cell: ({ getValue }) => getValue<string | null>() ?? "—",
  },
  {
    accessorKey: "kind",
    header: "Captura",
    cell: ({ getValue }) => KIND_LABEL[getValue<ReviewQueueEntryDto["kind"]>()],
  },
  {
    accessorKey: "weightKg",
    header: "Peso (kg)",
    cell: ({ getValue }) => getValue<number>().toFixed(1),
  },
  {
    accessorKey: "lossPerWeekKg",
    header: "Perda/sem (kg)",
    cell: ({ getValue }) => {
      const v = getValue<number | null>();
      return v == null ? "—" : v.toFixed(2);
    },
  },
  {
    accessorKey: "capturedAt",
    header: "Capturado em",
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString("pt-BR"),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Button
        variant="outline"
        size="sm"
        render={<Link href={`/review/${row.original.weighinId}`} />}
      >
        Revisar
      </Button>
    ),
  },
];

/**
 * Tabela da fila de revisão (TanStack Table v8).
 * Client Component: sort/filter/paginação são interativos e os dados vêm das
 * hooks de TanStack Query.
 */
export function QueueTable(): React.JSX.Element {
  const { data, isLoading, isError } = useReviewQueue();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filter, setFilter] = React.useState("");

  // TanStack Table devolve funções não-memoizáveis — incompatível com o React
  // Compiler por design; o compilador pula este componente (esperado).
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data ?? [],
    columns,
    state: { sorting, globalFilter: filter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return <p className="text-sm text-[var(--color-muted-foreground)]">Carregando fila…</p>;
  }
  if (isError) {
    return (
      <p className="text-sm text-[var(--color-verdict-rejected)]">
        Falha ao carregar a fila de revisão.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="Filtrar por usuário…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="max-w-xs"
      />
      <div className="overflow-hidden rounded-md border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-muted)]">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="cursor-pointer px-3 py-2 text-left font-medium"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{ asc: " ▲", desc: " ▼" }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-8 text-center text-[var(--color-muted-foreground)]"
                >
                  Nenhuma pesagem na fila.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t border-[var(--color-border)]">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
