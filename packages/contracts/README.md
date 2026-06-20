# @charya/contracts

**O contrato tipado entre os apps do Charya.** A `api` (NestJS) é a fonte da
verdade do shape da API; este pacote transforma o **OpenAPI** que ela emite num
**cliente TypeScript gerado por [Hey API](https://heyapi.dev)** que `mobile` e
`admin` consomem. Ninguém "adivinha" o shape da API — e ninguém edita o código
gerado à mão.

> Ver também: `docs/Charya_Arquitetura_Tecnica.md` §5 (Pacotes compartilhados) e
> §8.1 (CI / check de spec-drift).

## Fluxo do contrato

```
apps/api (build)
  └─ emite apps/api/openapi.json          (pnpm --filter @charya/api openapi:emit)
     └─ pnpm --filter @charya/contracts generate     (Hey API → src/generated)
        └─ mobile / admin importam @charya/contracts  (funções + tipos tipados)
```

1. **A api emite o spec.** No build, `@nestjs/swagger` deriva o OpenAPI a partir
   dos DTOs Zod e o grava em `apps/api/openapi.json`.
2. **`generate` produz o cliente.** `openapi-ts` lê esse `openapi.json` (config em
   [`openapi-ts.config.ts`](./openapi-ts.config.ts)) e escreve o SDK + tipos em
   [`src/generated`](./src/generated) usando o client `@hey-api/client-fetch`.
3. **Os apps consomem.** `mobile` e `admin` importam de `@charya/contracts`:
   configuram o cliente uma vez (baseUrl + headers de auth) e chamam as funções
   de SDK tipadas por operação.

Enquanto a api ainda não emitiu o spec real, o gerador cai no placeholder
[`openapi/openapi.example.json`](./openapi/openapi.example.json) — um recorte
mínimo do fluxo de pesagem só para o pacote gerar e tipe-checar.

## Por que isso impede drift

> **Mudou a API e não regenerou o contrato? O type-check do CI quebra.**

- O código de `src/generated` é **versionado** (commitado). O CI roda `generate`
  e, se o resultado divergir do que está no repo, o **check de spec-drift** falha
  o build (§8.1 da arquitetura).
- Mesmo sem o check de drift, qualquer mudança incompatível no spec muda os tipos
  gerados → o **type-check de `mobile`/`admin`** quebra ao chamar uma operação
  que não existe mais ou com payload errado.

É essa quebra deliberada que mantém os três apps em sincronia.

## Uso

```ts
// No boot do app (mobile/admin):
import { configureCharyaClient } from "@charya/contracts";

configureCharyaClient({
  baseUrl: env.API_URL, // ex.: http://localhost:3000
  headers: () => ({ Authorization: `Bearer ${getToken()}` }),
});

// Depois, em qualquer lugar — funções de SDK geradas (após `generate`):
// import { getWeighinById } from '@charya/contracts';
// const { data } = await getWeighinById({ path: { weighinId } });
```

Para um cliente isolado (testes, múltiplos hosts) use `createCharyaClient(...)`,
que devolve uma instância sem tocar no singleton global.

## Scripts

| Script      | O que faz                                                                |
| ----------- | ------------------------------------------------------------------------ |
| `generate`  | Roda `openapi-ts`: lê o `openapi.json` da api → escreve `src/generated`. |
| `build`     | `tsc --build` (emite `dist` com types para os consumidores).             |
| `typecheck` | `tsc --noEmit` (é aqui que o drift de contrato aparece).                 |
| `clean`     | Remove `dist` e o `.tsbuildinfo`.                                        |

```sh
# Regenerar o cliente após a api mudar o contrato:
pnpm --filter @charya/api openapi:emit       # emite apps/api/openapi.json
pnpm --filter @charya/contracts generate     # regenera src/generated
```

## Regras

- **`src/generated` é gerado — não editar à mão.** Toda mudança nasce no spec da
  api e flui pelo `generate`.
- **Dependências fluem só para dentro:** este pacote depende do spec da `api`
  (build-time), mas não importa código de `apps/*` em runtime.
- O cliente é **`@hey-api/client-fetch`** (fetch nativo, sem axios) — roda igual
  em React Native (mobile) e no browser/server (admin).
