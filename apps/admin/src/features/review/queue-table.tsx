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
import { useReviewQueue } from "@/shared/api/review";
import { Badge, Button, Input } from "@/shared/ui";
import type { ReviewQueueItem } from "./types";

function statusBadge(status: ReviewQueueItem["status"]): React.JSX.Element {
  switch (status) {
    case "APROVADO":
      return <Badge variant="approved">Aprovado</Badge>;
    case "PENDENTE":
      return <Badge variant="pending">Pendente</Badge>;
    case "REPROVADO":
      return <Badge variant="rejected">Reprovado</Badge>;
    default:
      return <Badge>Aguardando</Badge>;
  }
}

const columns: ColumnDef<ReviewQueueItem>[] = [
  {
    accessorKey: "userName",
    header: "Usuário",
  },
  {
    accessorKey: "capture",
    header: "Captura",
  },
  {
    accessorKey: "weightKg",
    header: "Peso (kg)",
    cell: ({ getValue }) => (getValue<number>() ?? 0).toFixed(1),
  },
  {
    accessorKey: "sanityPassed",
    header: "Sanidade",
    cell: ({ getValue }) =>
      getValue<boolean>() ? (
        <Badge variant="approved">OK</Badge>
      ) : (
        // Regra dura de sanidade falhou (§6) — bloqueio automático.
        <Badge variant="rejected">Bloqueado</Badge>
      ),
  },
  {
    accessorKey: "submittedAt",
    header: "Enviado em",
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString("pt-BR"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => statusBadge(getValue<ReviewQueueItem["status"]>()),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Button variant="outline" size="sm" render={<Link href={`/review/${row.original.id}`} />}>
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
