import type { JSX, ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/shared/auth/server";
import { Sidebar } from "@/shared/nav";

/**
 * Shell autenticado do console.
 *
 * Server Component: valida a sessão no servidor antes de renderizar; sem sessão
 * → /login. Desktop: altura fixa (`md:h-screen`) para o <main> ser o container
 * de scroll (sticky da revisão funciona) + coluna da sidebar `auto` (acompanha
 * a largura colapsável). Mobile: `min-h-screen`, sidebar vira barra no topo.
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
    <div className="grid min-h-screen md:h-screen md:grid-cols-[auto_1fr] md:overflow-hidden">
      <Sidebar userLabel={session.user.name || session.user.email} />
      <main className="overflow-auto p-6">{children}</main>
    </div>
  );
}
