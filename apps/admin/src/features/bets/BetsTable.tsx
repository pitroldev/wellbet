"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { type AdminBetRowDto } from "@charya/contracts";
import { RotateCw } from "lucide-react";
import { useAllBets } from "@/features/bets/api/useAllBets";
import { relativeAge } from "@/shared/lib/relative-age";
import { Badge, Button, Select, Skeleton } from "@/shared/ui";
import { cn } from "@/lib/utils";

type BetStatus = AdminBetRowDto["status"];

const STATUS: Record<BetStatus, { label: string; variant?: "approved" | "pending" | "rejected" }> =
  {
    pending_payment: { label: "Aguardando pgto", variant: "pending" },
    open: { label: "Ativa", variant: "approved" },
    settling: { label: "Liquidando", variant: "pending" },
    won: { label: "Ganhou", variant: "approved" },
    lost: { label: "Perdeu", variant: "rejected" },
    voided: { label: "Cancelada" }, // terminal neutro → Badge default
  };

const STATUS_ORDER: BetStatus[] = ["pending_payment", "open", "settling", "won", "lost", "voided"];

// Colunas numéricas/monetárias → alinhadas à direita com tabular-nums.
const NUMERIC = new Set(["targetWeightKg", "stakeAmount", "payoutAmount"]);

function brl(amount: string, currency: string): string {
  const n = Number(amount);
  return Number.isFinite(n)
    ? n.toLocaleString("pt-BR", { style: "currency", currency })
    : `${currency} ${amount}`;
}

const columns: ColumnDef<AdminBetRowDto>[] = [
  {
    accessorKey: "userName",
    header: "Usuário",
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue<string | null>() ?? "—"}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const s = STATUS[getValue<BetStatus>()];
      return <Badge variant={s.variant}>{s.label}</Badge>;
    },
  },
  {
    accessorKey: "targetWeightKg",
    header: "Meta (kg)",
    cell: ({ getValue }) => getValue<number>().toFixed(1),
  },
  {
    accessorKey: "stakeAmount",
    header: "Stake",
    cell: ({ row }) => brl(row.original.stakeAmount, row.original.currency),
  },
  {
    accessorKey: "payoutAmount",
    header: "Payout",
    cell: ({ row }) =>
      row.original.payoutAmount == null
        ? "—"
        : brl(row.original.payoutAmount, row.original.currency),
  },
  {
    accessorKey: "createdAt",
    header: "Criada em",
    cell: ({ getValue }) => {
      const iso = getValue<string>();
      return (
        <span title={new Date(iso).toLocaleString("pt-BR")}>{relativeAge(iso).label}</span>
      );
    },
  },
];

export function BetsTable(): React.JSX.Element {
  const [status, setStatus] = React.useState<BetStatus | undefined>(undefined);
  // Mais recentes primeiro (triagem).
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "createdAt", desc: true }]);
  const { data, isLoading, isError, isFetching, refetch } = useAllBets(status);

  // TanStack Table devolve funções não-memoizáveis — incompatível com o React
  // Compiler por design; o compilador pula este componente (esperado).
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const total = data?.length ?? 0;
  const rows = table.getRowModel().rows;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={status ?? ""}
          onChange={(e) => setStatus((e.target.value || undefined) as BetStatus | undefined)}
          aria-label="Filtrar apostas por status"
          className="max-w-xs"
        >
          <option value="">Todos os status</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {STATUS[s].label}
            </option>
          ))}
        </Select>
        <p className="text-sm text-[var(--color-muted-foreground)]" aria-live="polite">
          <span className="font-semibold tabular-nums text-[var(--color-foreground)]">{total}</span>{" "}
          {status ? `${STATUS[status].label.toLowerCase()}` : "aposta(s)"}
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={() => void refetch()}
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
                  const numeric = NUMERIC.has(header.column.id);
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
                      className={cn("px-3 py-2 font-medium", numeric ? "text-right" : "text-left")}
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
            {isLoading ? (
              // Skeleton com a mesma estrutura → sem layout shift na carga.
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-t border-[var(--color-border)]" role="status">
                  {columns.map((_c, j) => (
                    <td key={j} className="px-3 py-2.5">
                      <Skeleton className="h-4 w-full max-w-[8rem]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : isError ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8">
                  <div
                    role="alert"
                    className="flex flex-col items-center gap-2 text-sm text-[var(--color-verdict-rejected)]"
                  >
                    Falha ao carregar as apostas.
                    <Button variant="outline" size="sm" onClick={() => void refetch()}>
                      Tentar novamente
                    </Button>
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-10 text-center text-[var(--color-muted-foreground)]"
                >
                  {status
                    ? `Nenhuma aposta com status "${STATUS[status].label}".`
                    : "Nenhuma aposta ainda."}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-[var(--color-border)]">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        "px-3 py-2.5",
                        NUMERIC.has(cell.column.id) && "text-right tabular-nums",
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {table.getPageCount() > 1 ? (
        <div className="flex items-center justify-end gap-2">
          <span className="mr-auto text-xs tabular-nums text-[var(--color-muted-foreground)]">
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
