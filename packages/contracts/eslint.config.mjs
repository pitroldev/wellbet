// ESLint flat config do @charya/contracts.
//
// Lib Node/TS (contrato OpenAPI → cliente TS gerado). Regras base via
// @charya/config (preset `node`). tsconfigRootDir aponta para este pacote para o
// projectService resolver o tsconfig local.
//
// `src/generated/**` é CÓDIGO GERADO (Hey API) — nunca editado à mão; fica de
// fora do lint. `openapi-ts.config.ts` roda só via tsx/openapi-ts e está fora do
// tsconfig de build, então é lintado sem type-checking.
import node from "@charya/config/eslint/node";
import tseslint from "typescript-eslint";

export default [
  ...node,
  {
    name: "charya/contracts/language-options",
    // Restrito a TS de produção: arquivos de config (.mjs/.js) já são
    // `disableTypeChecked` pela base; `openapi-ts.config.ts` recebe
    // `disableTypeChecked` abaixo (fica fora do tsconfig de build).
    files: ["**/*.{ts,tsx,mts,cts}"],
    ignores: ["openapi-ts.config.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    name: "charya/contracts/config-files",
    files: ["openapi-ts.config.ts"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    ignores: ["dist/**", "src/generated/**"],
  },
];
