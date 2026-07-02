/**
 * Leitor da lição do dia (NOOM) — psicologia da mudança na voz do treinador.
 * `?id=<lessonId>`. Cabeçalho com tile de ícone + tag, corpo com ritmo de leitura
 * confortável. Marca como vista (com retorno tátil) ao concluir.
 */
import { ScrollView, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Screen, Tag, Text } from "@/shared/ui";
import { hapticDone } from "@/shared/motion";
import { arena, arenaAlpha } from "@/theme/tokens";
import { lessonById, nextLesson, useJourney } from "@/features/journey";

export default function LessonScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const markLessonSeen = useJourney((s) => s.markLessonSeen);

  const lesson = (id != null ? lessonById(id) : undefined) ?? nextLesson([]);

  function done() {
    markLessonSeen(lesson.id);
    hapticDone();
    router.back();
  }

  return (
    <Screen>
      <View className="flex-1 justify-between py-4">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 18, paddingBottom: 8 }}>
          <View className="gap-4">
            <View
              style={{ backgroundColor: arenaAlpha.blueWash }}
              className="h-16 w-16 items-center justify-center rounded-3xl border border-arena-hairline-strong"
            >
              <Feather name="book-open" size={30} color={arena.cyan} />
            </View>
            <Tag label={t("journey.lesson.today")} tone="cyan" />
            <Text variant="title">{lesson.title}</Text>
            <View className="flex-row items-center gap-1.5">
              <Feather name="clock" size={13} color={arena.fogMute} />
              <Text className="font-mono text-xs text-muted-foreground">
                {t("journey.lesson.minutes", { n: lesson.minutes })}
              </Text>
            </View>
          </View>

          <View className="h-px bg-arena-hairline" />

          <Text variant="body" className="text-[17px] leading-[1.7]">
            {lesson.body}
          </Text>
        </ScrollView>
        <Button label={t("journey.lesson.cta")} icon="check" onPress={done} className="mt-4" />
      </View>
    </Screen>
  );
}
