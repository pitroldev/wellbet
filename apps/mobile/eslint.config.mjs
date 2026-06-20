/**
 * ESLint flat config do app mobile.
 *
 * Combina o preset compartilhado (@charya/config/eslint/react-native — base
 * typescript-eslint + globals de RN/worklets) com o preset oficial do Expo
 * (eslint-config-expo/flat), que casa com a versão do SDK.
 */
import reactNative from "@charya/config/eslint/react-native";
import expo from "eslint-config-expo/flat.js";

export default [
  ...reactNative,
  ...expo,
  {
    ignores: ["dist/**", "node_modules/**", ".expo/**", "expo-env.d.ts"],
  },
];
