import type { JSX } from "react";
import { Wordmark } from "@/ui";
import { appUrl } from "@/config";

/** Nav do topo (sobre ink): wordmark claro + atalho pro como-funciona + Entrar. */
export function SiteHeader(): JSX.Element {
  return (
    <nav aria-label="Principal" className="flex items-center justify-between py-2">
      <Wordmark size={30} tone="light" />
      <div className="flex items-center gap-3">
        <a
          href="#como-funciona"
          className="hidden min-h-11 items-center font-[family-name:var(--font-geist-mono)] text-xs font-bold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white sm:inline-flex"
        >
          Como funciona
        </a>
        <a
          href={appUrl}
          className="inline-flex min-h-11 items-center rounded-full border border-white/45 px-5 font-[family-name:var(--font-geist-mono)] text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:border-white hover:bg-white/10"
        >
          Entrar
        </a>
      </div>
    </nav>
  );
}
