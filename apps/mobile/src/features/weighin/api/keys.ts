/** Query keys do domínio de pesagem (TanStack Query). */
export const weighInKeys = {
  all: ["weighin"] as const,
  session: (id: string) => [...weighInKeys.all, "session", id] as const,
  challenge: (sessionId: string) => [...weighInKeys.all, "challenge", sessionId] as const,
} as const;
