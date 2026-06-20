import { ImageResponse } from "next/og";

/**
 * Imagem OpenGraph gerada dinamicamente (sem asset binário /og.jpg).
 * O Next detecta este arquivo e injeta automaticamente `og:image`;
 * `twitter-image.tsx` reaproveita o mesmo gerador para o card do X.
 * É pré-renderizada no build (rota estática), coerente com a landing SSG.
 */
export const alt = "Charya Bet — Aposte na sua transformação";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(135deg, #0e1f1a 0%, #16302a 100%)",
        color: "#f5f1e8",
        padding: 80,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 40,
          fontWeight: 700,
          letterSpacing: "-0.02em",
        }}
      >
        CHARYA<span style={{ color: "#d9a441" }}>BET</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          Aposte na sua transformação.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 34,
            color: "#c9c2b0",
            maxWidth: 900,
          }}
        >
          A única aposta em que você torce para você ganhar.
        </div>
      </div>

      <div style={{ display: "flex", fontSize: 26, color: "#9aa39b" }}>
        Comprometa-se. Evolua. Ganhe.
      </div>
    </div>,
    { ...size },
  );
}
