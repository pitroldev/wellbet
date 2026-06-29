"use client";

import type { JSX } from "react";

/**
 * Error boundary global (substitui o root layout num erro de raiz). Mínimo e
 * sem libs pesadas — precisa renderizar html/body próprios e prerenderizar
 * limpo no build (o default do Next quebra com React 19 neste setup).
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }): JSX.Element {
  return (
    <html lang="pt-BR">
      <body
        style={{
          minHeight: "100vh",
          margin: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0d16",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: 24 }}>
          <p
            style={{
              color: "#ff00ff",
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            WellBet
          </p>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>Algo deu errado.</h2>
          <p style={{ color: "#b9c0e0", marginTop: 8 }}>Recarregue a página ou tente de novo.</p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 20,
              padding: "12px 24px",
              borderRadius: 0,
              border: "none",
              cursor: "pointer",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "#0a0d16",
              background: "#ff00ff",
            }}
          >
            Tentar de novo
          </button>
        </div>
      </body>
    </html>
  );
}
