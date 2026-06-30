"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronsLeft,
  ChevronsRight,
  ClipboardCheck,
  Coins,
  Home,
  ListChecks,
  LogOut,
  ScanFace,
  UserCog,
} from "lucide-react";
import { signOut } from "@/shared/auth/client";
import { ThemeToggle } from "@/shared/theme";
import { deriveInitials } from "@/shared/lib/initials";
import { Button } from "@/shared/ui";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Início", icon: Home },
  { href: "/review", label: "Fila de revisão", icon: ClipboardCheck },
  { href: "/bets", label: "Apostas", icon: Coins },
  { href: "/users", label: "Usuários", icon: UserCog },
  { href: "/criteria", label: "Critérios", icon: ListChecks },
] as const;

const STORAGE_KEY = "charya-sidebar-collapsed";

/**
 * Navegação lateral COLAPSÁVEL. Desktop: coluna vertical que alterna entre
 * larga (rótulos) e estreita (ícones) — libera largura para a tela de revisão,
 * o que (com as container queries do conteúdo) faz o split vídeo|lista caber
 * melhor. Mobile: vira uma barra horizontal compacta (só ícones, scroll-x).
 *
 * Visual monocromático-premium: logo-mark + wordmark no topo, itens com pill
 * ativo SÓLIDO (bg-primary), perfil com avatar de iniciais no rodapé. Sem cor
 * cromática — só os tokens neutros do tema (primary = preto-no-claro /
 * branco-no-escuro).
 */
export function Sidebar({ userLabel }: { userLabel: string }): React.JSX.Element {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);
  const initials = React.useMemo(() => deriveInitials(userLabel), [userLabel]);

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
        "flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-card)] px-2 py-2",
        "md:h-full md:flex-col md:items-stretch md:gap-0 md:border-b-0 md:border-r md:p-0",
        "md:transition-[width] md:duration-200 md:ease-out",
        collapsed ? "md:w-16" : "md:w-56",
      )}
    >
      {/* HEADER de marca — logo-mark + wordmark; colapsa para coluna centrada. */}
      <div
        className={cn(
          "flex items-center gap-2.5 md:border-b md:border-[var(--color-border)] md:p-3",
          collapsed ? "md:flex-col md:gap-3 md:py-3" : "md:justify-between",
        )}
      >
        <Link
          href="/"
          aria-label="Charya · Revisão — início"
          title="Charya · Revisão — início"
          className={cn(
            "flex min-w-0 items-center gap-2.5 rounded-md outline-none",
            "focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
            collapsed && "md:justify-center",
          )}
        >
          <span
            aria-hidden
            className="grid size-8 shrink-0 place-items-center rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-sm"
          >
            <ScanFace className="size-[18px]" aria-hidden />
          </span>
          <span
            className={cn(
              "flex min-w-0 flex-col leading-none max-md:hidden",
              collapsed && "md:hidden",
            )}
          >
            <span className="truncate text-sm font-semibold tracking-tight text-[var(--color-foreground)]">
              Charya
            </span>
            <span className="mt-1 truncate text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-muted-foreground)]">
              Revisão
            </span>
          </span>
        </Link>

        <button
          type="button"
          onClick={toggle}
          className={cn(
            "hidden shrink-0 rounded-md p-1.5 text-[var(--color-muted-foreground)] transition-colors md:inline-flex",
            "hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
          )}
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

      {/* NAV — eyebrow de seção + itens com pill ativo sólido. */}
      <nav className="flex flex-1 flex-row items-center gap-1 overflow-x-auto md:flex-col md:items-stretch md:gap-1 md:overflow-visible md:p-2">
        <p
          className={cn(
            "px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted-foreground)] max-md:hidden",
            collapsed && "md:hidden",
          )}
        >
          Navegação
        </p>

        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          // "/" (Início) exige match exato — startsWith("/") casaria tudo.
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors",
                "focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
                active
                  ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-sm"
                  : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]",
                collapsed && "md:justify-center md:px-2",
              )}
            >
              <Icon className="size-[18px] shrink-0" aria-hidden />
              <span className={cn("truncate max-md:hidden", collapsed && "md:hidden")}>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER de perfil — avatar de iniciais + nome/papel; ações abaixo. */}
      <div className="flex items-center gap-1 md:flex-col md:items-stretch md:gap-2 md:border-t md:border-[var(--color-border)] md:p-3">
        <div
          className={cn(
            "min-w-0 items-center gap-2.5 rounded-md max-md:hidden md:flex md:px-1 md:py-0.5",
            collapsed && "md:justify-center md:px-0",
          )}
        >
          <span
            aria-hidden
            title={userLabel}
            className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--color-muted)] text-xs font-semibold text-[var(--color-foreground)] ring-1 ring-inset ring-[var(--color-border)]"
          >
            {initials}
          </span>
          <span
            className={cn(
              "flex min-w-0 flex-col leading-tight",
              collapsed && "md:hidden",
            )}
          >
            <span className="truncate text-sm font-medium text-[var(--color-foreground)]">
              {userLabel}
            </span>
            <span className="truncate text-xs text-[var(--color-muted-foreground)]">Revisora</span>
          </span>
        </div>

        <div className="flex items-center gap-1 md:flex-col md:items-stretch md:gap-1">
          <ThemeToggle collapsed={collapsed} />
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            disabled={signingOut}
            title="Sair"
            aria-label="Sair"
            className={cn("w-full justify-start", collapsed && "md:justify-center md:px-2")}
          >
            <LogOut className="size-4" aria-hidden />
            <span className={cn("max-md:hidden", collapsed && "md:hidden")}>
              {signingOut ? "Saindo…" : "Sair"}
            </span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
