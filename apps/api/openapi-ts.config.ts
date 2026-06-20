import { defineConfig } from "@hey-api/openapi-ts";

/**
 * Config do Hey API — gera o cliente TS tipado a partir do openapi.json
 * emitido pela api (ver `openapi:emit`). A saída alimenta @charya/contracts,
 * consumido por mobile/admin. O CI checa spec-drift contra este artefato
 * (§5/§8 do doc).
 */
export default defineConfig({
  input: "./openapi.json",
  output: {
    path: "../../packages/contracts/src/generated",
    format: "prettier",
  },
  // TODO: alinhar plugins (client fetch + tanstack-query) com o que
  // mobile/admin consomem quando @charya/contracts existir.
  plugins: ["@hey-api/client-fetch"],
});
