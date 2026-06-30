"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import {
  adminUserControllerBan,
  adminUserControllerDetail,
  adminUserControllerList,
  adminUserControllerResetPassword,
  adminUserControllerUnban,
  adminUserControllerUpdate,
  type ListUsersResponseDto,
  type UpdateUserDto,
  type UserDetailDto,
} from "@charya/contracts";

export type AdminUserRow = ListUsersResponseDto["items"][number];
export type UserRole = AdminUserRow["role"];

/** Hooks de gestão de usuários (suporte) sobre o SDK @charya/contracts. */
export const userKeys = {
  all: ["users"] as const,
  list: (q: string, role?: string) => [...userKeys.all, "list", q, role ?? "all"] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
};

export function useUsers(params: {
  q: string;
  role?: UserRole;
}): UseQueryResult<ListUsersResponseDto> {
  return useQuery({
    queryKey: userKeys.list(params.q, params.role),
    queryFn: async () => {
      const { data } = await adminUserControllerList({
        query: {
          ...(params.q.trim() ? { q: params.q.trim() } : {}),
          ...(params.role ? { role: params.role } : {}),
        },
        throwOnError: true,
      });
      return data;
    },
    refetchOnWindowFocus: true,
  });
}

export function useUserDetail(authUserId: string | null): UseQueryResult<UserDetailDto> {
  return useQuery({
    queryKey: userKeys.detail(authUserId ?? ""),
    queryFn: async () => {
      const { data } = await adminUserControllerDetail({
        path: { authUserId: authUserId ?? "" },
        throwOnError: true,
      });
      return data;
    },
    enabled: authUserId != null,
  });
}

export function useUpdateUser(): UseMutationResult<
  UserDetailDto,
  Error,
  { authUserId: string; patch: UpdateUserDto }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ authUserId, patch }) => {
      const { data } = await adminUserControllerUpdate({
        path: { authUserId },
        body: patch,
        throwOnError: true,
      });
      return data;
    },
    onSuccess: (_data, { authUserId }) => {
      void qc.invalidateQueries({ queryKey: userKeys.detail(authUserId) });
      void qc.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useResetPassword(): UseMutationResult<{ sent: boolean }, Error, string> {
  return useMutation({
    mutationFn: async (authUserId: string) => {
      const { data } = await adminUserControllerResetPassword({
        path: { authUserId },
        throwOnError: true,
      });
      return data;
    },
  });
}

export function useBanUser(): UseMutationResult<
  UserDetailDto,
  Error,
  { authUserId: string; ban: boolean; reason?: string }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ authUserId, ban, reason }) => {
      const { data } = ban
        ? await adminUserControllerBan({ path: { authUserId }, body: { reason }, throwOnError: true })
        : await adminUserControllerUnban({ path: { authUserId }, throwOnError: true });
      return data;
    },
    onSuccess: (_data, { authUserId }) => {
      void qc.invalidateQueries({ queryKey: userKeys.detail(authUserId) });
      void qc.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
