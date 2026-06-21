import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// Vitest 4 — runner unificado do monorepo para o backend.
// Cobre o domínio puro (sem Nest) e e2e via Supertest.
// `vite-tsconfig-paths` resolve os aliases `@/*` (tsconfig) nos testes.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "node",
    // Pula a validação de env (@charya/env/t3-env) nos testes: módulos que
    // importam config.module avaliam o schema no load e exigiriam DATABASE_URL
    // etc. Os testes injetam env fake nos adapters diretamente.
    env: { SKIP_ENV_VALIDATION: "true" },
    include: ["src/**/*.{spec,test}.ts", "test/**/*.e2e-spec.ts"],
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.spec.ts", "src/**/*.test.ts", "src/**/*.module.ts", "src/main.ts"],
    },
  },
  // Decorators de Nest precisam de esbuild com suporte a decorators legacy.
  esbuild: {
    target: "es2023",
  },
});
