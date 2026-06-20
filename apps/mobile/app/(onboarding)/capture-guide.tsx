/**
 * Guia do roteiro de captura (MVP §4). Explica as 6 etapas do vídeo contínuo
 * ANTES da gravação, para a tela de captura ficar enxuta. Conclui o onboarding.
 */
import { View } from "react-native";
import { useRouter } from "expo-router";

import { Button, Screen, Text } from "@/shared/ui";
import { kv, StorageKeys } from "@/shared/lib/storage";

const STEPS: readonly { n: number; text: string }[] = [
  { n: 1, text: "Mostre o rosto de frente." },
  { n: 2, text: "Mostre o código na tela e faça o gesto pedido." },
  { n: 3, text: "Filme a balança vazia marcando 0,0." },
  { n: 4, text: "Mostre o piso e os 4 pés da balança, chão nivelado." },
  { n: 5, text: "Suba na balança, mãos à vista, sem apoio." },
  { n: 6, text: "Aproxime o visor: número saindo do zero até o peso." },
];

export default function CaptureGuide() {
  const router = useRouter();

  function finish() {
    kv.setBool(StorageKeys.onboardingDone, true);
    router.replace("/");
  }

  return (
    <Screen>
      <View className="flex-1 gap-6 py-6">
        <View className="gap-2">
          <Text variant="title">Um único vídeo, sem cortes</Text>
          <Text variant="body" className="text-muted">
            A pesagem é um take contínuo gravado no app. Siga a ordem:
          </Text>
        </View>

        <View className="flex-1 gap-4">
          {STEPS.map((s) => (
            <View key={s.n} className="flex-row gap-3">
              <View className="h-7 w-7 items-center justify-center rounded-full bg-primary-600">
                <Text className="text-on-primary font-bold">{s.n}</Text>
              </View>
              <Text variant="body" className="flex-1">
                {s.text}
              </Text>
            </View>
          ))}
        </View>

        <Button label="Entendi, começar" onPress={finish} />
      </View>
    </Screen>
  );
}
