import type { JSX } from "react";
import { ShieldCheck } from "lucide-react";
import { CTA } from "@/components/CTA";
import { appUrl, ctaLabel } from "@/config";

/**
 * Hero da landing — a headline da aposta + CTA principal.
 *
 * Copy fiel à marca (séria, motivacional, credível): vende compromisso e
 * transformação real, não "dinheiro fácil". Sem estética de cassino — fundo
 * sóbrio verde-eucalipto e acento âmbar terroso. Server Component estático.
 */
export function Hero(): JSX.Element {
  return (
    <section className="relative w-full overflow-hidden bg-brand-950 px-6 py-24 text-neutral-50 sm:py-32">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-700 bg-brand-900 px-4 py-1.5 text-sm font-medium text-brand-100">
          <ShieldCheck className="size-4 shrink-0" aria-hidden />
          Aposte na sua transformação
        </p>

        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Você apostaria R$&nbsp;200 que consegue perder 8&nbsp;kg em 4&nbsp;meses?
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-brand-100 sm:text-xl">
          A única aposta em que você torce para você ganhar. Coloque dinheiro real em jogo na sua
          própria meta — porque{" "}
          <strong className="font-semibold text-neutral-50">
            você muda quando existe algo de verdade em jogo.
          </strong>
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <CTA href={appUrl}>{ctaLabel}</CTA>
          <a
            href="#como-funciona"
            className="text-base font-medium text-brand-100 underline-offset-4 hover:text-neutral-50 hover:underline"
          >
            Ver como funciona
          </a>
        </div>

        <p className="mt-6 text-sm text-brand-200">
          Sem mensalidade de academia. Sem promessa milagrosa. Só você, sua meta e o seu
          compromisso.
        </p>
      </div>
    </section>
  );
}
