/**
 * Resultado da pesagem — a tela de RECOMPENSA (dopamina).
 *
 * No MVP a pesagem vai para revisão humana (100%), então a mensagem celebra o
 * envio e informa que a revisão é manual. É aqui que o feel rico aparece, em
 * contraste com a captura sóbria.
 */
import { useRouter } from "expo-router";

import { RewardScreen } from "@/features/reward/RewardScreen";
import { useWeighInStore } from "@/features/weighin/model/store";

export default function WeighInResultScreen() {
  const router = useRouter();
  const reset = useWeighInStore((s) => s.reset);

  return (
    <RewardScreen
      title="Pesagem enviada!"
      subtitle="Sua pesagem está em revisão. Avisamos assim que for validada."
      onContinue={() => {
        reset();
        router.replace("/");
      }}
    />
  );
}
