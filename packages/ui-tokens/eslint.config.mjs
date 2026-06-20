// ESLint flat config do @charya/ui-tokens.
//
// Lib Node/TS (design tokens compartilhados). Regras base via @charya/config
// (preset `node`). tsconfigRootDir aponta para este pacote para o projectService
// resolver o tsconfig local. Os arquivos de teste (Vitest) são lintados sem
// type-checking porque podem ficar fora do tsconfig de build.
import node from "@charya/config/eslint/node";
import tseslint from "typescript-eslint";

export default [
  ...node,
  {
    name: "charya/ui-tokens/language-options",
    // Restrito a TS: arquivos de config (.mjs/.js) já são `disableTypeChecked`
    // pela base; reaplicar projectService a eles quebra o parse (não estão em
    // nenhum tsconfig de build).
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    name: "charya/ui-tokens/tests",
    files: ["**/*.{test,spec}.{ts,tsx}"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    ignores: ["dist/**"],
  },
];
