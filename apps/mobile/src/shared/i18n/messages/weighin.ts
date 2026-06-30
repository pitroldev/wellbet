/** Fluxo de pesagem: weighin/index, result e os overlays de captura/câmera. */
export const weighin = {
  pt: {
    noBet: {
      title: "Nenhuma aposta ativa",
      body: "Crie uma aposta e ponha seu valor em jogo para começar a pesar.",
      cta: "Criar aposta",
    },
    done: {
      title: "Pesagens concluídas",
      body: "Você já fez as 3 pesagens desta aposta. Aguarde o resultado.",
    },
    error: {
      title: "Algo deu errado",
      retry: "Tentar de novo",
      start: "Não foi possível iniciar a pesagem.",
      session: "Sessão inválida.",
      upload: "Falha no envio. Tente novamente.",
    },
    uploading: {
      title: "Enviando o vídeo…",
      caption: "Mantemos tentando mesmo com a conexão instável.",
    },
    weightGate: {
      title: "Qual o seu peso?",
      body: "Informe o peso que a balança mostra. Você vai prová-lo no vídeo a seguir.",
      label: "Peso (kg)",
      placeholder: "ex.: 82,5",
      invalid: "Informe o peso que a balança mostra (kg).",
      cta: "Continuar para a gravação",
    },
    preparing: {
      title: "Preparando a pesagem…",
      caption: "Gerando o código de verificação.",
    },
    result: {
      title: "Pesagem enviada!",
      subtitle: "Sua pesagem está em revisão. Avisamos assim que for validada.",
    },
    // Câmera + overlays (mantidos sóbrios; só rótulos).
    camera: {
      permTitle: "Precisamos da câmera e do microfone",
      permBody: "A pesagem é gravada dentro do app. Não é possível enviar vídeo da galeria.",
      permCta: "Conceder acesso",
      unavailable: "Câmera indisponível",
      start: "Iniciar gravação",
      stop: "Encerrar gravação",
    },
    steps: {
      progress: "Etapa {{current}} de {{total}}",
      face: "Mostre o rosto de frente",
      challenge: "Mostre o código e faça o gesto",
      scaleZero: "Balança vazia marcando 0,0",
      floor: "Mostre o piso e os 4 pés da balança",
      body: "Suba na balança, mãos à vista, sem apoio",
      display: "Aproxime o visor: número saindo do zero",
    },
    code: {
      prompt: "Mostre este código e faça o gesto",
      gesture: "Gesto: {{gesture}}",
      gestures: {
        thumbs_up: "joinha (polegar para cima)",
        open_palm: "palma da mão aberta",
        peace_sign: "sinal de paz (dois dedos)",
        wave: "acenar",
        point_up: "apontar para cima",
      },
    },
  },
  en: {
    noBet: {
      title: "No active bet",
      body: "Create a bet and put your money in play to start weighing in.",
      cta: "Create bet",
    },
    done: {
      title: "Weigh-ins complete",
      body: "You've completed all 3 weigh-ins for this bet. Wait for the result.",
    },
    error: {
      title: "Something went wrong",
      retry: "Try again",
      start: "Couldn't start the weigh-in.",
      session: "Invalid session.",
      upload: "Upload failed. Try again.",
    },
    uploading: {
      title: "Uploading the video…",
      caption: "We keep retrying even on a shaky connection.",
    },
    weightGate: {
      title: "What's your weight?",
      body: "Enter the weight shown on the scale. You'll prove it in the video next.",
      label: "Weight (kg)",
      placeholder: "e.g. 82.5",
      invalid: "Enter the weight shown on the scale (kg).",
      cta: "Continue to recording",
    },
    preparing: {
      title: "Preparing the weigh-in…",
      caption: "Generating the verification code.",
    },
    result: {
      title: "Weigh-in submitted!",
      subtitle: "Your weigh-in is under review. We'll let you know once it's validated.",
    },
    camera: {
      permTitle: "We need the camera and microphone",
      permBody: "The weigh-in is recorded inside the app. You can't upload video from the gallery.",
      permCta: "Grant access",
      unavailable: "Camera unavailable",
      start: "Start recording",
      stop: "Stop recording",
    },
    steps: {
      progress: "Step {{current}} of {{total}}",
      face: "Show your face from the front",
      challenge: "Show the code and make the gesture",
      scaleZero: "Empty scale reading 0.0",
      floor: "Show the floor and the scale's 4 feet",
      body: "Step on the scale, hands in view, no support",
      display: "Zoom into the display: number rising from zero",
    },
    code: {
      prompt: "Show this code and make the gesture",
      gesture: "Gesture: {{gesture}}",
      gestures: {
        thumbs_up: "thumbs up",
        open_palm: "open palm",
        peace_sign: "peace sign (two fingers)",
        wave: "wave",
        point_up: "point up",
      },
    },
  },
} as const;
