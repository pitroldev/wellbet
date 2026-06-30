import type { JSX, ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/shared/auth/server";
import { SidebarNav, SignOutButton } from "@/shared/nav";
import { ThemeToggle } from "@/shared/theme";

/**
 * Shell autenticado do console.
 * Server Component: valida a sessão no servidor antes de renderizar o shell;
 * sem sessão → redireciona para /login.
 */
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}): Promise<JSX.Element> {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  return (
    // Shell de altura fixa no desktop: o <main> vira o container de scroll, então
    // `position: sticky` (evidência/veredito da revisão) ancora corretamente. No
    // mobile volta a `min-h-screen` (coluna única, sem sticky).
    <div className="grid min-h-screen md:h-screen md:grid-cols-[220px_1fr] md:overflow-hidden">
      <aside className="flex flex-col border-b border-[var(--color-border)] bg-[var(--color-card)] md:border-b-0 md:border-r">
        <div className="border-b border-[var(--color-border)] p-4">
          <p className="text-sm font-semibold">Charya · Revisão</p>
          <p className="truncate text-xs text-[var(--color-muted-foreground)]">
            {session.user.name || session.user.email}
          </p>
        </div>
        <div className="flex-1">
          <SidebarNav />
        </div>
        <div className="flex flex-col gap-1 border-t border-[var(--color-border)] p-2">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </aside>
      <main className="overflow-auto p-6">{children}</main>
    </div>
  );
}
