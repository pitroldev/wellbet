import type { JSX } from "react";
import { Wordmark } from "@/components/brand";
import { appUrl } from "@/config";

export function Footer(): JSX.Element {
  return (
    <footer className="border-t-2 border-magenta bg-ink px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Wordmark size={28} />
          <nav className="flex flex-wrap items-center gap-x-7 gap-y-3 font-[family-name:var(--font-geist-mono)] text-xs font-bold uppercase tracking-[0.14em]">
            <a href="#como-funciona" className="text-fog transition-colors hover:text-white">
              Como funciona
            </a>
            <a href="#credibilidade" className="text-fog transition-colors hover:text-white">
              Por que confiar
            </a>
            <a href={appUrl} className="text-fog transition-colors hover:text-white">
              Entrar
            </a>
          </nav>
        </div>

        <div className="mt-10 border-t border-navy-line pt-6">
          <div className="flex flex-col gap-2 font-[family-name:var(--font-geist-mono)] text-xs uppercase tracking-[0.06em] text-fog-mute sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Charya · Aposte na sua transformação.</p>
            <p>Charya Saúde e Bem-Estar LTDA</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
