"use client";

import * as React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";

/**
 * Providers globais do app (Client boundary).
 * Por ora: TanStack Query. O QueryClient é obtido via `getQueryClient()` —
 * singleton no browser, novo por request no server.
 */
export function Providers({ children }: { children: React.ReactNode }): React.JSX.Element {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
