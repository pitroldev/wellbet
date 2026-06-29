/** Onboarding: boas-vindas (index) + guia de captura (capture-guide). */
export const onboarding = {
  pt: {
    welcome: {
      title: "Bem-vindo ao WellBet",
      body: "Você aposta no seu próprio emagrecimento. A pesagem é gravada no app e revisada por uma pessoa.",
      cta: "Como gravar a pesagem",
    },
    guide: {
      title: "Um único vídeo, sem cortes",
      body: "A pesagem é um take contínuo gravado no app. Siga a ordem:",
      steps: {
        s1: "Mostre o rosto de frente.",
        s2: "Mostre o código na tela e faça o gesto pedido.",
        s3: "Filme a balança vazia marcando 0,0.",
        s4: "Mostre o piso e os 4 pés da balança, chão nivelado.",
        s5: "Suba na balança, mãos à vista, sem apoio.",
        s6: "Aproxime o visor: número saindo do zero até o peso.",
      },
      cta: "Entendi, começar",
    },
  },
  en: {
    welcome: {
      title: "Welcome to WellBet",
      body: "You bet on your own weight loss. The weigh-in is recorded in the app and reviewed by a person.",
      cta: "How to record the weigh-in",
    },
    guide: {
      title: "One single video, no cuts",
      body: "The weigh-in is one continuous take recorded in the app. Follow the order:",
      steps: {
        s1: "Show your face from the front.",
        s2: "Show the code on screen and make the requested gesture.",
        s3: "Film the empty scale reading 0.0.",
        s4: "Show the floor and the scale's 4 feet on level ground.",
        s5: "Step on the scale, hands in view, no support.",
        s6: "Zoom into the display: the number rising from zero to your weight.",
      },
      cta: "Got it, let's start",
    },
  },
} as const;
