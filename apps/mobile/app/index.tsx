/**
 * HOME — a tela-casa, "o placar". Síntese das homes que funcionam (doc §5):
 *  - pílulas de status no topo (DUOLINGO),
 *  - o ANEL de progresso de herói (assinatura Midnight Aurora),
 *  - o painel de tendência (MYFITNESSPAL),
 *  - a lição de hoje (NOOM),
 *  - e SEMPRE um próximo passo único (DUOLINGO).
 *
 * Liga no journey store (a espinha) e troca de cara por estágio — nunca um vazio
 * mudo, nunca duas decisões ambíguas. Cada estágio de transição é um HERÓI com
 * ícone/chama, entrando em cascata — e a tela ativa herda o mesmo vocabulário.
 */
import { type ReactNode } from "react";
import { ScrollView, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Redirect, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import {
  BrandFlame,
  Button,
  Card,
  PressableScale,
  ProgressRing,
  Screen,
  Tag,
  Text,
} from "@/shared/ui";
import { arena, arenaAlpha } from "@/theme/tokens";
import {
  AnimatedNumber,
  FinalReview,
  LessonCard,
  MetaPanel,
  StatusBar,
  currentWeightKg,
  daysLeft,
  formatKg,
  nextLesson,
  onPace,
  progress,
  selectStage,
  streakDays,
  useJourney,
} from "@/features/journey";

type FeatherName = keyof typeof Feather.glyphMap;

// Wordmark oficial (símbolo + lettering embutidos) — proporção 1837:356, nunca distorcer.
const WORDMARK_DARK = require("../assets/brand/wordmark-wellbet-dark.png");
const WORDMARK_RATIO = 1837 / 356;
// Streak 3D da marca — ícone da pílula de sequência na StatusBar.
const STREAK_3D = require("../assets/brand/3d-streak-violeta.png");

function Header({ onProfile }: { onProfile: () => void }) {
  return (
    <View className="mb-5 flex-row items-center justify-between">
      <Image
        source={WORDMARK_DARK}
        accessible
        accessibilityLabel="WellBet"
        contentFit="contain"
        style={{ height: 22, width: 22 * WORDMARK_RATIO }}
      />
      <PressableScale onPress={onProfile}>
        <View className="h-11 w-11 items-center justify-center rounded-full border border-arena-hairline bg-arena-glass">
          <Feather name="user" size={19} color={arena.fog} />
        </View>
      </PressableScale>
    </View>
  );
}

/** Hero icon tile — ícone em tile de vidro com wash da cor. */
function IconHero({ icon, tone = "violet" }: { icon: FeatherName; tone?: "violet" | "green" }) {
  const color = tone === "green" ? arena.green : arena.violetSoft;
  const wash = tone === "green" ? arenaAlpha.greenWash : arenaAlpha.violetWash;
  return (
    <Animated.View entering={FadeIn.duration(500)} className="items-center">
      <View
        style={{ backgroundColor: wash }}
        className="h-24 w-24 items-center justify-center rounded-3xl border border-arena-hairline-strong"
      >
        <Feather name={icon} size={42} color={color} />
      </View>
    </Animated.View>
  );
}

/** Layout focado: um pensamento, um CTA (Duolingo). Estágios de transição, em cascata. */
function Focus({
  hero,
  eyebrow,
  tone = "violet",
  title,
  body,
  ctaLabel,
  ctaIcon,
  onCta,
  extra,
}: {
  hero: ReactNode;
  eyebrow: string;
  tone?: "violet" | "green" | "ink";
  title: string;
  body: string;
  ctaLabel: string;
  ctaIcon?: FeatherName;
  onCta: () => void;
  extra?: ReactNode;
}) {
  return (
    <View className="flex-1 justify-between pb-2">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 18, paddingTop: 12 }}>
        {hero}
        <Animated.View entering={FadeInDown.delay(120).springify()} className="items-center">
          <Tag label={eyebrow} tone={tone} align="center" />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(220).springify()}>
          <Text variant="title" className="text-center">
            {title}
          </Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(320).springify()}>
          <Text variant="body" className="text-center text-muted">
            {body}
          </Text>
        </Animated.View>
        {extra != null ? (
          <Animated.View entering={FadeInDown.delay(420).springify()}>{extra}</Animated.View>
        ) : null}
      </ScrollView>
      <Animated.View entering={FadeInDown.delay(520)} className="pt-3">
        <Button label={ctaLabel} icon={ctaIcon} onPress={onCta} />
      </Animated.View>
    </View>
  );
}

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const s = useJourney();
  const stage = selectStage(s);

  if (stage === "onboarding") return <Redirect href="/(onboarding)/welcome" />;

  const goProfile = () => router.push("/profile");

  function body(): ReactNode {
    switch (stage) {
      case "no-account":
        return (
          <Focus
            hero={
              <Animated.View entering={FadeIn.duration(600)} className="items-center">
                <BrandFlame size={132} />
              </Animated.View>
            }
            eyebrow={t("journey.home.startEyebrow")}
            title={t("journey.home.noAccountTitle")}
            body={t("journey.home.noAccountBody")}
            ctaLabel={t("journey.home.noAccountCta")}
            ctaIcon="arrow-right"
            onCta={() => router.push("/(auth)/sign-in")}
          />
        );

      case "no-baseline":
        return (
          <Focus
            hero={<IconHero icon="activity" />}
            eyebrow={t("journey.baseline.eyebrow")}
            title={t("journey.home.noBaselineTitle")}
            body={t("journey.home.noBaselineBody")}
            ctaLabel={t("journey.home.noBaselineCta")}
            ctaIcon="arrow-right"
            onCta={() => router.push("/weigh?kind=baseline")}
          />
        );

      case "baseline-review":
        return (
          <Focus
            hero={<IconHero icon="eye" />}
            eyebrow={t("journey.home.reviewEyebrow")}
            title={t("journey.home.reviewTitle")}
            body={t("journey.home.reviewBody")}
            ctaLabel={t("common.continue")}
            onCta={() => router.replace("/")}
          />
        );

      case "no-bet":
        return (
          <Focus
            hero={<IconHero icon="target" />}
            eyebrow={t("journey.bilhete.eyebrow")}
            title={t("journey.home.noBetTitle", { weight: formatKg(s.baselineWeightKg ?? 0) })}
            body={t("journey.home.noBetBody")}
            ctaLabel={t("journey.home.noBetCta")}
            ctaIcon="zap"
            onCta={() => router.push("/bet/new")}
          />
        );

      case "payment":
        return (
          <Focus
            hero={<IconHero icon="credit-card" />}
            eyebrow={t("journey.pix.eyebrow")}
            title={t("journey.home.paymentTitle")}
            body={t("journey.home.paymentBody")}
            ctaLabel={t("journey.home.paymentCta")}
            ctaIcon="arrow-right"
            onCta={() => router.push("/bet/pay")}
          />
        );

      case "final-review":
        return <FinalReview />;

      case "won":
      case "lost":
        return (
          <Focus
            hero={<IconHero icon={stage === "won" ? "award" : "refresh-cw"} tone={stage === "won" ? "green" : "violet"} />}
            eyebrow={stage === "won" ? t("journey.settlement.wonEyebrow") : t("journey.settlement.lostEyebrow")}
            tone={stage === "won" ? "green" : "ink"}
            title={stage === "won" ? t("journey.settlement.wonTitle") : t("journey.settlement.lostTitle")}
            body={stage === "won" ? t("journey.settlement.wonSource") : t("journey.settlement.lostKind")}
            ctaLabel={t("journey.home.resultCta")}
            ctaIcon="arrow-right"
            onCta={() => router.push("/bet/result")}
          />
        );

      case "active":
      case "window": {
        const bet = s.bet;
        if (bet == null) return null;
        const current = currentWeightKg(s.checkIns, bet.startWeightKg);
        const prog = progress(bet, current);
        const days = daysLeft(bet);
        const streak = streakDays(s.checkIns);
        const lesson = nextLesson(s.lessonsSeenIds);
        const remainingKg = Math.max(0, current - bet.targetWeightKg);
        const pacing = onPace(bet, current);
        const windowOpen = stage === "window";
        const pct = Math.round(prog.pct * 100);
        const lostKg = Math.max(0, prog.lostKg);

        return (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 18, paddingBottom: 16 }}>
            <Animated.View entering={FadeInDown.springify()}>
              <StatusBar
                stats={[
                  { value: bet.stakeAmount, label: t("journey.status.inPlay"), prefix: "R$ ", accent: true },
                  { value: days, label: t("journey.status.days") },
                  { value: streak, label: t("journey.status.streak"), icon: STREAK_3D },
                ]}
              />
            </Animated.View>

            {/* Anel de herói — o placar. */}
            <Animated.View entering={FadeInDown.delay(100).springify()}>
              <Card glow className="items-center gap-4 py-7">
                {/* Janela aberta é urgência de rotina, não vitória — o green fica pro won. */}
                <Tag
                  label={windowOpen ? t("journey.home.windowTitle") : t("journey.meta.label")}
                  tone={windowOpen ? "cyan" : "violet"}
                />
                <ProgressRing progress={prog.pct} size={200}>
                  <View className="items-center">
                    <View className="flex-row items-end justify-center">
                      <AnimatedNumber
                        value={pct}
                        mountFrom={0}
                        durationMs={1100}
                        variant="display"
                        className="text-[52px] leading-[1.0] text-foreground"
                      />
                      <Text variant="display" className="pb-2 text-[26px] text-muted">
                        %
                      </Text>
                    </View>
                    <Text variant="label" className="mt-1 text-arena-mint">
                      −{formatKg(lostKg)} kg
                    </Text>
                  </View>
                </ProgressRing>

                <View className="w-full flex-row items-center justify-between px-2">
                  <View className="flex-row items-center gap-2">
                    <Feather name="check-circle" size={16} color={arena.green} />
                    <View>
                      <Text variant="label" className="text-[10px]">
                        {t("journey.path.start")}
                      </Text>
                      <Text className="font-mono text-xs text-foreground">{formatKg(bet.startWeightKg)}</Text>
                    </View>
                  </View>
                  <Feather name="arrow-right" size={16} color={arena.fogMute} />
                  <View className="items-end">
                    <Text variant="label" className="text-[10px]">
                      {t("journey.path.final")}
                    </Text>
                    <Text className="font-mono text-xs text-arena-mint">{formatKg(bet.targetWeightKg)}</Text>
                  </View>
                </View>
              </Card>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200).springify()}>
              <MetaPanel
                label={t("journey.meta.label")}
                goalText={t("journey.meta.lose", { kg: formatKg(bet.startWeightKg - bet.targetWeightKg) })}
                startKg={formatKg(bet.startWeightKg)}
                targetKg={formatKg(bet.targetWeightKg)}
                leftText={t("journey.meta.left", { kg: formatKg(lostKg), pct })}
                trend={[bet.startWeightKg, ...s.checkIns.map((c) => c.weightKg)]}
                targetKgNum={bet.targetWeightKg}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300).springify()}>
              <LessonCard
                title={lesson.title}
                minutes={lesson.minutes}
                onPress={() => router.push(`/lesson?id=${lesson.id}`)}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400).springify()}>
              {windowOpen ? (
                <Button
                  label={t("journey.home.windowCta")}
                  icon="camera"
                  onPress={() => router.push("/weigh?kind=final")}
                />
              ) : (
                <View className="gap-3">
                  <Button label={t("journey.home.checkinCta")} icon="plus" onPress={() => router.push("/checkin")} />
                  <View className="flex-row items-center justify-center gap-1.5">
                    <Feather
                      name={pacing ? "trending-down" : "alert-triangle"}
                      size={14}
                      color={pacing ? arena.green : arena.danger}
                    />
                    <Text variant="caption" className="text-center">
                      {pacing
                        ? t("journey.home.onTrack", { kg: formatKg(remainingKg), days })
                        : t("journey.home.offTrack", { kg: formatKg(remainingKg), days })}
                    </Text>
                  </View>
                  {__DEV__ ? (
                    <PressableScale onPress={s.fastForwardToWindow} className="items-center pt-1">
                      <Text variant="label" className="text-muted-foreground">
                        {t("journey.home.demoWindow")}
                      </Text>
                    </PressableScale>
                  ) : null}
                </View>
              )}
            </Animated.View>
          </ScrollView>
        );
      }

      default:
        return null;
    }
  }

  return (
    <Screen>
      <Header onProfile={goProfile} />
      {body()}
    </Screen>
  );
}
