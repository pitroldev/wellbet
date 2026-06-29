import type { JSX } from "react";
import { RotateCcw, HeartCrack, Wallet, type LucideIcon } from "lucide-react";
import { Secao, SectionHeader, Eyebrow, GradText, CardBrutal, IconTile } from "@/ui";
import { Reveal } from "@/motion";

interface Dor {
  Icon: LucideIcon;
  titulo: string;
  texto: string;
}

/** Três ângulos DISTINTOS da dor — sem repetir a mesma ideia em palavras diferentes. */
const DORES: readonly Dor[] = [
  {
    Icon: RotateCcw,
    titulo: "O efeito sanfona",
    texto:
      "Você perde uns quilos e, semanas depois, está tudo de volta. De novo. O problema nunca foi força de vontade — foi não ter nada real te segurando.",
  },
  {
    Icon: HeartCrack,
    titulo: "App nenhum te cobra",
    texto:
      "Contador de calorias, planilha, mais um aplicativo passivo. Sem consequência de verdade, o sofá vence na terça-feira chuvosa.",
  },
  {
    Icon: Wallet,
    titulo: "Cada recomeço custa",
    texto:
      "Dieta, academia, tempo, autoestima — toda tentativa que evapora cobra um preço. O caro não é apostar: é recomeçar do zero pela enésima vez.",
  },
];

/**
 * Seção "O problema" — nomeia a dor em 3 frentes diferentes (recaída, falta de
 * cobrança, custo acumulado das tentativas) e qualifica o público. Superfície
 * navy p/ quebrar o ink-ink depois do ticker. Sem glow.
 */
export function Problema(): JSX.Element {
  return (
    <Secao id="o-problema" surface="navy">
      <Reveal>
        <SectionHeader
          kicker={<Eyebrow tone="pink">O ciclo que se repete</Eyebrow>}
          title={
            <>
              Você já tentou. <GradText>Várias vezes.</GradText>
            </>
          }
          lede="O ciclo se repete porque falta o ingrediente que muda o jogo: algo de verdade em jogo."
        />
        <p className="mt-6 max-w-2xl font-[family-name:var(--font-geist-mono)] text-xs font-bold uppercase tracking-[0.14em] text-fog-mute">
          É pra você que cansou de recomeçar do zero.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:mt-14 md:grid-cols-3">
        {DORES.map(({ Icon, titulo, texto }, i) => (
          <Reveal key={titulo} delay={0.05 * i}>
            <CardBrutal surface="ink" interactive className="border-l-[3px] border-l-magenta">
              <div className="flex items-center gap-3">
                <IconTile tone="muted">
                  <Icon className="size-5" strokeWidth={2} aria-hidden />
                </IconTile>
                <span className="font-[family-name:var(--font-geist-mono)] text-xs font-bold tracking-[0.2em] text-fog-mute">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 font-[family-name:var(--font-archivo)] text-xl uppercase leading-[0.95] tracking-tight text-white">
                {titulo}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-fog">{texto}</p>
            </CardBrutal>
          </Reveal>
        ))}
      </div>
    </Secao>
  );
}
