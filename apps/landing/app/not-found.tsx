import type { Metadata } from "next";
import type { JSX } from "react";
import { CTA, FlameMark } from "@/ui";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description: "Esse link não existe — volte pro início e siga na sua meta.",
  robots: { index: false, follow: false },
};

/**
 * 404 tematizada — estado vazio no tom do manual: convite, não vergonha.
 * Server Component puro (sem hooks) pra prerenderizar limpo.
 */
export default function NotFound(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 py-20 text-center text-white">
      <FlameMark className="h-16 w-auto text-violet-soft" />
      <p className="mt-8 font-[family-name:var(--font-geist-mono)] text-[11px] font-bold uppercase tracking-[0.28em] text-fog-mute">
        Erro 404
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-archivo)] text-display font-black leading-[1.1] tracking-[-0.02em]">
        Página não encontrada
      </h1>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-fog">
        Esse link não existe — mas a sua meta continua de pé.
      </p>
      <CTA href="/" onDark className="mt-9">
        Voltar pro início
      </CTA>
    </main>
  );
}
