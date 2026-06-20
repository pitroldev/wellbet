// @ts-check
/**
 * Preset ESLint FLAT para ambientes Node (apps/api, packages/* server-side).
 * Estende a base com os globals de Node 24.
 *
 * Uso:
 *   import node from '@charya/config/eslint/node';
 *   export default [...node];
 */
import globals from 'globals';
import { base } from './eslint.base.js';

/** @type {import('typescript-eslint').ConfigArray} */
export const node = [
  ...base,
  {
    name: 'charya/node/globals',
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];

export default node;
