"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
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
import { RotateCw } from "lucide-react";
import { reviewKeys, useReviewQueue } from "@/shared/api/review";
import { AGE_CLASS, relativeAge } from "@/shared/lib/relative-age";
import { Badge, Button, Input } from "@/shared/ui";
import { cn } from "@/lib/utils";

const KIND_LABEL: Record<ReviewQueueEntryDto["kind"], string> = {
  baseline: "Inicial (T0)",
  mid: "Meio (T1)",
  final: "Final (T2)",
};

const columns: ColumnDef<ReviewQueueEntryDto>[] = [
  {
    accessorKey: "userName",
    header: "Usuário",
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue<string | null>() ?? "—"}</span>
    ),
  },
  {
    accessorKey: "kind",
    header: "Captura",
    cell: ({ getValue }) => (
      <Badge>{KIND_LABEL[getValue<ReviewQueueEntryDto["kind"]>()]}</Badge>
    ),
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
    header: "Espera",
    cell: ({ getValue }) => {
      const iso = getValue<string>();
      const age = relativeAge(iso);
      return (
        <span className={AGE_CLASS[age.level]} title={new Date(iso).toLocaleString("pt-BR")}>
          {age.label}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    enableGlobalFilter: false,
    cell: () => (
      // A linha inteira navega; o botão é só reforço visual (aria-hidden p/ não duplicar).
      <span
        aria-hidden
        className="inline-flex h-8 items-center rounded-md border border-[var(--color-border)] px-3 text-xs font-medium"
      >
        Revisar →
      </span>
    ),
  },
];

/**
 * Tabela da fila de revisão (TanStack Table v8).
 * Linha inteira clicável, idade relativa por SLA, ordenação FIFO padrão,
 * contagem, auto-refresh e cabeçalhos acessíveis (aria-sort + teclado).
 */
export function QueueTable(): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, isFetching } = useReviewQueue();
  // FIFO por padrão: mais antigas (maior espera) primeiro.
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "capturedAt", desc: false }]);
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
    return (
      <p role="status" className="text-sm text-[var(--color-muted-foreground)]">
        Carregando fila…
      </p>
    );
  }
  if (isError) {
    return (
      <p role="alert" className="text-sm text-[var(--color-verdict-rejected)]">
        Falha ao carregar a fila de revisão.
      </p>
    );
  }

  const total = data?.length ?? 0;
  const filtered = table.getFilteredRowModel().rows.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Filtrar por usuário…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-xs"
          aria-label="Filtrar fila por usuário"
        />
        <p className="text-sm text-[var(--color-muted-foreground)]" aria-live="polite">
          <span className="font-semibold text-[var(--color-foreground)]">{filtered}</span>{" "}
          {filter ? `de ${String(total)} ` : ""}aguardando veredito
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={() => void queryClient.invalidateQueries({ queryKey: reviewKeys.queue() })}
          disabled={isFetching}
        >
          <RotateCw className={cn("size-4", isFetching && "animate-spin")} aria-hidden />
          {isFetching ? "Atualizando…" : "Atualizar"}
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-muted)]">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : canSort
                              ? "none"
                              : undefined
                      }
                      className="px-3 py-2 text-left font-medium"
                    >
                      {canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="inline-flex items-center gap-1 rounded hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <span aria-hidden>
                            {{ asc: "▲", desc: "▼" }[sorted as string] ?? "↕"}
                          </span>
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-10 text-center text-[var(--color-muted-foreground)]"
                >
                  {filter ? "Nenhum usuário corresponde ao filtro." : "Fila vazia — tudo revisado. 🎉"}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => {
                const href = `/review/${row.original.weighinId}`;
                return (
                  <tr
                    key={row.id}
                    role="link"
                    tabIndex={0}
                    onClick={() => router.push(href)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") router.push(href);
                    }}
                    className="cursor-pointer border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-muted)] focus-visible:bg-[var(--color-muted)] focus-visible:outline-none"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3 py-2.5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {table.getPageCount() > 1 ? (
        <div className="flex items-center justify-end gap-2">
          <span className="mr-auto text-xs text-[var(--color-muted-foreground)] tabular-nums">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
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
      ) : null}
    </div>
  );
}
