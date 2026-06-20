// ESLint flat config do @charya/config.
//
// Este pacote É a fonte dos presets de ESLint do monorepo; seus próprios fontes
// são módulos `.js` (com `@ts-check`). Linta-os com o preset `node` daqui mesmo
// — o bloco `config-files` da base já aplica `disableTypeChecked` a `**/*.js`,
// então não há type-checking (não há tsconfig de build para estes arquivos).
import node from './src/eslint.node.js';

export default [
  ...node,
  {
    ignores: ['dist/**'],
  },
];
