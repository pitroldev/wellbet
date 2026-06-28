import { ImageResponse } from "next/og";

/**
 * Imagem OpenGraph gerada dinamicamente (sem asset binário /og.jpg).
 * O Next detecta este arquivo e injeta automaticamente `og:image`;
 * `twitter-image.tsx` reaproveita o mesmo gerador para o card do X.
 * Pré-renderizada no build (rota estática) — identidade gymbet-arena (magenta).
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
        background: "linear-gradient(135deg, #08161E 0%, #240a36 55%, #0B1226 100%)",
        color: "#ffffff",
        padding: 80,
        fontFamily: "sans-serif",
      }}
    >
      {/* glow magenta */}
      <div
        style={{
          position: "absolute",
          top: -160,
          right: -120,
          width: 620,
          height: 620,
          borderRadius: 9999,
          background: "radial-gradient(circle, rgba(255,0,255,0.5) 0%, rgba(255,0,255,0) 70%)",
          display: "flex",
        }}
      />
      {/* wordmark */}
      <div
        style={{
          position: "relative",
          display: "flex",
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: "-0.02em",
        }}
      >
        Charya<span style={{ color: "#FF00FF" }}>Bet</span>
      </div>

      {/* manchete */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 900,
            fontStyle: "italic",
            textTransform: "uppercase",
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
          }}
        >
          A melhor aposta é
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 900,
            fontStyle: "italic",
            textTransform: "uppercase",
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            color: "#FF00FF",
          }}
        >
          em você.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 32,
            color: "#B9C0E0",
            maxWidth: 920,
          }}
        >
          Coloque dinheiro real na sua meta de peso. Bateu no prazo? Deu green.
        </div>
      </div>

      {/* rodapé */}
      <div style={{ position: "relative", display: "flex", fontSize: 26, color: "#41FFCA" }}>
        Comprometa-se · Evolua · Dê green
      </div>
    </div>,
    { ...size },
  );
}
