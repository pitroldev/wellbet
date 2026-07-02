/**
 * Onboarding passo 3 — frase motivadora. Fecha o "combinado" e devolve o PORQUÊ
 * do usuário (do quiz) como citação — a estrela da tela, revelada em CASCATA POR
 * PALAVRA (cada palavra entra com um pequeno atraso incremental), com um campo de
 * brasas discreto (EmberField) respirando atrás. Ancora emoção antes dos números.
 * Reduce-motion: a citação aparece inteira de uma vez (fallback digno).
 */
import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { EmberField } from "@/features/onboarding/components";
import { useReducedMotion } from "@/shared/motion";
import { Button, Card, Screen, Tag, Text } from "@/shared/ui";
import { arena, arenaAlpha } from "@/theme/tokens";
import { useJourney } from "@/features/journey";

/** Cascata por palavra: começa depois do card assentar; ~40ms por palavra. */
const WORD_BASE_MS = 620;
const WORD_STEP_MS = 40;

export default function Motivation() {
  const router = useRouter();
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const why = useJourney((s) => s.quiz?.why ?? "");

  // A citação decorada (aspas coladas na 1ª/última palavra) quebrada em palavras.
  const words = useMemo(() => (why.length > 0 ? `“${why}”`.split(/\s+/) : []), [why]);

  return (
    <Screen>
      <View className="flex-1 justify-between py-3">
        {/* brasas discretas ATRÁS do conteúdo — o porquê é a estrela, não o fundo */}
        <EmberField intensity={0.25} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 20, paddingTop: 24 }}>
          <Animated.View entering={FadeIn.duration(500)} className="items-center">
            <View
              style={{ backgroundColor: arenaAlpha.violetWash }}
              className="h-20 w-20 items-center justify-center rounded-3xl border border-arena-hairline-strong"
            >
              <Feather name="zap" size={36} color={arena.violetSoft} />
            </View>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(150).springify()} className="items-center">
            <Tag label={t("onboarding.motivation.eyebrow")} align="center" />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(260).springify()}>
            <Text variant="title" className="text-center">
              {t("onboarding.motivation.title")}
            </Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(360).springify()}>
            <Text variant="body" className="text-center text-muted">
              {t("onboarding.motivation.body")}
            </Text>
          </Animated.View>
          {why.length > 0 ? (
            <Animated.View entering={FadeInDown.delay(460).springify()}>
              <Card glow accent="violet">
                <Text variant="label" className="text-arena-violet-soft">
                  {t("onboarding.motivation.whyLabel")}
                </Text>
                {reduced ? (
                  // Reduce-motion: tudo de uma vez, num Text único (fluxo de leitura intacto).
                  <Text variant="heading" className="mt-2 text-lg">
                    “{why}”
                  </Text>
                ) : (
                  <View
                    className="mt-2 flex-row flex-wrap"
                    // Leitor de tela lê a citação inteira como um nó só (as palavras
                    // separadas são detalhe de apresentação).
                    accessible
                    accessibilityLabel={`“${why}”`}
                  >
                    {words.map((word, i) => (
                      <Animated.View
                        key={`${i}-${word}`}
                        entering={FadeInDown.delay(WORD_BASE_MS + i * WORD_STEP_MS).springify()}
                        style={{ marginRight: 5 }}
                      >
                        <Text variant="heading" className="text-lg">
                          {word}
                        </Text>
                      </Animated.View>
                    ))}
                  </View>
                )}
              </Card>
            </Animated.View>
          ) : null}
        </ScrollView>
        <Animated.View entering={FadeInDown.delay(560)} className="pt-3">
          <Button
            label={t("onboarding.motivation.cta")}
            icon="arrow-right"
            onPress={() => router.push("/(onboarding)/measures")}
          />
        </Animated.View>
      </View>
    </Screen>
  );
}
