/**
 * Conteúdo das lições diárias (Noom) — psicologia da mudança na voz do treinador
 * durão (Manual §3). Local, sem backend. pt-BR primeiro; en é evolução.
 */
export interface Lesson {
  id: string;
  title: string;
  body: string;
  minutes: number;
}

const PRIMER: Lesson = {
  id: "weekend",
  title: "Fim de semana não é folga da meta",
  minutes: 2,
  body: "Sexta à noite o cérebro sussurra que segunda você recomeça. Mentira velha. O fim de semana é onde a meta se ganha ou se perde — são 2 dias de 7, quase 30% da sua semana. Não precisa ser santo: precisa não zerar o progresso. Escolhe UMA refeição pra relaxar, não o fim de semana inteiro.",
};

export const LESSONS: Lesson[] = [
  PRIMER,
  {
    id: "relapse",
    title: "Escorregou? Não é o fim",
    minutes: 2,
    body: "Você furou. E daí? Um deslize não apaga 10 dias bons — só apaga se você usar ele de desculpa pra desistir. O erro não é comer demais num dia; é deixar um dia virar uma semana. Amanhã não é \"recomeço do zero\", é só o próximo dia. Segue.",
  },
  {
    id: "plateau",
    title: "O platô assusta — e mente",
    minutes: 2,
    body: "A balança travou e seu cérebro grita que não adianta. Ele tá mentindo. Platô é o corpo se ajustando — gordura sai, água entra, o número esconde por uns dias. Continua o processo: o número destrava. Quem desiste no platô desiste a dois passos da linha de chegada.",
  },
  {
    id: "why",
    title: "Lembra por que você começou",
    minutes: 1,
    body: "Você escreveu seu porquê lá no começo. Lê de novo, agora. Não é pela balança — é por aquilo. Quando bater a vontade de amolecer, não é a meta que você abandona. É aquilo.",
  },
  {
    id: "trigger",
    title: "Conheça o seu gatilho",
    minutes: 2,
    body: "Quase nunca é fome. É tédio, é estresse, é o sofá às 22h. Identifica o teu gatilho — a hora, o lugar, a emoção — e você tira metade do poder dele. O que você não nomeia, te controla.",
  },
  {
    id: "stake",
    title: "Por que ter dinheiro em jogo funciona",
    minutes: 1,
    body: "Perder dói mais que ganhar — bem mais. Você não está aqui sonhando com o prêmio; está aqui pra não perder o que pôs em jogo. Isso não é truque: é o que transforma \"eu devia\" em \"eu fiz\". Usa a favor.",
  },
];

/** A próxima lição: a 1ª ainda não vista; se viu todas, recicla em ordem. */
export function nextLesson(seenIds: string[]): Lesson {
  return (
    LESSONS.find((l) => !seenIds.includes(l.id)) ??
    LESSONS[seenIds.length % LESSONS.length] ??
    PRIMER
  );
}

export function lessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}
