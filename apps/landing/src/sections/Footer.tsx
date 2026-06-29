import type { JSX } from "react";
import Link from "next/link";
import { Wordmark } from "@/ui";
import { appUrl } from "@/config";

/**
 * Footer — navegação + camada LEGAL (Termos, Privacidade/LGPD) e disclaimer de
 * jogo responsável: sinaliza seriedade e separa a WellBet de uma casa de apostas.
 */
export function Footer(): JSX.Element {
  return (
    <footer className="border-t-2 border-magenta bg-ink px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Wordmark size={28} />
          <nav
            aria-label="Rodapé"
            className="flex flex-wrap items-center gap-x-7 gap-y-3 font-[family-name:var(--font-geist-mono)] text-xs font-bold uppercase tracking-[0.14em]"
          >
            <a href="#como-funciona" className="text-fog transition-colors hover:text-white">
              Como funciona
            </a>
            <a href="#confianca" className="text-fog transition-colors hover:text-white">
              Por que confiar
            </a>
            <a href={appUrl} className="text-fog transition-colors hover:text-white">
              Entrar
            </a>
          </nav>
        </div>

        {/* disclaimer de jogo responsável — contraste em fog (não fog-mute) */}
        <p className="mt-10 max-w-3xl text-sm leading-relaxed text-fog">
          A WellBet é um instrumento de compromisso para saúde e bem-estar — não uma casa de
          apostas. O resultado depende de você cumprir a sua meta, não da sorte. Comprometa-se com
          responsabilidade.
        </p>

        <div className="mt-8 border-t border-navy-line pt-6">
          <div className="flex flex-col gap-3 font-[family-name:var(--font-geist-mono)] text-xs uppercase tracking-[0.06em] text-fog sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p className="text-fog-mute">
              © {new Date().getFullYear()} WellBet Saúde e Bem-Estar LTDA
            </p>
            <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link href="/#" className="transition-colors hover:text-white">
                Termos
              </Link>
              <Link href="/#" className="transition-colors hover:text-white">
                Privacidade · LGPD
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
