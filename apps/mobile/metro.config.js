/**
 * Metro config do app mobile.
 *
 * - `withNativeWind` injeta o pipeline de CSS do NativeWind v4 (TW3 por baixo),
 *   apontando para o `global.css` com as diretivas @tailwind.
 * - Monorepo pnpm: Metro precisa enxergar a raiz do workspace para resolver
 *   os pacotes internos (@charya/*) e o node_modules hoisted (node-linker=hoisted).
 */
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("node:path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Watch da raiz do monorepo para hot-reload de pacotes internos (@charya/*).
config.watchFolders = [workspaceRoot];
// Resolve tanto o node_modules do app quanto o hoisted da raiz
// (node-linker=hoisted no .npmrc). Mantemos a busca hierárquica LIGADA — é o
// setup recomendado do Expo para monorepo e evita falhas de resolução de
// dependências transitivas dos pacotes hoisted.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

module.exports = withNativeWind(config, { input: "./global.css" });
