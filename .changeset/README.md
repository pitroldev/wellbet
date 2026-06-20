# Changesets

Versionamento dos **pacotes internos** (`packages/*`) via [Changesets](https://github.com/changesets/changesets) — ver §7 do doc de Arquitetura Técnica.

Os apps deployáveis (`api`, `admin`, `mobile`) são ignorados (`ignore` no `config.json`): eles são entregues por container/EAS, não publicados em registry npm.

## Fluxo

```bash
# Ao abrir um PR que muda um package, descreva a mudança:
pnpm changeset

# Na main, o CI/release abre o PR de versão e atualiza CHANGELOGs:
pnpm changeset version
```

`baseBranch: main` · `access: restricted` (nada vaza para o npm público por engano).
