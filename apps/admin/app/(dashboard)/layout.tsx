import type { JSX, ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/shared/auth/server";
import { SidebarNav, SignOutButton } from "@/shared/nav";

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
    <div className="grid min-h-screen grid-cols-[240px_1fr]">
      <aside className="flex flex-col border-r border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="border-b border-[var(--color-border)] p-4">
          <p className="text-sm font-semibold">Charya · Revisão</p>
          <p className="truncate text-xs text-[var(--color-muted-foreground)]">
            {session.user.name || session.user.email}
          </p>
        </div>
        <div className="flex-1">
          <SidebarNav />
        </div>
        <div className="border-t border-[var(--color-border)] p-2">
          <SignOutButton />
        </div>
      </aside>
      <main className="overflow-auto p-6">{children}</main>
    </div>
  );
}
