"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronsLeft,
  ChevronsRight,
  ClipboardCheck,
  Coins,
  ListChecks,
  LogOut,
} from "lucide-react";
import { signOut } from "@/shared/auth/client";
import { ThemeToggle } from "@/shared/theme";
import { Button } from "@/shared/ui";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/review", label: "Fila de revisão", icon: ClipboardCheck },
  { href: "/bets", label: "Apostas", icon: Coins },
  { href: "/criteria", label: "Critérios", icon: ListChecks },
] as const;

const STORAGE_KEY = "charya-sidebar-collapsed";

/**
 * Navegação lateral COLAPSÁVEL. Desktop: coluna vertical que alterna entre
 * larga (rótulos) e estreita (ícones) — libera largura para a tela de revisão,
 * o que (com as container queries do conteúdo) faz o split vídeo|lista caber
 * melhor. Mobile: vira uma barra horizontal compacta (só ícones).
 */
export function Sidebar({ userLabel }: { userLabel: string }): React.JSX.Element {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);

  React.useEffect(() => {
    setCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  function toggle(): void {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }

  async function onSignOut(): Promise<void> {
    setSigningOut(true);
    await signOut();
    window.location.href = "/login";
  }

  return (
    <aside
      className={cn(
        "flex items-center gap-1 border-b border-[var(--color-border)] bg-[var(--color-card)] p-2",
        "md:h-full md:flex-col md:items-stretch md:gap-0 md:border-b-0 md:border-r md:p-0",
        "md:transition-[width] md:duration-150",
        collapsed ? "md:w-16" : "md:w-56",
      )}
    >
      <div className="flex items-center justify-between gap-2 px-1 md:border-b md:border-[var(--color-border)] md:p-4">
        <p className={cn("truncate text-sm font-semibold", collapsed && "md:hidden")}>
          Charya<span className="hidden sm:inline"> · Revisão</span>
        </p>
        <button
          type="button"
          onClick={toggle}
          className="hidden rounded p-1.5 text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] md:inline-flex"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? (
            <ChevronsRight className="size-4" aria-hidden />
          ) : (
            <ChevronsLeft className="size-4" aria-hidden />
          )}
        </button>
      </div>

      {!collapsed ? (
        <p className="hidden truncate px-4 pb-2 text-xs text-[var(--color-muted-foreground)] md:block">
          {userLabel}
        </p>
      ) : null}

      <nav className="flex flex-1 flex-row items-center gap-1 overflow-x-auto md:flex-col md:items-stretch md:overflow-visible md:p-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              aria-label={label}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--color-muted)] text-[var(--color-foreground)]"
                  : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]",
                collapsed && "md:justify-center md:px-2",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              <span className={cn("max-md:hidden", collapsed && "md:hidden")}>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-1 md:flex-col md:items-stretch md:gap-1 md:border-t md:border-[var(--color-border)] md:p-2">
        <ThemeToggle collapsed={collapsed} />
        <Button
          variant="ghost"
          size="sm"
          onClick={onSignOut}
          disabled={signingOut}
          title="Sair"
          aria-label="Sair"
          className={cn("justify-start", collapsed && "md:justify-center md:px-2")}
        >
          <LogOut className="size-4" aria-hidden />
          <span className={cn("max-md:hidden", collapsed && "md:hidden")}>
            {signingOut ? "Saindo…" : "Sair"}
          </span>
        </Button>
      </div>
    </aside>
  );
}
