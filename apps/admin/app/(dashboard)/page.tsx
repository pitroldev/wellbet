import type { JSX } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, Coins, ListChecks, UserCog } from "lucide-react";

import { getServerSession } from "@/shared/auth/server";
import { QueueCta } from "@/features/home/QueueCta";

export const metadata: Metadata = {
  title: "Início — Charya",
};

const SECTIONS = [
  {
    href: "/review",
    label: "Fila de revisão",
    desc: "Pesagens aguardando veredito.",
    icon: ClipboardCheck,
  },
  { href: "/bets", label: "Apostas", desc: "Apostas e settlement das pesagens.", icon: Coins },
  {
    href: "/users",
    label: "Usuários",
    desc: "Suporte: buscar conta, reset de senha, dados.",
    icon: UserCog,
  },
  { href: "/criteria", label: "Critérios", desc: "Checklist de aprovação da revisão.", icon: ListChecks },
] as const;

/**
 * Home do console (Server Component). Saudação + CTA da fila (contagem viva) +
 * atalhos para as áreas. Simples: o revisor cai aqui ao logar e segue o fluxo.
 */
export default async function HomePage(): Promise<JSX.Element> {
  const session = await getServerSession();
  const first = session?.user.name?.trim().split(/\s+/)[0] ?? "revisor";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Olá, {first} 👋</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Pronto para revisar? Comece pela fila ou vá direto ao que precisa.
        </p>
      </header>

      <QueueCta />

      <section className="flex flex-col gap-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
          Atalhos
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {SECTIONS.map(({ href, label, desc, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 transition-colors hover:border-[var(--color-ring)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-md bg-[var(--color-muted)] text-[var(--color-foreground)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-primary-foreground)]">
                <Icon className="size-[18px]" aria-hidden />
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="font-medium">{label}</span>
                <span className="text-sm text-[var(--color-muted-foreground)]">{desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
