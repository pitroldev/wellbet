/**
 * Onboarding — boas-vindas. Mascote reativo (Rive) e CTA para o guia de
 * captura. Aqui pode haver feel/dopamina (não é a tela de captura).
 */
import { View } from "react-native";
import { useRouter } from "expo-router";
import Rive from "rive-react-native";

import { Button, Screen, Text } from "@/shared/ui";
import { useReducedMotion } from "@/shared/motion";

export default function OnboardingWelcome() {
  const router = useRouter();
  const reduced = useReducedMotion();

  return (
    <Screen>
      <View className="flex-1 justify-between py-10">
        <View className="flex-1 items-center justify-center gap-6">
          <View className="h-56 w-56">
            <Rive
              // TODO: asset real do mascote em assets/rive/.
              resourceName="mascot"
              stateMachineName="welcome"
              autoplay={!reduced}
              style={{ flex: 1 }}
            />
          </View>
          <View className="gap-2">
            <Text variant="title" className="text-center">
              Bem-vindo ao Charya
            </Text>
            <Text variant="body" className="text-center text-muted">
              Você aposta no seu próprio emagrecimento. A pesagem é gravada no app e revisada por
              uma pessoa.
            </Text>
          </View>
        </View>

        <Button
          label="Como gravar a pesagem"
          onPress={() => router.push("/(onboarding)/capture-guide")}
        />
      </View>
    </Screen>
  );
}
