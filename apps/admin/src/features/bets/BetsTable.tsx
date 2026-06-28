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
import { useAllBets } from "@/features/bets/api/useAllBets";
import { Badge, Button } from "@/shared/ui";

type BetStatus = AdminBetRowDto["status"];

const STATUS: Record<BetStatus, { label: string; variant?: "approved" | "pending" | "rejected" }> =
  {
    pending_payment: { label: "Aguardando pgto", variant: "pending" },
    open: { label: "Ativa", variant: "approved" },
    settling: { label: "Liquidando", variant: "pending" },
    won: { label: "Ganhou", variant: "approved" },
    lost: { label: "Perdeu", variant: "rejected" },
    voided: { label: "Cancelada" },
  };

const STATUS_ORDER: BetStatus[] = ["pending_payment", "open", "settling", "won", "lost", "voided"];

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
    cell: ({ getValue }) => getValue<string | null>() ?? "—",
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
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString("pt-BR"),
  },
];

export function BetsTable(): React.JSX.Element {
  const [status, setStatus] = React.useState<BetStatus | undefined>(undefined);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { data, isLoading, isError } = useAllBets(status);

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

  return (
    <div className="flex flex-col gap-3">
      <select
        value={status ?? ""}
        onChange={(e) => setStatus((e.target.value || undefined) as BetStatus | undefined)}
        className="max-w-xs rounded-md border border-[var(--color-border)] bg-transparent px-3 py-1.5 text-sm"
      >
        <option value="">Todos os status</option>
        {STATUS_ORDER.map((s) => (
          <option key={s} value={s}>
            {STATUS[s].label}
          </option>
        ))}
      </select>

      {isError ? (
        <p className="text-sm text-[var(--color-verdict-rejected)]">
          Falha ao carregar as apostas.
        </p>
      ) : isLoading ? (
        <p className="text-sm text-[var(--color-muted-foreground)]">Carregando apostas…</p>
      ) : (
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
                    Nenhuma aposta.
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
      )}

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
