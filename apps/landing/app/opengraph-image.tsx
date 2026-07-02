import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Imagem OpenGraph gerada dinamicamente (sem asset binário /og.jpg).
 * O Next detecta este arquivo e injeta automaticamente `og:image`;
 * `twitter-image.tsx` reaproveita o mesmo gerador para o card do X.
 * Pré-renderizada no build (rota estática) — cartaz PAPEL da marca WellBet:
 * régua em gradiente da marca, lockup oficial em violeta, manchete Outfit com
 * bloco arredondado violeta e "Deu green." no verde da vitória. Sem itálico.
 */
export const alt = "WellBet — Aposte na sua transformação";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Paleta canônica do cartaz (ver docs/WellBet_Design_System.md §2). */
const VIOLET = "#5032FC";
const INK = "#08161E";
const PAPER = "#FAFBFC";
const PAPER_MUTE = "#53626E";
const PAPER_LINE = "#E2E7EB";
const GREEN_TEXT = "#047857"; // verde AA sobre paper (spec §2)
const GRADIENT_BRAND = "linear-gradient(115deg, #5032FC 0%, #4A96FF 55%, #3EC0FF 100%)";

/**
 * TTFs oficiais lidos do node_modules hoisted na raiz do monorepo (os pacotes
 * @expo-google-fonts são deps do mobile). Se indisponíveis (layout de instalação
 * diferente), o cartaz degrada para a fonte default do gerador.
 */
async function loadFont(pkgPath: string): Promise<Buffer | null> {
  const candidates = [
    join(/* turbopackIgnore: true */ process.cwd(), "node_modules", pkgPath),
    join(/* turbopackIgnore: true */ process.cwd(), "..", "..", "node_modules", pkgPath),
  ];
  for (const candidate of candidates) {
    try {
      return await readFile(candidate);
    } catch {
      // tenta o próximo candidato
    }
  }
  return null;
}

/**
 * SVG oficial de public/brand recolorido para o lockup TODO violeta (o texto do
 * master usa currentColor) e embutido como data URI — satori não busca URL.
 */
async function loadBrandSvg(file: string): Promise<string | null> {
  try {
    const svg = await readFile(join(process.cwd(), "public", "brand", file), "utf8");
    const recolored = svg.replaceAll("currentColor", VIOLET);
    return `data:image/svg+xml;base64,${Buffer.from(recolored).toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OpengraphImage(): Promise<ImageResponse> {
  const [outfit, jakarta, wordmark, symbol] = await Promise.all([
    loadFont("@expo-google-fonts/outfit/800ExtraBold/Outfit_800ExtraBold.ttf"),
    loadFont("@expo-google-fonts/plus-jakarta-sans/500Medium/PlusJakartaSans_500Medium.ttf"),
    loadBrandSvg("wordmark-wellbet.svg"),
    loadBrandSvg("symbol-wellbet.svg"),
  ]);

  const fonts: { name: string; data: Buffer; weight: 500 | 800; style: "normal" }[] = [];
  if (outfit) fonts.push({ name: "Outfit", data: outfit, weight: 800, style: "normal" });
  if (jakarta) fonts.push({ name: "Jakarta", data: jakarta, weight: 500, style: "normal" });

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: PAPER,
        color: INK,
        padding: 72,
        fontFamily: jakarta ? "Jakarta" : "sans-serif",
      }}
    >
      {/* régua da marca no topo */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 12,
          background: GRADIENT_BRAND,
          display: "flex",
        }}
      />

      {/* símbolo punho+chama como marca-d'água violeta sangrando à direita */}
      {symbol ? (
        // eslint-disable-next-line @next/next/no-img-element -- JSX do satori (gerador OG), não DOM
        <img
          src={symbol}
          alt=""
          width={330}
          height={490}
          style={{ position: "absolute", right: -28, bottom: -70, opacity: 0.06 }}
        />
      ) : null}

      {/* lockup oficial símbolo+WELLBET, todo violeta */}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {wordmark ? (
          // eslint-disable-next-line @next/next/no-img-element -- JSX do satori (gerador OG), não DOM
          <img src={wordmark} alt="" width={227} height={44} />
        ) : (
          <div
            style={{
              display: "flex",
              fontFamily: "Outfit",
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: VIOLET,
            }}
          >
            WellBet
          </div>
        )}
      </div>

      {/* manchete — Outfit 800, sentence case, ênfase em bloco arredondado */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontFamily: "Outfit",
            fontSize: 92,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          A melhor aposta
        </div>
        <div style={{ display: "flex", marginTop: 14 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Outfit",
              fontSize: 92,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              background: VIOLET,
              color: "#FFFFFF",
              padding: "4px 28px",
              borderRadius: 24,
            }}
          >
            é em você.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            marginTop: 30,
            fontSize: 26,
            lineHeight: 1.4,
            color: PAPER_MUTE,
            maxWidth: 900,
          }}
        >
          <span>Coloque dinheiro real na sua meta de peso. Bateu no prazo?</span>
          <span
            style={{
              marginLeft: 9,
              fontFamily: "Outfit",
              fontWeight: 800,
              color: GREEN_TEXT,
            }}
          >
            Deu green.
          </span>
        </div>
      </div>

      {/* rodapé — pílula de bilhete com o mantra */}
      <div style={{ position: "relative", display: "flex" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 28px",
            borderRadius: 999,
            border: `1px solid ${PAPER_LINE}`,
            background: "#FFFFFF",
            fontFamily: "Outfit",
            fontSize: 21,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: INK,
          }}
        >
          Comprometa-se · Evolua · Dê green
        </div>
      </div>
    </div>,
    { ...size, ...(fonts.length > 0 ? { fonts } : {}) },
  );
}
