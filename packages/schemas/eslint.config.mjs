// ESLint flat config do @charya/schemas.
//
// Lib Node/TS (fonte única de validação Zod). Regras base via @charya/config
// (preset `node`). tsconfigRootDir aponta para este pacote para o projectService
// resolver o tsconfig local.
//
// Os testes Vitest (`src/*.test.ts`) ficam FORA do tsconfig de build
// (excluídos lá) — por isso são lintados com `disableTypeChecked`, que não exige
// que o arquivo pertença a um projeto TS. As regras de estilo/erro não-type-aware
// continuam valendo sobre eles.
import node from "@charya/config/eslint/node";
import tseslint from "typescript-eslint";

export default [
  ...node,
  {
    name: "charya/schemas/language-options",
    // Restrito a TS de produção: arquivos de config (.mjs/.js) já são
    // `disableTypeChecked` pela base. Os testes recebem `disableTypeChecked`
    // logo abaixo (ficam fora do tsconfig de build).
    files: ["**/*.{ts,tsx,mts,cts}"],
    ignores: ["**/*.{test,spec}.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    name: "charya/schemas/tests",
    files: ["**/*.{test,spec}.{ts,tsx}"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    ignores: ["dist/**"],
  },
];
