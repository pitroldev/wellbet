// @ts-check
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Escopos sugeridos por área do monorepo (não obrigatório, só normaliza).
    "scope-enum": [
      1,
      "always",
      [
        "api",
        "admin",
        "mobile",
        "schemas",
        "contracts",
        "env",
        "config",
        "ui-tokens",
        "infra",
        "ci",
        "deps",
        "repo",
      ],
    ],
    "body-max-line-length": [0, "always"],
  },
};

export default config;
