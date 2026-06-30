/**
 * Espera viva da revisão da pesagem final — dá tensão ao veredito (em vez de
 * magia instantânea). Pulsa enquanto "confere o vídeo" e resolve won/lost depois
 * de um tempo (resolveFinal). No backend real, isto vira o push "saiu o resultado".
 */
import { useEffect } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Tag, Text } from "@/shared/ui";
import { pulse, useMotionDuration } from "@/shared/motion";
import { durations } from "@/theme/tokens";

import { useJourney } from "../model/store";

/** Quanto tempo "conferindo" antes de revelar o resultado (demo local). */
const REVIEW_MS = 3500;

export function FinalReview() {
  const router = useRouter();
  const { t } = useTranslation();
  const resolveFinal = useJourney((s) => s.resolveFinal);
  const pulseDur = useMotionDuration(durations.slow);

  useEffect(() => {
    const id = setTimeout(() => {
      resolveFinal();
      // Só vai pro desfecho se a revisão resolveu (won/lost); senão, volta pra home.
      const phase = useJourney.getState().betPhase;
      router.replace(phase === "won" || phase === "lost" ? "/bet/result" : "/");
    }, REVIEW_MS);
    return () => clearTimeout(id);
  }, [resolveFinal, router]);

  return (
    <View className="flex-1 items-center justify-center gap-6">
      <Animated.View
        className="h-16 w-16 bg-arena-magenta"
        style={pulseDur > 0 ? pulse(pulseDur) : undefined}
      />
      <Tag label="Em revisão" tone="ink" />
      <Text variant="title" className="text-center">
        {t("journey.home.reviewTitle")}
      </Text>
      <Text variant="body" className="text-center text-muted">
        {t("journey.home.reviewBody")}
      </Text>
    </View>
  );
}
