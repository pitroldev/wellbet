/** Perfil (profile.tsx): CPF/CNPJ + chave Pix + troca de idioma. */
export const profile = {
  pt: {
    title: "Seu perfil",
    body: "CPF/CNPJ e chave Pix são necessários para apostar e receber o prêmio.",
    field: {
      taxId: "CPF/CNPJ",
      taxIdPlaceholder: "000.000.000-00",
      pix: "Chave Pix",
      pixPlaceholder: "CPF, e-mail, telefone ou chave aleatória",
    },
    error: {
      required: "Preencha o CPF/CNPJ e a chave Pix.",
      save: "Não foi possível salvar. Tente novamente.",
    },
  },
  en: {
    title: "Your profile",
    body: "CPF/CNPJ and a Pix key are required to bet and receive your prize.",
    field: {
      taxId: "CPF/CNPJ",
      taxIdPlaceholder: "000.000.000-00",
      pix: "Pix key",
      pixPlaceholder: "CPF, email, phone or random key",
    },
    error: {
      required: "Fill in the CPF/CNPJ and the Pix key.",
      save: "Couldn't save. Try again.",
    },
  },
} as const;
