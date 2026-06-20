// @ts-check
/**
 * Preset Prettier compartilhado do monorepo Charya.
 *
 * Uso (raiz e apps consomem este preset):
 *   // prettier.config.mjs
 *   export { default } from '@charya/config/prettier';
 *
 * Mantido em sincronia com .editorconfig (indent 2 espaços, LF, UTF-8).
 *
 * @type {import('prettier').Config}
 */
const config = {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  semi: true,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
  // TODO: adicionar prettier-plugin-tailwindcss em admin/mobile para ordenar
  // classes utilitárias (plugin instalado no app, não na raiz).
};

export default config;
