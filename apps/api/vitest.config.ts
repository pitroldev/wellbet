import { defineConfig } from "vitest/config";

// Vitest 4 — runner unificado do monorepo para o backend.
// Cobre o domínio puro (sem Nest) e e2e via Supertest.
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
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
