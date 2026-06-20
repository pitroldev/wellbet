import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __dirname = dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({ baseDirectory: __dirname });

/**
 * ESLint flat config do admin.
 *
 * A fonte da verdade das regras é @charya/config (ESLint flat + typescript-eslint,
 * Arquitetura §5/§7). Enquanto o preset compartilhado não está plugado,
 * estendemos os presets do Next via FlatCompat. Substituir por:
 *
 *   import { config as charyaConfig } from "@charya/config/eslint";
 *   export default [...charyaConfig, ...]
 */
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [".next/**", "dist/**", "node_modules/**", "playwright-report/**"],
  },
];

export default eslintConfig;
