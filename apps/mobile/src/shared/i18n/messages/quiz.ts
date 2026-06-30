/** Quiz de personalização do onboarding (Noom): objetivo, porquê, o que travou. */
export const quiz = {
  pt: {
    eyebrow: "Antes de começar",
    intro: "3 perguntas rápidas pra deixar isso com a sua cara.",
    step: "{{current}} de {{total}}",

    goalQ: "Qual é o seu objetivo?",
    goal: {
      lose: "Perder peso",
      health: "Cuidar da saúde",
      confidence: "Me sentir bem comigo",
      event: "Chegar pronto numa data",
    },

    whyQ: "Por que isso? E por quem?",
    whyPlaceholder: "ex.: correr atrás do meu filho sem cansar",
    whyHint: "Vou te lembrar disso quando bater a vontade de amolecer.",

    blockerQ: "O que te travou das outras vezes?",
    blocker: {
      consistency: "Falta de constância",
      motivation: "A motivação some no meio",
      stress: "Ansiedade / comer por estresse",
      alone: "Fazer tudo sozinho",
    },

    next: "Continuar",
    finish: "Montar meu plano",
  },
  en: {
    eyebrow: "Before we start",
    intro: "3 quick questions to make this yours.",
    step: "{{current}} of {{total}}",

    goalQ: "What's your goal?",
    goal: {
      lose: "Lose weight",
      health: "Take care of my health",
      confidence: "Feel good in my skin",
      event: "Be ready for a date",
    },

    whyQ: "Why this? And for whom?",
    whyPlaceholder: "e.g.: keep up with my kid without getting tired",
    whyHint: "I'll throw this back at you when you feel like quitting.",

    blockerQ: "What stopped you the other times?",
    blocker: {
      consistency: "Lack of consistency",
      motivation: "Motivation fades",
      stress: "Anxiety / stress eating",
      alone: "Doing it all alone",
    },

    next: "Continue",
    finish: "Build my plan",
  },
} as const;
