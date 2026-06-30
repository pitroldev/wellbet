"use client";

import * as React from "react";
import { RotateCw, Search } from "lucide-react";
import {
  Badge,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@/shared/ui";
import { useUsers, type AdminUserRow, type UserRole } from "@/shared/api/users";
import { relativeAge } from "@/shared/lib/relative-age";
import { cn } from "@/lib/utils";
import { Avatar, CopyButton, RoleBadge } from "./maps";
import { UserDrawer } from "./UserDrawer";

const ROLE_FILTER_ITEMS: Record<string, string> = {
  all: "Todos os papéis",
  user: "Usuário",
  reviewer: "Revisor",
  admin: "Admin",
};

const COLUMNS = ["Usuário", "Verificado", "Papel", "Pix", "Apostas", "Pesagens", "Cadastrado"];

export function UsersManager(): React.JSX.Element {
  const [input, setInput] = React.useState("");
  const [q, setQ] = React.useState("");
  const [role, setRole] = React.useState<UserRole | undefined>(undefined);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);

  // Debounce da busca (~300ms).
  React.useEffect(() => {
    const t = setTimeout(() => setQ(input), 300);
    return () => clearTimeout(t);
  }, [input]);

  // Deep-link: ?focus=<id> abre o drawer (link colável no ticket).
  React.useEffect(() => {
    const focus = new URLSearchParams(window.location.search).get("focus");
    if (focus) setSelectedId(focus);
  }, []);

  // Atalho "/" foca a busca.
  React.useEffect(() => {
    function onKey(e: KeyboardEvent): void {
      if (e.key !== "/" || e.ctrlKey || e.metaKey) return;
      const el = document.activeElement;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return;
      e.preventDefault();
      searchRef.current?.focus();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function openUser(id: string): void {
    setSelectedId(id);
    const url = new URL(window.location.href);
    url.searchParams.set("focus", id);
    window.history.replaceState(null, "", url);
  }
  function closeUser(): void {
    setSelectedId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("focus");
    window.history.replaceState(null, "", url);
  }

  const { data, isLoading, isError, isFetching, refetch } = useUsers({ q, role });
  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Busca + filtro + contagem */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-lg flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-muted-foreground)]"
            aria-hidden
          />
          <Input
            ref={searchRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            aria-label="Buscar usuários"
            placeholder="Buscar por nome, e-mail, CPF ou chave Pix…   ( / )"
            className="pl-9"
          />
        </div>
        <Select
          value={role ?? "all"}
          onValueChange={(v) => setRole(v === "all" ? undefined : (v as UserRole))}
          items={ROLE_FILTER_ITEMS}
        >
          <SelectTrigger className="w-44" aria-label="Filtrar por papel">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os papéis</SelectItem>
            <SelectItem value="user">Usuário</SelectItem>
            <SelectItem value="reviewer">Revisor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-[var(--color-muted-foreground)]" aria-live="polite">
          <span className="font-semibold tabular-nums text-[var(--color-foreground)]">{total}</span>{" "}
          conta{total === 1 ? "" : "s"}
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={() => void refetch()}
          disabled={isFetching}
          aria-label="Atualizar"
        >
          <RotateCw className={cn("size-4", isFetching && "animate-spin")} aria-hidden />
          Atualizar
        </Button>
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-md border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-muted)]">
            <tr>
              {COLUMNS.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={cn(
                    "px-3 py-2 font-medium",
                    i >= 4 && i <= 5 ? "text-right" : "text-left",
                  )}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-t border-[var(--color-border)]" role="status">
                  {COLUMNS.map((_c, j) => (
                    <td key={j} className="px-3 py-2.5">
                      <Skeleton className="h-4 w-full max-w-[7rem]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : isError ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-3 py-8">
                  <div role="alert" className="flex flex-col items-center gap-2 text-sm text-[var(--color-verdict-rejected)]">
                    Falha ao carregar os usuários.
                    <Button variant="outline" size="sm" onClick={() => void refetch()}>
                      Tentar novamente
                    </Button>
                  </div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-3 py-10 text-center text-[var(--color-muted-foreground)]">
                  {q
                    ? `Nenhuma conta para “${q}”. Confira o e-mail/CPF.`
                    : "Nenhuma conta cadastrada."}
                </td>
              </tr>
            ) : (
              items.map((u) => <UserRowItem key={u.authUserId} u={u} onOpen={() => openUser(u.authUserId)} />)
            )}
          </tbody>
        </table>
      </div>

      <UserDrawer authUserId={selectedId} onClose={closeUser} />
    </div>
  );
}

function UserRowItem({ u, onOpen }: { u: AdminUserRow; onOpen: () => void }): React.JSX.Element {
  return (
    <tr
      role="link"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="cursor-pointer border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-muted)] focus-visible:bg-[var(--color-muted)] focus-visible:outline-none"
    >
      <td className="px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar label={u.name || u.email} className="size-8" />
          <div className="flex min-w-0 flex-col">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="truncate">{u.name ?? "—"}</span>
              {u.banned ? (
                <Badge variant="rejected" className="shrink-0">
                  Banido
                </Badge>
              ) : null}
            </span>
            <span className="inline-flex items-center gap-1 truncate font-mono text-xs text-[var(--color-muted-foreground)]">
              {u.email}
              <CopyButton value={u.email} label="E-mail" />
            </span>
          </div>
        </div>
      </td>
      <td className="px-3 py-2.5">
        {u.emailVerified ? (
          <span className="text-xs text-[var(--color-verdict-approved)]">Verificado</span>
        ) : (
          <Badge variant="pending">não verif.</Badge>
        )}
      </td>
      <td className="px-3 py-2.5">{u.role !== "user" ? <RoleBadge role={u.role} /> : null}</td>
      <td className="px-3 py-2.5">
        {u.hasPixKey ? (
          <span className="text-xs text-[var(--color-foreground)]">tem chave</span>
        ) : (
          <span className="text-xs text-[var(--color-muted-foreground)]">sem chave</span>
        )}
      </td>
      <td className="px-3 py-2.5 text-right tabular-nums">{u.betsCount || "—"}</td>
      <td className="px-3 py-2.5 text-right tabular-nums">{u.weighinsCount || "—"}</td>
      <td className="px-3 py-2.5 text-xs text-[var(--color-muted-foreground)]" title={new Date(u.createdAt).toLocaleString("pt-BR")}>
        {relativeAge(u.createdAt).label}
      </td>
    </tr>
  );
}
