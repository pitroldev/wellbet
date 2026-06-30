/**
 * Check-in informal (MYFITNESSPAL) — registra o peso do dia só pra o gráfico e o
 * streak. NÃO é pesagem oficial, não vai pra revisão. Local.
 */
import { useState } from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Input, Screen, Tag, Text } from "@/shared/ui";
import { hapticDone } from "@/shared/motion";
import { arena, arenaAlpha } from "@/theme/tokens";
import { useJourney } from "@/features/journey";

export default function CheckIn() {
  const router = useRouter();
  const { t } = useTranslation();
  const addCheckIn = useJourney((s) => s.addCheckIn);

  const [raw, setRaw] = useState("");
  const kg = parseFloat(raw.replace(",", "."));
  const valid = Number.isFinite(kg) && kg > 20 && kg < 400;

  function submit() {
    if (!valid) return;
    addCheckIn(kg);
    hapticDone();
    router.replace("/");
  }

  return (
    <Screen>
      <View className="flex-1 justify-between py-4">
        <View className="gap-5 pt-2">
          <View
            style={{ backgroundColor: arenaAlpha.greenWash }}
            className="h-14 w-14 items-center justify-center rounded-2xl border border-arena-hairline"
          >
            <Feather name="trending-down" size={26} color={arena.green} />
          </View>
          <Tag label={t("journey.checkin.eyebrow")} tone="green" />
          <Text variant="title">{t("journey.checkin.title")}</Text>
          <Text variant="body" className="text-muted">
            {t("journey.checkin.body")}
          </Text>
          <Input
            label={t("journey.checkin.weightLabel")}
            value={raw}
            onChangeText={setRaw}
            keyboardType="decimal-pad"
            autoFocus
            placeholder="ex.: 88,2"
          />
        </View>
        <Button label={t("journey.checkin.cta")} icon="check" onPress={submit} disabled={!valid} />
      </View>
    </Screen>
  );
}
