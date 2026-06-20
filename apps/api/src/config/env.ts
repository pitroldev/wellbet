/**
 * Re-export tipado de @charya/env para o backend.
 *
 * A fronteira de env vive em packages/env (t3-env / Standard Schema): a
 * aplicação NÃO sobe com env inválida. Aqui só re-exportamos o objeto já
 * validado e o tipo, para que o resto da api importe de um lugar só
 * (`@/config/env`) em vez de acoplar a cada módulo ao pacote externo.
 *
 * Importamos do subpath `@charya/env/server` (NUNCA do barrel `@charya/env`):
 * o barrel reexporta também `clientEnv` (NEXT_PUBLIC_*), e puxá-lo arrastaria o
 * schema de cliente para o boot do backend. O subpath isola o servidor.
 *
 * Espera-se que `@charya/env/server` exponha `serverEnv` (objeto validado) e o
 * tipo `ServerEnv`. Caso o pacote ainda não exista no momento da instalação, o
 * type-check apontará exatamente aqui — fronteira única e explícita.
 */
import { serverEnv, type ServerEnv } from "@charya/env/server";

export const env: ServerEnv = serverEnv;
export type Env = ServerEnv;

/** Chave usada pelo ConfigModule do Nest para injetar a env tipada. */
export const ENV = Symbol("CHARYA_ENV");
