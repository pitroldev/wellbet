import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import react from "@charya/config/eslint/react";

const __dirname = dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({ baseDirectory: __dirname });

/**
 * ESLint flat config da landing.
 *
 * A fonte da verdade das regras base é @charya/config (ESLint flat +
 * typescript-eslint, preset `react`). Sobre ela, estendemos os presets do Next
 * (core-web-vitals + typescript) via FlatCompat para as regras específicas do
 * App Router — mesmo padrão do apps/admin.
 */
const eslintConfig = [
  ...react,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [".next/**", "dist/**", "node_modules/**"],
  },
];

export default eslintConfig;
