// ESLint flat config da landing (Next.js 16 App Router).
//
// `eslint-config-next` 16 já é FLAT (exporta arrays de config que incluem
// typescript-eslint recommended + react + next). Importamos os presets
// diretamente — nada de FlatCompat (que é p/ configs legados `.eslintrc` e
// quebra ao validar configs flat: "Converting circular structure to JSON").
//
// Layerar o preset `react` de @charya/config aqui causaria colisão de plugin
// ("Cannot redefine plugin @typescript-eslint"), pois o next já registra o
// typescript-eslint. Então o next é a base; acrescentamos só os ajustes de regra
// da casa (§7: `any` proibido).
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    name: "charya/landing/rules",
    rules: {
      // §7: `any` sem justificativa é erro (o preset do next deixa em warn).
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    ignores: [".next/**", "dist/**", "node_modules/**"],
  },
];

export default eslintConfig;
