/**
 * Pagamento Pix — vem DEPOIS de pesar, montar o bilhete e criar a conta
 * (compromisso antes do dinheiro). Mostra o valor + o BR Code; confirmar abre a
 * aposta. O placeBet real (com sessão) é a próxima costura.
 */
import { useState } from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Redirect, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Card, PressableScale, Screen, Tag, Text } from "@/shared/ui";
import { hapticDone } from "@/shared/motion";
import { arena } from "@/theme/tokens";
import { formatMoney, useJourney } from "@/features/journey";

const DEMO_BRCODE =
  "00020126360014BR.GOV.BCB.PIX0114wellbet@demo.br5204000053039865802BR5907WellBet6009SAO PAULO62070503***6304A1B2";

export default function BetPay() {
  const router = useRouter();
  const { t } = useTranslation();
  const s = useJourney();
  const [copied, setCopied] = useState(false);

  // Só faz sentido aqui com uma aposta aguardando pagamento.
  if (s.betPhase !== "payment" || s.bet == null) return <Redirect href="/" />;

  const onConfirm = () => {
    s.confirmPayment();
    hapticDone();
    router.replace("/");
  };

  return (
    <Screen>
      <View className="flex-1 justify-between py-4">
        <View className="gap-5 pt-4">
          <Tag label={t("journey.pix.eyebrow")} />
          <Text variant="title">{t("journey.pix.title")}</Text>
          <Text variant="body" className="text-muted">
            {t("journey.pix.body")}
          </Text>

          <Card glow className="gap-4">
            <View className="items-center gap-1">
              {/* moeda 3D da marca — o dinheiro em jogo, presença discreta */}
              <Image
                source={require("../../assets/brand/3d-coin-simbolo-azul.png")}
                style={{ width: 52, height: 52, marginBottom: 4 }}
                contentFit="contain"
              />
              <Text variant="label">{t("journey.status.inPlay")}</Text>
              {/* dinheiro EM JOGO não é vitória — o verde fica pro green real */}
              <Text variant="numeric">{formatMoney(s.bet.stakeAmount)}</Text>
            </View>

            <View className="gap-2">
              <Text variant="label">{t("journey.pix.codeLabel")}</Text>
              <View className="rounded-2xl border border-arena-hairline bg-arena-ink px-4 py-3">
                <Text variant="mono" selectable className="text-xs leading-5">
                  {s.bet.brcode ?? DEMO_BRCODE}
                </Text>
              </View>
              <PressableScale onPress={() => setCopied(true)} className="self-start">
                {/* py compensado com margem negativa: alvo de toque ≥44px sem deslocar o layout */}
                <View className="-my-2 flex-row items-center gap-2 py-3">
                  <Feather name={copied ? "check" : "copy"} size={15} color={arena.violetSoft} />
                  <Text variant="label" className="text-arena-violet-soft">
                    {copied ? t("journey.pix.copied") : t("journey.pix.copy")}
                  </Text>
                </View>
              </PressableScale>
            </View>
          </Card>
        </View>

        <Button label={t("journey.pix.confirm")} icon="check" onPress={onConfirm} />
      </View>
    </Screen>
  );
}
