/**
 * Leitor da lição do dia (NOOM) — psicologia da mudança na voz do treinador.
 * `?id=<lessonId>`. Marca como vista ao concluir.
 */
import { ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Screen, Tag, Text } from "@/shared/ui";
import { lessonById, nextLesson, useJourney } from "@/features/journey";

export default function LessonScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const markLessonSeen = useJourney((s) => s.markLessonSeen);

  const lesson = (id != null ? lessonById(id) : undefined) ?? nextLesson([]);

  function done() {
    markLessonSeen(lesson.id);
    router.back();
  }

  return (
    <Screen>
      <View className="flex-1 justify-between py-4">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
          <Tag label={t("journey.lesson.today")} tone="green" />
          <Text variant="title">{lesson.title}</Text>
          <Text className="font-mono text-xs text-muted">
            {t("journey.lesson.minutes", { n: lesson.minutes })}
          </Text>
          <Text variant="body" className="leading-relaxed">
            {lesson.body}
          </Text>
        </ScrollView>
        <Button label={t("journey.lesson.cta")} onPress={done} className="mt-4" />
      </View>
    </Screen>
  );
}
