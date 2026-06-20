# @charya/config

Presets de toolchain compartilhados do monorepo Charya: **ESLint (flat)**, **Prettier**, **oxlint** e referência ao **tsconfig base**.

Corresponde ao pacote `packages/config` descrito na §5 e implementa os padrões transversais da §7 do [doc de Arquitetura Técnica](../../docs/Charya_Arquitetura_Tecnica.md).

## TypeScript base — a fonte canônica é a RAIZ

> **Importante:** a base canônica do TypeScript é **`/tsconfig.base.json` na raiz do repositório**, não este pacote.
>
> Cada `package`/`app` faz `"extends": "../../tsconfig.base.json"` (ajustando o caminho relativo). Este pacote **não** re-exporta nem duplica o tsconfig base — fazer isso criaria duas fontes da verdade e drift de configuração.

A base raiz é `strict`, com `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `isolatedModules` e `moduleResolution: Bundler` (ver `tsconfig.base.json`).

## ESLint (flat) — fonte da verdade do lint type-aware

`typescript-eslint` + `@eslint/js` + `eslint-config-prettier`. O preset roda **depois** do pré-passo do oxlint.

| Export                               | Para                                               |
| ------------------------------------ | -------------------------------------------------- |
| `@charya/config/eslint/base`         | base type-aware (todos os pacotes TS)              |
| `@charya/config/eslint/node`         | `apps/api`, pacotes server-side (globals Node)     |
| `@charya/config/eslint/react`        | `apps/admin` (Next.js / React 19, globals browser) |
| `@charya/config/eslint/react-native` | `apps/mobile` (Expo / RN, globals RN + worklets)   |

```js
// apps/api/eslint.config.js
import node from '@charya/config/eslint/node';
export default [...node];
```

> O preset usa `parserOptions.projectService: true` — defina `tsconfigRootDir` no consumidor (`import.meta.dirname`) se precisar de resolução de projeto explícita.

## Prettier

```js
// prettier.config.mjs (raiz ou app)
export { default } from '@charya/config/prettier';
```

`singleQuote`, `trailingComma: all`, `printWidth: 100`, `semi: true`.

## oxlint (pré-passo rápido)

`@charya/config/oxlint` aponta para o `.oxlintrc` base (categorias `correctness`/`suspicious`/`perf`). Roda em pre-commit (Lefthook) e no CI **antes** do ESLint — 50–100× mais rápido, pega o óbvio cedo.

```jsonc
// .oxlintrc.json de um app
{ "extends": ["@charya/config/oxlint"] }
```
