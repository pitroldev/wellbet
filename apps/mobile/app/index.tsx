/**
 * HOME — a tela-casa. A síntese das homes que funcionam (doc §5):
 *  - barra de status no topo (DUOLINGO),
 *  - painel de números (MYFITNESSPAL),
 *  - o caminho de 2 nós (DUOLINGO),
 *  - a lição de hoje (NOOM),
 *  - e SEMPRE um próximo passo único (DUOLINGO).
 *
 * Liga no journey store (a espinha) e troca de cara por estágio — nunca um vazio
 * mudo, nunca duas decisões ambíguas.
 */
import { type ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { Redirect, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, PressableScale, Screen, Tag, Text } from "@/shared/ui";
import {
  FinalReview,
  JourneyPath,
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

function Header({ onProfile }: { onProfile: () => void }) {
  return (
    <View className="mb-4 flex-row items-center justify-between">
      <Text variant="heading" className="text-2xl">
        WellBet
      </Text>
      <PressableScale onPress={onProfile}>
        <Text variant="label">perfil ▸</Text>
      </PressableScale>
    </View>
  );
}

/** Layout focado: um pensamento, um CTA (Duolingo). Para os estágios de transição. */
function Focus({
  eyebrow,
  tone = "magenta",
  title,
  body,
  ctaLabel,
  onCta,
  extra,
}: {
  eyebrow: string;
  tone?: "magenta" | "green" | "ink";
  title: string;
  body: string;
  ctaLabel: string;
  onCta: () => void;
  extra?: ReactNode;
}) {
  return (
    <View className="flex-1 justify-between pb-2">
      <View className="gap-4 pt-6">
        <Tag label={eyebrow} tone={tone} />
        <Text variant="title">{title}</Text>
        <Text variant="body" className="text-muted">
          {body}
        </Text>
        {extra}
      </View>
      <Button label={ctaLabel} onPress={onCta} />
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
            eyebrow="Bora?"
            title={t("journey.home.noAccountTitle")}
            body={t("journey.home.noAccountBody")}
            ctaLabel={t("journey.home.noAccountCta")}
            onCta={() => router.push("/(auth)/sign-in")}
          />
        );

      case "no-baseline":
        return (
          <Focus
            eyebrow={t("journey.baseline.eyebrow")}
            title={t("journey.home.noBaselineTitle")}
            body={t("journey.home.noBaselineBody")}
            ctaLabel={t("journey.home.noBaselineCta")}
            onCta={() => router.push("/weigh?kind=baseline")}
          />
        );

      case "baseline-review":
        return (
          <Focus
            eyebrow="Em revisão"
            title={t("journey.home.reviewTitle")}
            body={t("journey.home.reviewBody")}
            ctaLabel={t("common.continue")}
            onCta={() => router.replace("/")}
          />
        );

      case "no-bet":
        return (
          <Focus
            eyebrow={t("journey.bilhete.eyebrow")}
            title={t("journey.home.noBetTitle", {
              weight: formatKg(s.baselineWeightKg ?? 0),
            })}
            body={t("journey.home.noBetBody")}
            ctaLabel={t("journey.home.noBetCta")}
            onCta={() => router.push("/bet/new")}
          />
        );

      case "payment":
        return (
          <Focus
            eyebrow={t("journey.pix.eyebrow")}
            title={t("journey.home.paymentTitle")}
            body={t("journey.home.paymentBody")}
            ctaLabel={t("journey.home.paymentCta")}
            onCta={() => router.push("/bet/pay")}
          />
        );

      case "final-review":
        return <FinalReview />;

      case "won":
      case "lost":
        return (
          <Focus
            eyebrow="Resultado"
            tone={stage === "won" ? "green" : "ink"}
            title={
              stage === "won"
                ? t("journey.settlement.wonTitle")
                : t("journey.settlement.lostTitle")
            }
            body={
              stage === "won"
                ? t("journey.settlement.wonSource")
                : t("journey.settlement.lostKind")
            }
            ctaLabel={t("journey.home.resultCta")}
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

        return (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 20, paddingBottom: 16 }}
          >
            <StatusBar
              stats={[
                {
                  value: bet.stakeAmount,
                  label: t("journey.status.inPlay"),
                  prefix: "R$ ",
                  accent: true,
                },
                { value: days, label: t("journey.status.days") },
                { value: streak, label: t("journey.status.streak"), prefix: "🔥 " },
              ]}
            />

            <MetaPanel
              label={t("journey.meta.label")}
              goalText={t("journey.meta.lose", {
                kg: formatKg(bet.startWeightKg - bet.targetWeightKg),
              })}
              startKg={formatKg(bet.startWeightKg)}
              targetKg={formatKg(bet.targetWeightKg)}
              progress={prog.pct}
              leftText={t("journey.meta.left", {
                kg: formatKg(Math.max(0, prog.lostKg)),
                pct: Math.round(prog.pct * 100),
              })}
              trend={[bet.startWeightKg, ...s.checkIns.map((c) => c.weightKg)]}
              targetKgNum={bet.targetWeightKg}
            />

            <JourneyPath
              startLabel={t("journey.path.start")}
              startSub={`${formatKg(bet.startWeightKg)} ✓`}
              endLabel={t("journey.path.final")}
              endSub={
                windowOpen ? t("journey.home.windowTitle") : t("journey.home.nextWeighIn", { days })
              }
              progress={prog.pct}
              windowOpen={windowOpen}
            />

            <LessonCard
              title={lesson.title}
              minutes={lesson.minutes}
              onPress={() => router.push(`/lesson?id=${lesson.id}`)}
            />

            {windowOpen ? (
              <Button
                label={t("journey.home.windowCta")}
                onPress={() => router.push("/weigh?kind=final")}
              />
            ) : (
              <>
                <Button
                  label={t("journey.home.checkinCta")}
                  onPress={() => router.push("/checkin")}
                />
                <Text variant="caption" className="text-center">
                  {pacing
                    ? t("journey.home.onTrack", { kg: formatKg(remainingKg), days })
                    : t("journey.home.offTrack", { kg: formatKg(remainingKg), days })}
                </Text>
                {__DEV__ ? (
                  <PressableScale onPress={s.fastForwardToWindow} className="items-center pt-1">
                    <Text variant="label" className="text-muted-foreground">
                      {t("journey.home.demoWindow")}
                    </Text>
                  </PressableScale>
                ) : null}
              </>
            )}
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
