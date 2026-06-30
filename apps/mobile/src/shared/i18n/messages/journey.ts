/**
 * Namespace da jornada-norte: home (por estágio), barra de status, caminho,
 * auth, baseline, bilhete, Pix, check-in, settlement e a lição diária.
 */
export const journey = {
  pt: {
    home: {
      noAccountTitle: "Falta pouco. Cria sua conta.",
      noAccountBody:
        "Você já pesou e montou sua aposta. A conta trava tudo e garante que o prêmio cai no seu Pix.",
      noAccountCta: "Criar conta e continuar",

      noBaselineTitle: "Vamos ver de onde você parte",
      noBaselineBody:
        "A primeira pesagem é de graça, sem nada em jogo. É o seu ponto de partida e a sua primeira aula do protocolo.",
      noBaselineCta: "Fazer minha 1ª pesagem",

      reviewTitle: "Pesagem na revisão",
      reviewBody: "Seu vídeo está na fila. A gente confere e te avisa.",

      noBetTitle: "Você está em {{weight}} kg",
      noBetBody: "Número comprovado. Agora transforma isso em compromisso.",
      noBetCta: "Montar minha aposta",

      paymentTitle: "Falta só o Pix",
      paymentBody: "Sua aposta está montada. Confirma o Pix e ela entra em jogo.",
      paymentCta: "Ver o código Pix",

      checkinCta: "Registrar check-in",
      nextWeighIn: "Próxima pesagem em {{days}} dias",
      onTrack: "Você está no rumo. Faltam {{kg}} kg e {{days}} dias.",
      offTrack: "Apertou. Faltam {{kg}} kg em {{days}} dias — dá, mas sem afrouxar.",

      windowTitle: "Chegou a hora",
      windowBody: "Sua janela de pesagem abriu. É agora que vale o prêmio.",
      windowCta: "Pesar agora",

      finalReviewCta: "Acompanhar",
      resultCta: "Ver resultado",
      demoWindow: "demo: abrir a janela final",
      startEyebrow: "Bora?",
      reviewEyebrow: "Em revisão",
    },
    status: { inPlay: "Em jogo", days: "dias", streak: "streak" },
    path: { start: "Início", final: "Final" },
    meta: { label: "Meta", lose: "Perder {{kg}} kg", left: "−{{kg}} kg · {{pct}}%" },

    auth: {
      signInTitle: "Bora voltar",
      signUpTitle: "Aposte em você",
      signInBody: "Entra pra continuar de onde parou.",
      signUpBody:
        "Cria sua conta — rapidinho. É só pra salvar seu progresso e garantir que o prêmio chega em você.",
      name: "Seu nome",
      email: "Seu e-mail",
      password: "Senha",
      signIn: "Entrar",
      signUp: "Criar conta",
      toSignUp: "Não tem conta? Criar uma",
      toSignIn: "Já tem conta? Entrar",
      forgot: "Esqueci a senha",
      note: "Sua identidade de verdade a gente confere na pesagem, pelo vídeo.",
      errInvalid: "E-mail ou senha incorretos.",
      errTaken: "Esse e-mail já tem conta. Tenta entrar.",
      errWeak: "Senha muito curta — mínimo 8 caracteres.",
      errGeneric: "Algo deu errado. Tenta de novo.",
      errNetwork: "Não consegui falar com o servidor. Confere se a API está no ar e tenta de novo.",
      forgotTitle: "Recuperar senha",
      forgotBody: "Manda seu e-mail que enviamos um link pra criar uma senha nova.",
      forgotCta: "Enviar link",
      forgotSent: "Pronto. Se houver conta com esse e-mail, o link chegou.",
      back: "Voltar",
      resetTitle: "Nova senha",
      resetBody: "Cria uma senha nova pra sua conta.",
      newPassword: "Nova senha",
      resetCta: "Salvar senha",
      resetDone: "Senha trocada. Bora entrar.",
      signOut: "Sair da conta",
    },

    baseline: {
      eyebrow: "Partida",
      title: "Sua pesagem de partida",
      body: "De graça e sem nada em jogo — só registra de onde você parte.",
      note: "A prova em vídeo vem na pesagem final, quando tem dinheiro em jogo. Aqui é só o ponto de partida.",
      weightLabel: "Quanto a balança marcou? (kg)",
      weightPlaceholder: "ex.: 90,0",
      cta: "Registrar partida",
      recordCta: "Gravar a prova",
      protocol: "É um vídeo contínuo, sem cortes: o rosto, o código na tela + o gesto, a balança em 0,0, você subindo sem apoio, e o visor. Siga a ordem que aparece.",
    },

    bilhete: {
      eyebrow: "O bilhete",
      title: "Monta sua aposta",
      anchored: "Você está em {{weight}} kg, comprovado.",
      targetLabel: "Meta de peso (kg)",
      durationLabel: "Prazo",
      stakeLabel: "Quanto pôr em jogo",
      weeks: "{{n}} sem",
      hit: "Bateu: de volta + sua fatia do bolo",
      miss: "Não bateu: vai pro bolo de quem conseguiu",
      stakeHint: "Um empurrãozinho: agora dói desistir, sem desculpa.",
      cta: "Apostar {{money}} em mim",
      invalid: "Confere a meta e o valor — algo não fecha.",
    },

    pix: {
      eyebrow: "Pagamento",
      title: "Tá quase",
      body: "Copia o código e paga no seu banco. Assim que cair, sua aposta entra em jogo.",
      codeLabel: "Pix copia-e-cola",
      copy: "Copiar código",
      copied: "Copiado!",
      confirm: "Já paguei",
      waiting: "Aguardando seu Pix…",
    },

    checkin: {
      eyebrow: "Check-in",
      title: "Como você está hoje?",
      body: "Sem vídeo, sem revisão — é só pra você se acompanhar. Não conta como pesagem oficial.",
      weightLabel: "Peso de hoje (kg)",
      cta: "Registrar",
      done: "Anotado. Streak de {{n}} dias.",
    },

    settlement: {
      wonTitle: "DEU GREEN",
      wonBody: "Você bateu a meta. {{stake}} de volta + {{bonus}} do bolo, no seu Pix.",
      wonSource: "Sem mágica: o prêmio vem de quem desistiu.",
      lostTitle: "Não foi dessa vez",
      lostBody: "Você não bateu a meta. Seu {{stake}} vai pro bolo de quem conseguiu.",
      lostKind: "Sem humilhação — recomeçar faz parte. Agora você já sabe como é.",
      again: "Bora de novo",
      home: "Voltar pro início",
      wonEyebrow: "Vitória",
      lostEyebrow: "Próximo round",
    },

    lesson: { today: "Lição de hoje", minutes: "{{n}} min", cta: "Entendi" },
  },

  en: {
    home: {
      noAccountTitle: "Almost there. Create your account.",
      noAccountBody:
        "You've weighed in and built your bet. The account locks it in and makes sure the prize hits your Pix.",
      noAccountCta: "Create account & continue",

      noBaselineTitle: "Let's see where you start",
      noBaselineBody:
        "Your first weigh-in is free, with nothing on the line yet. It's your starting point and your first protocol lesson.",
      noBaselineCta: "Do my 1st weigh-in",

      reviewTitle: "Weigh-in under review",
      reviewBody: "Your video is in the queue. We'll check it and let you know.",

      noBetTitle: "You're at {{weight}} kg",
      noBetBody: "Verified number. Now turn it into commitment.",
      noBetCta: "Build my bet",

      paymentTitle: "Just the Pix left",
      paymentBody: "Your bet is set. Confirm the Pix and it's in play.",
      paymentCta: "See the Pix code",

      checkinCta: "Log a check-in",
      nextWeighIn: "Next weigh-in in {{days}} days",
      onTrack: "You're on track. {{kg}} kg and {{days}} days to go.",
      offTrack: "Tight. {{kg}} kg in {{days}} days — doable, no slacking.",

      windowTitle: "It's time",
      windowBody: "Your weigh-in window is open. This is what counts.",
      windowCta: "Weigh in now",

      finalReviewCta: "Track it",
      resultCta: "See result",
      demoWindow: "demo: open the final window",
      startEyebrow: "Ready?",
      reviewEyebrow: "In review",
    },
    status: { inPlay: "In play", days: "days", streak: "streak" },
    path: { start: "Start", final: "Final" },
    meta: { label: "Goal", lose: "Lose {{kg}} kg", left: "−{{kg}} kg · {{pct}}%" },

    auth: {
      signInTitle: "Welcome back",
      signUpTitle: "Bet on yourself",
      signInBody: "Sign in to pick up where you left off.",
      signUpBody:
        "Create your account — quick. Just to save your progress and make sure the prize reaches you.",
      name: "Your name",
      email: "Your email",
      password: "Password",
      signIn: "Sign in",
      signUp: "Create account",
      toSignUp: "No account? Create one",
      toSignIn: "Have an account? Sign in",
      forgot: "Forgot password",
      note: "Your real identity is checked at the weigh-in, by video.",
      errInvalid: "Wrong email or password.",
      errTaken: "That email already has an account. Try signing in.",
      errWeak: "Password too short — minimum 8 characters.",
      errGeneric: "Something went wrong. Try again.",
      errNetwork: "Couldn't reach the server. Check that the API is running and try again.",
      forgotTitle: "Reset password",
      forgotBody: "Send your email and we'll send a link to create a new password.",
      forgotCta: "Send link",
      forgotSent: "Done. If an account exists for that email, the link is on its way.",
      back: "Back",
      resetTitle: "New password",
      resetBody: "Create a new password for your account.",
      newPassword: "New password",
      resetCta: "Save password",
      resetDone: "Password changed. Let's sign in.",
      signOut: "Sign out",
    },

    baseline: {
      eyebrow: "Start line",
      title: "Your starting weigh-in",
      body: "Free and with nothing on the line — just to log where you start.",
      note: "The video proof comes at the final weigh-in, when there's money on the line. This is just your starting point.",
      weightLabel: "What did the scale show? (kg)",
      weightPlaceholder: "e.g.: 90.0",
      cta: "Log my start",
      recordCta: "Record the proof",
      protocol: "It's one continuous video, no cuts: your face, the code on screen + the gesture, the scale at 0.0, you stepping on without support, and the display. Follow the order shown.",
    },

    bilhete: {
      eyebrow: "The ticket",
      title: "Build your bet",
      anchored: "You're at {{weight}} kg, verified.",
      targetLabel: "Weight goal (kg)",
      durationLabel: "Deadline",
      stakeLabel: "How much to put in play",
      weeks: "{{n}} wk",
      hit: "Hit it: back + your slice of the pot",
      miss: "Miss it: goes to the pot of those who made it",
      stakeHint: "A nudge: now quitting hurts, no excuses.",
      cta: "Bet {{money}} on me",
      invalid: "Check the goal and the amount — something's off.",
    },

    pix: {
      eyebrow: "Payment",
      title: "Almost there",
      body: "Copy the code and pay in your bank. Once it lands, your bet is in play.",
      codeLabel: "Pix copy-paste",
      copy: "Copy code",
      copied: "Copied!",
      confirm: "I've paid",
      waiting: "Waiting for your Pix…",
    },

    checkin: {
      eyebrow: "Check-in",
      title: "How are you today?",
      body: "No video, no review — just for you to track yourself. Doesn't count as an official weigh-in.",
      weightLabel: "Today's weight (kg)",
      cta: "Log it",
      done: "Logged. {{n}}-day streak.",
    },

    settlement: {
      wonTitle: "GREEN!",
      wonBody: "You hit the goal. {{stake}} back + {{bonus}} from the pot, to your Pix.",
      wonSource: "No magic: the prize comes from those who quit.",
      lostTitle: "Not this time",
      lostBody: "You didn't hit the goal. Your {{stake}} goes to the pot of those who made it.",
      lostKind: "No shame — starting over is part of it. Now you know how it feels.",
      again: "Go again",
      home: "Back to start",
      wonEyebrow: "Victory",
      lostEyebrow: "Next round",
    },

    lesson: { today: "Today's lesson", minutes: "{{n}} min", cta: "Got it" },
  },
} as const;
