/**
 * Cartão da lição do dia — mecânica do NOOM (a tarefa/lição de hoje), na voz do
 * treinador. Card frosted, acento ciano (hábito — o verde é só da vitória),
 * tile de ícone + chevron. Toque leva ao leitor da lição.
 */
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { Card, PressableScale, Text } from "@/shared/ui";
import { arena, arenaAlpha } from "@/theme/tokens";

export interface LessonCardProps {
  title: string;
  minutes: number;
  onPress: () => void;
}

export function LessonCard({ title, minutes, onPress }: LessonCardProps) {
  const { t } = useTranslation();

  return (
    <PressableScale onPress={onPress}>
      <Card accent="cyan" className="flex-row items-center gap-4">
        <View
          style={{ backgroundColor: arenaAlpha.blueWash }}
          className="h-12 w-12 items-center justify-center rounded-2xl border border-arena-hairline"
        >
          <Feather name="book-open" size={22} color={arena.cyan} />
        </View>
        <View className="flex-1 gap-0.5">
          <Text variant="label" className="text-arena-cyan">
            {t("journey.lesson.today")}
          </Text>
          <Text variant="heading" className="text-lg">
            {title}
          </Text>
          <Text className="font-mono text-xs text-muted-foreground">
            {t("journey.lesson.minutes", { n: minutes })}
          </Text>
        </View>
        <Feather name="chevron-right" size={22} color={arena.fogMute} />
      </Card>
    </PressableScale>
  );
}
