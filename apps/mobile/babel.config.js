/**
 * Babel config do app mobile.
 *
 * ORDEM IMPORTA:
 * - `nativewind/babel` habilita o transform de className/CSS estático.
 * - `react-native-worklets/plugin` DEVE ser o ÚLTIMO plugin da lista.
 *   No baseline jun/2026 os worklets vivem no pacote separado
 *   `react-native-worklets` (não mais embutido no Reanimated). O plugin
 *   substitui o antigo `react-native-reanimated/plugin`.
 *
 * @param {import('@babel/core').ConfigAPI} api
 * @returns {import('@babel/core').TransformOptions}
 */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"],
    plugins: [
      // 'react-native-worklets/plugin' PRECISA ser o último.
      "react-native-worklets/plugin",
    ],
  };
};
