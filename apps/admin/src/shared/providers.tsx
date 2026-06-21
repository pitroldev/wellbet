"use client";

import * as React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { setupApiClient } from "@/shared/api/http";
import { getQueryClient } from "@/lib/query-client";

// Configura o cliente tipado de @charya/contracts no carregamento do módulo
// (client boundary). Idempotente.
setupApiClient();

/**
 * Providers globais do app (Client boundary).
 * Por ora: TanStack Query. O QueryClient é obtido via `getQueryClient()` —
 * singleton no browser, novo por request no server.
 */
export function Providers({ children }: { children: React.ReactNode }): React.JSX.Element {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
