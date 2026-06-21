/**
 * ESLint flat config do app mobile (Expo SDK 56 / RN 0.86 / React 19.2).
 *
 * `eslint-config-expo/flat` é a config FLAT canônica do Expo e já registra o
 * plugin `@typescript-eslint` (typescript-eslint recommended + regras de RN).
 * Por isso usamos o Expo como BASE e NÃO espalhamos o preset
 * `@charya/config/eslint/react-native` por cima: ambos registrariam o
 * `@typescript-eslint` e o ESLint lança "Cannot redefine plugin".
 *
 * Sobre o Expo, acrescentamos só os ajustes de regra da casa (§7: `any`
 * proibido) — sem re-declarar plugins.
 */
import expo from "eslint-config-expo/flat.js";

export default [
  ...expo,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    name: "charya/mobile/rules",
    files: ["**/*.{ts,tsx}"],
    rules: {
      // §7: `any` sem justificativa é erro (o preset do Expo não força isso).
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    ignores: ["dist/**", "node_modules/**", ".expo/**", "expo-env.d.ts"],
  },
];
