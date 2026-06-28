/** Onboarding: boas-vindas (index) + guia de captura (capture-guide). */
export const onboarding = {
  pt: {
    welcome: {
      title: "Bem-vindo ao Charya",
      body: "Você aposta no seu próprio emagrecimento. A pesagem é gravada no app e revisada por uma pessoa.",
      cta: "Como gravar a pesagem",
    },
    guide: {
      title: "Um único vídeo, sem cortes",
      body: "A pesagem é um take contínuo gravado no app. Siga a ordem:",
      steps: {
        1: "Mostre o rosto de frente.",
        2: "Mostre o código na tela e faça o gesto pedido.",
        3: "Filme a balança vazia marcando 0,0.",
        4: "Mostre o piso e os 4 pés da balança, chão nivelado.",
        5: "Suba na balança, mãos à vista, sem apoio.",
        6: "Aproxime o visor: número saindo do zero até o peso.",
      },
      cta: "Entendi, começar",
    },
  },
  en: {
    welcome: {
      title: "Welcome to Charya",
      body: "You bet on your own weight loss. The weigh-in is recorded in the app and reviewed by a person.",
      cta: "How to record the weigh-in",
    },
    guide: {
      title: "One single video, no cuts",
      body: "The weigh-in is one continuous take recorded in the app. Follow the order:",
      steps: {
        1: "Show your face from the front.",
        2: "Show the code on screen and make the requested gesture.",
        3: "Film the empty scale reading 0.0.",
        4: "Show the floor and the scale's 4 feet on level ground.",
        5: "Step on the scale, hands in view, no support.",
        6: "Zoom into the display: the number rising from zero to your weight.",
      },
      cta: "Got it, let's start",
    },
  },
} as const;
