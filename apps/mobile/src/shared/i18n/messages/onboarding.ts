/** Onboarding: boas-vindas (index) + guia de captura (capture-guide). */
export const onboarding = {
  pt: {
    welcome: {
      eyebrow: "Bora?",
      title: "Quanto você apostaria em você?",
      body: "Você põe dinheiro real na sua meta de peso. É esse risco que te faz cumprir — não mais uma promessa de ano-novo.",
      hitTitle: "Bateu a meta",
      hit: "recebe de volta + sua fatia do bolo, no Pix.",
      missTitle: "Não bateu",
      miss: "seu valor vai pro bolo de quem conseguiu. Por isso dói.",
      proof:
        "Cada pesagem é gravada em vídeo e revisada por gente. Sem trapaça, sem balança maquiada.",
      cta: "Bora começar",
    },
    guide: {
      eyebrow: "A prova",
      title: "Um vídeo, sem cortes",
      body: "A pesagem é a prova do seu green: um take contínuo, na ordem abaixo. É o que garante que o resultado é seu de verdade.",
      steps: {
        s1: "Mostre o rosto de frente.",
        s2: "Mostre o código na tela e faça o gesto pedido.",
        s3: "Filme a balança vazia marcando 0,0.",
        s4: "Mostre o piso e os 4 pés da balança, chão nivelado.",
        s5: "Suba na balança, mãos à vista, sem apoio.",
        s6: "Aproxime o visor: número saindo do zero até o peso.",
      },
      cta: "Entendi, bora",
    },
  },
  en: {
    welcome: {
      eyebrow: "Ready?",
      title: "How much would you bet on yourself?",
      body: "You put real money on your weight goal. It's that risk that makes you follow through — not just another New Year's promise.",
      hitTitle: "Hit the goal",
      hit: "get it back + your slice of the pot, via Pix.",
      missTitle: "Missed it",
      miss: "your money goes to whoever made it. That's why it stings.",
      proof:
        "Every weigh-in is recorded on video and reviewed by a person. No cheating, no rigged scale.",
      cta: "Let's start",
    },
    guide: {
      eyebrow: "The proof",
      title: "One video, no cuts",
      body: "The weigh-in is the proof of your green: one continuous take, in the order below. It's what makes the result truly yours.",
      steps: {
        s1: "Show your face from the front.",
        s2: "Show the code on screen and make the requested gesture.",
        s3: "Film the empty scale reading 0.0.",
        s4: "Show the floor and the scale's 4 feet on level ground.",
        s5: "Step on the scale, hands in view, no support.",
        s6: "Zoom into the display: the number rising from zero to your weight.",
      },
      cta: "Got it, let's go",
    },
  },
} as const;
