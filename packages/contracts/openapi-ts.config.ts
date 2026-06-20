import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@hey-api/openapi-ts";

/**
 * Configuração do gerador Hey API.
 *
 * Fluxo do contrato (ver README e docs/Charya_Arquitetura_Tecnica.md §5):
 *   apps/api build → emite `apps/api/openapi.json`
 *     → `pnpm --filter @charya/contracts generate` (este config)
 *       → mobile/admin importam `@charya/contracts`.
 *
 * Enquanto a api ainda não emitiu o spec real, caímos no placeholder
 * `openapi/openapi.example.json` para que o pacote gere e tipe-cheque.
 * Drift entre o spec da api e o cliente gerado quebra o type-check no CI.
 */

const apiSpec = fileURLToPath(new URL("../../apps/api/openapi.json", import.meta.url));
const exampleSpec = fileURLToPath(new URL("./openapi/openapi.example.json", import.meta.url));

// Prefere o spec real emitido pela api; placeholder só até o primeiro build da api.
const input = existsSync(apiSpec) ? apiSpec : exampleSpec;

export default defineConfig({
  input,
  output: {
    path: "./src/generated",
    // Formatação/lint do código gerado fica a cargo do prettier/oxlint do repo.
    format: false,
    lint: false,
  },
  // Cliente fetch nativo (sem axios); casa com o runtime de mobile (RN) e admin (web).
  client: "@hey-api/client-fetch",
  plugins: [
    // SDK tipado: funções por operação do OpenAPI.
    "@hey-api/sdk",
    // Tipos TS a partir dos schemas do OpenAPI.
    "@hey-api/typescript",
    // TODO: habilitar o plugin `zod` quando quisermos validadores runtime
    //       derivados do spec (espelhando o que @charya/schemas faz no domínio):
    // {
    //   name: 'zod',
    //   // exportNamePrefix: 'z',
    // },
  ],
});
