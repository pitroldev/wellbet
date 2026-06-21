import { createZodDto } from "nestjs-zod";
import { z } from "zod";

/** Resposta do perfil do usuário autenticado. */
export const MeResponseSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string().nullable(),
  role: z.enum(["user", "reviewer", "admin"]),
  /** CPF/CNPJ (só dígitos) e chave Pix — necessários para apostar/sacar. */
  taxId: z.string().nullable(),
  pixKey: z.string().nullable(),
});
export class MeResponseDto extends createZodDto(MeResponseSchema) {}

/**
 * Atualização do perfil de pagamento. O `taxId` é normalizado para só dígitos
 * (11 = CPF, 14 = CNPJ); a `pixKey` é validada de verdade no payout (DICT).
 */
export const UpdateProfileSchema = z.object({
  taxId: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 11 || v.length === 14, "CPF/CNPJ inválido."),
  pixKey: z.string().trim().min(1).max(140),
});
export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) {}
