// @ts-check
/**
 * Preset ESLint FLAT para apps React web (apps/admin — Next.js 16 / React 19.2).
 * Estende a base com globals de browser + React 19.
 *
 * Plugins React (eslint-plugin-react / react-hooks / jsx-a11y) ficam a cargo do
 * consumidor para não acoplar versões aqui; este preset só adiciona o ambiente
 * de browser. O app/admin acrescenta seus plugins flat ao espalhar este array.
 *
 * Uso (apps/admin/eslint.config.js):
 *   import react from '@charya/config/eslint/react';
 *   import reactHooks from 'eslint-plugin-react-hooks';
 *   export default [...react, reactHooks.configs['recommended-latest']];
 *
 * // TODO(admin): adicionar eslint-plugin-react-hooks e jsx-a11y no app.
 */
import globals from 'globals';
import { base } from './eslint.base.js';

/** @type {import('typescript-eslint').ConfigArray} */
export const react = [
  ...base,
  {
    name: 'charya/react/globals',
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
];

export default react;
