# Política de Segurança — Charya

## Divulgação responsável

Se você encontrou uma vulnerabilidade de segurança no Charya, **não abra uma
issue pública**. Reporte de forma privada para:

- **security@charya.com.br** <!-- TODO(security): provisionar este e-mail/alias -->

Inclua, se possível: descrição, passos para reproduzir, impacto e versão/commit.
Nos comprometemos a responder em até **5 dias úteis** e a manter você informado
sobre a correção.

## Escopo

Aplica-se a todo o monorepo (`apps/*`, `packages/*`, infraestrutura). Damos
prioridade a: autenticação/autorização, manuseio de evidências de pesagem
(vídeo/biometria — dado pessoal sensível), fluxos financeiros (stake/payout) e
exposição de segredos.

## Boas práticas internas

A postura de segurança e o backlog de hardening são rastreados em
[docs/Charya_Seguranca.md](./docs/Charya_Seguranca.md). Não commitar segredos
(o CI roda secret scanning); usar `.env` local a partir de `.env.example`.

<!-- TODO(security): publicar /.well-known/security.txt apontando para este canal -->
