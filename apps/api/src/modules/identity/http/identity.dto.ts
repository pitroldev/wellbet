import { createZodDto } from "nestjs-zod";
import { z } from "zod";

/** Resposta do perfil do usuário autenticado. */
export const MeResponseSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string().nullable(),
  role: z.enum(["user", "reviewer", "admin"]),
});
export class MeResponseDto extends createZodDto(MeResponseSchema) {}
