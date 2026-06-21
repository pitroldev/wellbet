/**
 * Perfil do usuário autenticado (GET /me). O backend faz get-or-create no 1º
 * acesso, então um usuário novo volta com `taxId`/`pixKey` nulos.
 */
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { identityControllerMe, type MeResponseDto } from "@charya/contracts";

export const profileKeys = {
  me: ["me"] as const,
};

export function useMe(): UseQueryResult<MeResponseDto> {
  return useQuery({
    queryKey: profileKeys.me,
    queryFn: async () => {
      const { data } = await identityControllerMe({ throwOnError: true });
      return data;
    },
  });
}
