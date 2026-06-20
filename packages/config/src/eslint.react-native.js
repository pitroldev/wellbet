// @ts-check
/**
 * Preset ESLint FLAT para o app mobile (apps/mobile — Expo SDK 56 / RN 0.85 /
 * React 19.2). Estende a base com globals de React Native + worklets.
 *
 * O plugin oficial do Expo (eslint-config-expo) e os plugins de RN ficam a
 * cargo do app para casar com a versão do SDK; aqui só fornecemos os globals
 * do runtime RN (incl. __DEV__ e o ambiente de worklets do Reanimated 4).
 *
 * Uso (apps/mobile/eslint.config.js):
 *   import rn from '@charya/config/eslint/react-native';
 *   import expo from 'eslint-config-expo/flat.js';
 *   export default [...rn, ...expo];
 *
 * // TODO(mobile): integrar eslint-config-expo (flat) quando o app for criado.
 */
import globals from 'globals';
import { base } from './eslint.base.js';

/** @type {import('typescript-eslint').ConfigArray} */
export const reactNative = [
  ...base,
  {
    name: 'charya/react-native/globals',
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        // React Native injeta __DEV__, requestAnimationFrame, fetch, etc.
        __DEV__: 'readonly',
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // Worklets do Reanimated 4 usam diretivas 'worklet' em strings — não
      // tratar como expressões sem efeito.
      'no-unused-expressions': 'off',
    },
  },
];

export default reactNative;
