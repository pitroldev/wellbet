/** Nova aposta (bet/new.tsx): formulário + tela de pagamento (Pix). */
export const bet = {
  pt: {
    create: {
      title: "Nova aposta",
      body: "Aposte em você: defina sua meta e o valor. Você recupera o valor ao atingir a meta.",
      submit: "Criar aposta",
      submitting: "Criando…",
    },
    field: {
      target: "Meta de peso (kg)",
      targetPlaceholder: "ex.: 75",
      start: "Peso inicial (kg) — opcional",
      startPlaceholder: "ex.: 85",
      stake: "Valor da aposta (R$)",
      stakePlaceholder: "ex.: 100",
    },
    error: {
      target: "Informe uma meta de peso válida (kg).",
      start: "O peso inicial deve ser maior que a meta.",
      stake: "Informe o valor da aposta (R$).",
      create:
        "Não foi possível criar a aposta. Confira se seu perfil (CPF/Pix) está completo e tente de novo.",
    },
    pay: {
      title: "Pague para ativar",
      body: "Copie o código Pix e pague o valor da aposta. Assim que o pagamento cair, sua aposta fica ativa.",
      label: "Pix copia e cola",
      expires: "Expira em {{date}}.",
    },
  },
  en: {
    create: {
      title: "New bet",
      body: "Bet on yourself: set your goal and the amount. You get it back when you hit the goal.",
      submit: "Create bet",
      submitting: "Creating…",
    },
    field: {
      target: "Target weight (kg)",
      targetPlaceholder: "e.g. 75",
      start: "Starting weight (kg) — optional",
      startPlaceholder: "e.g. 85",
      stake: "Bet amount (R$)",
      stakePlaceholder: "e.g. 100",
    },
    error: {
      target: "Enter a valid target weight (kg).",
      start: "Starting weight must be greater than the target.",
      stake: "Enter the bet amount (R$).",
      create:
        "Couldn't create the bet. Check that your profile (CPF/Pix) is complete and try again.",
    },
    pay: {
      title: "Pay to activate",
      body: "Copy the Pix code and pay the bet amount. Once the payment lands, your bet goes active.",
      label: "Pix copy-and-paste",
      expires: "Expires on {{date}}.",
    },
  },
} as const;
