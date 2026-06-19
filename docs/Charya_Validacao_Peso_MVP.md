# Charya Bet — Validação de Peso no MVP (manual-first)

> **Escopo:** especificação do mecanismo de comprovação de peso **na primeira versão real do produto**. Abordagem **manual-first**: o mínimo de software para capturar evidência boa, e **revisão humana de 100% das pesagens** como detector de fraude. Captura só por **smartphone**.

---

## 1. Princípio do MVP

> **No lançamento há pouquíssimas pesagens e pouquíssimos prêmios. Revisão humana de tudo é viável — e é a forma certa de descobrir como a fraude realmente se parece antes de gastar engenharia automatizando contra ela.**

Consequências de design:

- **Não construímos** OCR, forense de vídeo, engine estatístico ou face match automatizado agora. São substituições de tarefas humanas — construídas na Fase 2, quando o **humano virar gargalo** e já houver dados.
- O software do MVP faz só **três coisas**: gravar evidência confiável, gerar o desafio dinâmico, e aplicar **uma** regra dura de sanidade.
- Todo o resto é **julgamento humano guiado por checklist**.

Objetivo: tornar a fraude cara/arriscada o suficiente para que **emagrecer de verdade seja o caminho mais fácil**, com custo de engenharia próximo de zero.

---

## 2. O que o MVP entrega (e só isso)

| # | Componente | Tipo | Custo |
|---|---|---|---|
| C1 | Gravação de vídeo **dentro do app** (bloqueia upload da galeria) | Software | baixo |
| C2 | **Código dinâmico** exibido ao vivo na captura | Software | baixo |
| C3 | **Revisão humana de 100%** das pesagens | Operação | médio (ok no volume baixo) |
| C4 | **Uma regra dura** de plausibilidade (bloqueio de perda absurda) | Software | ~zero |

Nada além disso entra no MVP.

---

## 3. As 3 capturas

Procedimento idêntico em todas — sem captura de "menor rigor":

| Captura | Quando | Papel |
|---|---|---|
| `T0` baseline | início | ponto de partida (inflar aqui falsifica todo o delta) |
| `T1` intermediária | meio | confirma evolução gradual |
| `T2` final | fim | define o prêmio — máximo incentivo de fraude |

---

## 4. Roteiro de captura (o que o app exige no vídeo)

Um **único vídeo contínuo, sem cortes**, gravado pela câmera do app, contendo nesta ordem:

1. **Rosto** da pessoa, de frente.
2. **Código dinâmico** na tela (palavra + número + gesto pedido na hora) — pessoa mostra e executa o gesto.
3. **Balança vazia** no chão, exibindo **0,0**.
4. **Piso e base** da balança (4 pés apoiados, chão plano e nivelado).
5. **Corpo inteiro** subindo, mãos à vista, sem apoio em parede/móvel.
6. **Visor em close**, número estabilizando do zero até o peso.

O app **gera o código** (C2) e **força a gravação interna** (C1). O resto é roteiro que o usuário segue e o **revisor confere** (C3).

---

## 5. Como cada item é validado no MVP (checklist do revisor)

No MVP a validação de cada item é **feita por uma pessoa**, com critério objetivo. Este é o checklist que o revisor aplica a cada pesagem:

| Item a validar | O que o revisor confere | Reprova quando |
|---|---|---|
| **Frescor / anti-replay** | O código dinâmico no vídeo é o mesmo que o app emitiu para esta sessão, e o gesto foi feito | Código errado/ausente, gesto não feito |
| **Vídeo contínuo** | Take único, sem corte/emenda; gravado no app (não upload) | Cortes, reencode de editor, origem externa |
| **Balança zerada (âncora do instrumento)** | Antes de subir, balança vazia marca **0,0 limpo e estável**; mostra o número saindo do zero ao subir | Não mostra o zero, zero instável/deslocado, ou não está vazia |
| **Piso/cena** | Chão plano e nivelado, balança não inclinada, sem calço/tapete grosso | Piso torto, balança tombada, calço aparente |
| **Sem truque de corpo** | Sobe sem apoio, mãos visíveis, peso estável | Apoio em parede/móvel, descarga de peso |
| **Visor íntegro** | Número se firma do zero; sem visor sobreposto (borda/reflexo/fonte estranhos) | Sinais de display falso |
| **Mesma pessoa** | Rosto bate entre `T0`, `T1`, `T2` (comparação visual dos 3 vídeos) | Pessoa diferente entre capturas |
| **Plausibilidade** | A perda faz sentido fisiológico para o prazo/perfil | Perda incompatível → ver §6 |

**Decisão do revisor:** `APROVADO` · `PENDENTE` (pede recaptura com orientação) · `REPROVADO`.

> No MVP, **identidade é validada pelo próprio revisor** comparando os 3 vídeos — Liveness entra só na Fase 2.

---

## 6. A única regra automática (sanidade)

Antes de chegar ao revisor, o sistema aplica **uma** checagem dura, para barrar o absurdo sem gastar tempo humano:

```
perda_por_semana = (peso_anterior − peso_atual) / semanas
se perda_por_semana > LIMITE_DURO:
    → BLOQUEIO automático (perda fisiologicamente impossível)
```

`LIMITE_DURO` calibrado folgado (só pega o claramente impossível, ex.: "18 kg em 20 dias"). Tudo abaixo disso segue para o revisor. **Não há engine, score ou estatística de curva no MVP**, isso é Fase 2.

---

## 7. Veredito

| Estado | Significado | Ação |
|---|---|---|
| `APROVADO` | Revisor validou o checklist; regra de sanidade passou. | Settlement segue. |
| `PENDENTE` | Algo no checklist ficou dúbio ou faltou frame. | Recaptura orientada → revisor reavalia. |
| `REPROVADO` | Fraude clara no checklist, ou bloqueio da regra dura. | Recusa conforme termos. |

Política: **na dúvida, `PENDENTE`** — nunca aprovar no susto, nunca reprovar honesto por vídeo ruim.

---

## 8. O que NÃO está no MVP (vai para a Fase 2)

Tudo abaixo são **automações de tarefas que o humano faz no MVP**, construídas só quando o volume justificar:

| Fora do MVP | Substitui (no MVP é feito por) |
|---|---|
| **Objeto de peso conhecido** (calibração ad-hoc do instrumento) | no MVP, a honestidade da balança é ancorada **só pelo zero** (balança vazia em 0,0) |
| OCR automático do visor | revisor lê o número |
| Forense de vídeo (corte/edição automáticos) | revisor percebe corte; app força gravação interna |
| Engine de plausibilidade (taxa + curva + consistência) | revisor + regra dura |
| Face match / liveness comprado | revisor compara os 3 vídeos |
| Classificador automático de tipo de balança | revisor vê se é digital |
| Detecção automática de gesto/pose | revisor confere o gesto |
| Cascateamento automático de 3 camadas | fila única de revisão humana |

---

## 9. O MVP também coleta dados para a Fase 2

Revisão humana de 100% não é só defesa, é a **fonte de treino**. Para cada pesagem, registrar:

- veredito do revisor + motivo;
- quais itens do checklist (§5) falharam;
- exemplos rotulados de fraude real encontrada.

Esse rótulo humano é o **dataset** que torna possível automatizar tudo das próximas fases com precisão, e que diz **quais** automações valem a pena primeiro (as que mais consomem tempo do revisor).

---

## 10. Risco residual aceito no MVP

- **"Peso de água"** (encher de líquido/sal/comida antes do baseline, desidratar antes do final): corpo real, vídeo honesto, balança correta. Nenhum controle de captura pega, só a regra de sanidade (§6) e a **janela de pesagem sorteada pelo app** atenuam. É o vetor de maior atenção.
- **Balança com erro de ganho/escala (span):** sem o objeto de peso conhecido, uma balança que **zera certo mas marca com fator errado sob carga** (ex.: lê 5% a menos) não é pega pelo zero. É o preço de tirar o objeto do MVP, atenuado pela regra de sanidade (§6) e pela revisão humana, e fechado de vez quando o objeto entrar (Fase 2). Decisão consciente para enxugar o MVP.
- **Fraude artesanal individual de alto esforço:** aceita enquanto o custo do golpe superar o prêmio, que é o objetivo do desenho.

---

## 11. Parâmetros a calibrar

| Parâmetro | Onde | Significado |
|---|---|---|
| `LIMITE_DURO` | §6 | perda/semana que bloqueia automaticamente |
| tempo de validade do código | §4 | janela do código dinâmico |
| roteiro mínimo | §4 | itens obrigatórios no vídeo |
| capacidade de revisão | §5 | pesagens/revisor/dia → quando o humano vira gargalo (gatilho da Fase 2) |
