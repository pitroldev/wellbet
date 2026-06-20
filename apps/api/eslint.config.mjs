// ESLint flat config (ESLint 9 + typescript-eslint).
// TODO: trocar por `import config from '@charya/config/eslint'` quando o preset
// compartilhado de packages/config estiver disponível (§5/§7 do doc).
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/**", "coverage/**", "src/infra/db/migrations/**", "*.config.*"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Decorators do Nest usam tipos em parâmetros de construtor.
      "@typescript-eslint/no-extraneous-class": "off",
      // Erro de domínio é union discriminada; `any` permanece proibido (§7).
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    // Specs podem ser mais frouxos.
    files: ["**/*.spec.ts", "**/*.e2e-spec.ts", "test/**/*.ts"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
);
