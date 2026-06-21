import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Testes de INTEGRAÇÃO: sobem um Postgres efêmero (Testcontainers) e exercitam
 * os repositórios Drizzle contra SQL real. Separados do `test` padrão (que é
 * docker-free e roda no CI): rodam via `pnpm test:integration` e exigem o daemon
 * do Docker. Por isso o include é `*.int-spec.ts` (fora do glob do `test`).
 */
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["test/**/*.int-spec.ts"],
    testTimeout: 30_000,
    hookTimeout: 120_000,
    env: { SKIP_ENV_VALIDATION: "true" },
  },
});
