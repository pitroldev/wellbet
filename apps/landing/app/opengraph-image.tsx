import { ImageResponse } from "next/og";

/**
 * Imagem OpenGraph gerada dinamicamente (sem asset binário /og.jpg).
 * O Next detecta este arquivo e injeta automaticamente `og:image`;
 * `twitter-image.tsx` reaproveita o mesmo gerador para o card do X.
 * Pré-renderizada no build (rota estática) — cartaz PAPEL sportsbook-brutal:
 * tipo ink pesado em caixa-alta, bloco CHAPADO de magenta, sem itálico.
 */
export const alt = "Charya Bet — Aposte na sua transformação";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f1efe9",
        color: "#0a0d16",
        padding: 80,
        fontFamily: "sans-serif",
      }}
    >
      {/* estilhaço magenta chapado sangrando pela direita */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 460,
          height: "100%",
          background: "#ff00ff",
          clipPath: "polygon(38% 0, 100% 0, 100% 100%, 0 100%)",
          display: "flex",
        }}
      />

      {/* wordmark */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div style={{ width: 40, height: 40, background: "#ff00ff", display: "flex" }} />
        <div
          style={{
            display: "flex",
            fontSize: 38,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
          }}
        >
          Charya
        </div>
      </div>

      {/* manchete */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 104,
            fontWeight: 900,
            textTransform: "uppercase",
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
          }}
        >
          A melhor aposta
        </div>
        <div style={{ display: "flex", marginTop: 8 }}>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 900,
              textTransform: "uppercase",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              background: "#ff00ff",
              color: "#0a0d16",
              padding: "0 16px",
            }}
          >
            é em você.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 30,
            color: "#565163",
            maxWidth: 760,
          }}
        >
          Coloque dinheiro real na sua meta de peso. Bateu no prazo? Deu green.
        </div>
      </div>

      {/* rodapé */}
      <div
        style={{
          position: "relative",
          display: "flex",
          fontSize: 24,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#0a0d16",
        }}
      >
        Comprometa-se · Evolua · Dê green
      </div>
    </div>,
    { ...size },
  );
}
