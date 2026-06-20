/**
 * Cliente Drizzle + pool pg.
 *
 * Um único pool de conexões por processo. A `DATABASE_URL` vem da env validada
 * (@charya/env). Migrações NUNCA rodam aqui — só em step de deploy.
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Constrói o cliente Drizzle (API de objeto único, drizzle 1.0-rc).
 * TODO(drizzle-1.0): religar o `schema` para habilitar `db.query` relacional
 * quando a inferência de Relations v2 estabilizar no stable. Por ora os
 * repositórios usam o query builder (`db.select().from(table)`) com as tabelas
 * importadas de `./schema`, então o cliente não precisa do mapa de schema.
 */
function makeDb(pool: Pool) {
  return drizzle({ client: pool });
}

/** Tipo do cliente Drizzle, derivado do retorno REAL (evita anotar o genérico à mão). */
export type Database = ReturnType<typeof makeDb>;

export interface DbHandle {
  readonly db: Database;
  readonly pool: Pool;
}

/** Cria o pool e o cliente Drizzle tipado pelo schema. */
export function createDb(databaseUrl: string): DbHandle {
  const pool = new Pool({
    connectionString: databaseUrl,
    // TODO: tunar pool (max, idleTimeout) por ambiente quando houver carga.
    max: 10,
  });

  return { db: makeDb(pool), pool };
}

/** Token de DI do handle do banco. */
export const DATABASE = Symbol("DATABASE");
