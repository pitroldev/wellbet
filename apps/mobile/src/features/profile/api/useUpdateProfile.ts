/**
 * Define CPF/CNPJ + chave Pix (PUT /me/profile). Pré-requisito para apostar e
 * sacar — a api valida e exige ambos antes de criar/pagar aposta.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  identityControllerSetProfile,
  type MeResponseDto,
  type UpdateProfileDto,
} from "@charya/contracts";

import { profileKeys } from "./useMe";

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["me", "update-profile"],
    mutationFn: async (vars: UpdateProfileDto): Promise<MeResponseDto> => {
      const { data } = await identityControllerSetProfile({ body: vars, throwOnError: true });
      return data;
    },
    onSuccess: (data) => {
      // Atualiza o cache do /me com o perfil recém-salvo (sem re-fetch).
      qc.setQueryData(profileKeys.me, data);
    },
  });
}
