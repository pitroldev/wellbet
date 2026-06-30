"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import {
  criteriaControllerCreate,
  criteriaControllerList,
  criteriaControllerUpdate,
  type CreateCriterionDto,
  type CriterionResponseDto,
  type UpdateCriterionDto,
} from "@charya/contracts";

/**
 * Hooks de TanStack Query dos critérios de aprovação (config global).
 *
 * Usa o SDK tipado de `@charya/contracts` (gerado do OpenAPI da api). O console
 * lista TODOS (inclui desabilitados); o checklist da revisão usa `enabledOnly`.
 */
export const criteriaKeys = {
  all: ["criteria"] as const,
  list: (enabledOnly: boolean) => [...criteriaKeys.all, "list", enabledOnly] as const,
};

export function useCriteria(opts?: { enabledOnly?: boolean }): UseQueryResult<CriterionResponseDto[]> {
  const enabledOnly = opts?.enabledOnly ?? false;
  return useQuery({
    queryKey: criteriaKeys.list(enabledOnly),
    queryFn: async () => {
      const { data } = await criteriaControllerList({
        query: enabledOnly ? { enabledOnly: true } : {},
        throwOnError: true,
      });
      return data;
    },
  });
}

export function useCreateCriterion(): UseMutationResult<
  CriterionResponseDto,
  Error,
  CreateCriterionDto
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateCriterionDto) => {
      const { data } = await criteriaControllerCreate({ body, throwOnError: true });
      return data;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: criteriaKeys.all }),
  });
}

export function useUpdateCriterion(): UseMutationResult<
  CriterionResponseDto,
  Error,
  { id: string; patch: UpdateCriterionDto }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }) => {
      const { data } = await criteriaControllerUpdate({
        path: { id },
        body: patch,
        throwOnError: true,
      });
      return data;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: criteriaKeys.all }),
  });
}
