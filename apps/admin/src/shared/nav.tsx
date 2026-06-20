"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardCheck, Coins, LogOut, Users } from "lucide-react";
import { signOut } from "@/shared/auth/client";
import { Button } from "@/shared/ui";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/review", label: "Fila de revisão", icon: ClipboardCheck },
  { href: "/bets", label: "Apostas", icon: Coins },
  { href: "/users", label: "Usuários", icon: Users },
] as const;

export function SidebarNav(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-2">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-[var(--color-muted)] text-[var(--color-foreground)]"
                : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SignOutButton(): React.JSX.Element {
  const [pending, setPending] = React.useState(false);

  async function onSignOut(): Promise<void> {
    setPending(true);
    await signOut();
    // Força reload para limpar estado de sessão / RSC.
    window.location.href = "/login";
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onSignOut}
      disabled={pending}
      className="w-full justify-start"
    >
      <LogOut className="size-4" />
      {pending ? "Saindo…" : "Sair"}
    </Button>
  );
}
