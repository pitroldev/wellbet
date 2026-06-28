/** Home (app/index.tsx) + histórico de pesagens (WeighInHistoryList). */
export const home = {
  pt: {
    title: "Charya",
    tagline: "Aposte em você. Emagreça de verdade.",
    weighinsTitle: "Suas pesagens",
    newBet: "Nova aposta",
    newWeighin: "Nova pesagem",
    myProfile: "Meu perfil",
    howItWorks: "Como funciona",
    history: {
      empty: "Nenhuma pesagem ainda.",
      kind: {
        baseline: "T0",
        mid: "T1",
        final: "T2",
      },
      status: {
        pending: "Recebida",
        blocked: "Bloqueada",
        in_review: "Em revisão",
        approved: "Aprovada",
        rejected: "Reprovada",
        recapture: "Recapturar",
      },
    },
  },
  en: {
    title: "Charya",
    tagline: "Bet on yourself. Lose weight for real.",
    weighinsTitle: "Your weigh-ins",
    newBet: "New bet",
    newWeighin: "New weigh-in",
    myProfile: "My profile",
    howItWorks: "How it works",
    history: {
      empty: "No weigh-ins yet.",
      kind: {
        baseline: "T0",
        mid: "T1",
        final: "T2",
      },
      status: {
        pending: "Received",
        blocked: "Blocked",
        in_review: "In review",
        approved: "Approved",
        rejected: "Rejected",
        recapture: "Recapture",
      },
    },
  },
} as const;
