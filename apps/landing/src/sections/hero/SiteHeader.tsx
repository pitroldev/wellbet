import type { JSX } from "react";
import { Wordmark } from "@/ui";
import { appUrl } from "@/config";

/** Nav do topo (sobre papel): wordmark + atalho + Entrar. Extraída do Hero. */
export function SiteHeader(): JSX.Element {
  return (
    <nav aria-label="Principal" className="flex items-center justify-between py-2">
      <Wordmark size={30} tone="ink" />
      <div className="flex items-center gap-3">
        <a
          href="#como-funciona"
          className="hidden font-[family-name:var(--font-geist-mono)] text-xs font-bold uppercase tracking-[0.14em] text-ink/70 transition-colors hover:text-ink sm:inline-flex"
        >
          Como funciona
        </a>
        <a
          href={appUrl}
          className="inline-flex items-center border-2 border-ink px-4 py-2 font-[family-name:var(--font-geist-mono)] text-xs font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          Entrar
        </a>
      </div>
    </nav>
  );
}
