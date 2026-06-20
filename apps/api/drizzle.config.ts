import { defineConfig } from "drizzle-kit";

// Drizzle Kit 1.0 RC — schema único do banco em src/infra/db/schema.ts.
// Migrações versionadas em src/infra/db/migrations e aplicadas SOMENTE como
// step explícito de deploy (nunca auto-migrate em runtime — ver §2 do doc).
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/infra/db/schema.ts",
  out: "./src/infra/db/migrations",
  dbCredentials: {
    // DATABASE_URL é validada por @charya/env no boot do app; aqui o
    // drizzle-kit (CLI fora do runtime Nest) lê direto do ambiente.
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
});
