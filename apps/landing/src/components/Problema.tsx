import type { JSX } from "react";
import { RotateCcw, HeartCrack, TrendingDown } from "lucide-react";
import { Secao } from "@/components/Secao";
import { Eyebrow, Glow, Display, GradText } from "@/components/ui";
import { Reveal } from "@/components/motion";

interface Dor {
  icon: typeof RotateCcw;
  titulo: string;
  texto: string;
}

const DORES: Dor[] = [
  {
    icon: RotateCcw,
    titulo: "O efeito sanfona",
    texto:
      "Você começa firme, perde uns quilos e, semanas depois, está tudo de volta. De novo. O problema nunca foi sua força de vontade — foi a falta de algo real te segurando.",
  },
  {
    icon: HeartCrack,
    titulo: "App nenhum te cobra de verdade",
    texto:
      "Contador de calorias, planilha, mais um aplicativo passivo. Quando não há consequência, o sofá sempre vence na terça-feira chuvosa.",
  },
  {
    icon: TrendingDown,
    titulo: "Disciplina sozinha não para de pé",
    texto:
      "Manter a rotina por meses exige mais que motivação de domingo. Exige um motivo que doa abandonar — e uma recompensa que valha terminar.",
  },
];

/**
 * Seção "O problema" — nomeia a dor (efeito sanfona, apps passivos, disciplina
 * que não se sustenta) antes da virada. Direção GYMBET ARENA: glows magenta/roxo,
 * manchete Archivo black itálico. Cards de DOR diferenciados (acento à esquerda,
 * tile dessaturado, fundo levemente apagado) para lerem como "problemas".
 */
export function Problema(): JSX.Element {
  return (
    <Secao id="o-problema" surface="ink">
      <Glow
        className="left-[-10%] top-[-6%] h-[28rem] w-[28rem]"
        color="#FF00FF"
        style={{ opacity: 0.16 }}
      />
      <Glow
        className="right-[-8%] bottom-[-10%] h-[24rem] w-[24rem]"
        color="#7A1BD6"
        style={{ opacity: 0.18 }}
      />

      <Reveal y={26} className="max-w-3xl">
        <Eyebrow tone="pink">O ciclo que se repete</Eyebrow>
        <Display level={2} className="mt-4 text-[clamp(2rem,5vw,3.4rem)]">
          Você já tentou. <GradText>Várias vezes.</GradText>
        </Display>
        <p className="mt-4 max-w-2xl text-lg text-fog">
          O ciclo se repete porque falta o ingrediente que muda o jogo: algo real em jogo. Sem isso,
          a rotina sempre afrouxa.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {DORES.map((dor, i) => {
          const Icone = dor.icon;
          return (
            <Reveal
              key={dor.titulo}
              delay={0.05 * i}
              y={26}
              className="group relative overflow-hidden border border-navy-line border-l-[3px] border-l-magenta bg-navy-soft/60 p-6 transition-colors hover:border-magenta/50 hover:border-l-magenta"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center bg-white/5 text-fog-mute ring-1 ring-white/10">
                  <Icone className="size-5" strokeWidth={2} aria-hidden />
                </span>
                <span className="font-[family-name:var(--font-geist-mono)] text-xs font-bold tracking-[0.2em] text-fog-mute">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 font-[family-name:var(--font-archivo)] text-xl uppercase leading-[0.95] tracking-tight text-white">
                {dor.titulo}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-fog">{dor.texto}</p>
            </Reveal>
          );
        })}
      </div>
    </Secao>
  );
}
