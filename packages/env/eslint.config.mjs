// ESLint flat config do @charya/env.
//
// Lib Node/TS (fronteira de env tipada). A fonte da verdade das regras é
// @charya/config (ESLint flat + typescript-eslint, preset `node` — base +
// globals de Node). tsconfigRootDir aponta para este pacote para o conjunto
// type-aware resolver o tsconfig local via projectService.
import node from "@charya/config/eslint/node";

export default [
  ...node,
  {
    name: "charya/env/language-options",
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
    ignores: ["dist/**"],
  },
];
