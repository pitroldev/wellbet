/**
 * Cartão da lição do dia — mecânica do NOOM (a tarefa/lição de hoje), na voz do
 * treinador. Acento verde (a casa do "green"). Toque leva ao leitor da lição.
 */
import { useTranslation } from "react-i18next";

import { Card, PressableScale, Text } from "@/shared/ui";

export interface LessonCardProps {
  title: string;
  minutes: number;
  onPress: () => void;
}

export function LessonCard({ title, minutes, onPress }: LessonCardProps) {
  const { t } = useTranslation();

  return (
    <PressableScale onPress={onPress}>
      <Card accent="green">
        <Text variant="label" className="text-arena-green">
          {t("journey.lesson.today")}
        </Text>
        <Text variant="heading" className="mt-1">
          {title}
        </Text>
        <Text className="mt-2 font-mono text-xs text-muted">
          {t("journey.lesson.minutes", { n: minutes })} ▸
        </Text>
      </Card>
    </PressableScale>
  );
}
