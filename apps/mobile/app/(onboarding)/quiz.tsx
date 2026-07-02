/**
 * Quiz de personalização (NOOM) — objetivo, porquê, o que travou. Conclui o
 * onboarding e guarda o "porquê" pra munição do treinador (Fase 5). Local.
 *
 * Visual: progresso em segmentos de gradiente com CABEÇA LUMINOSA (dot violetSoft
 * pulsando na ponta do preenchimento), tile de ÍCONE (Feather) por passo entrando
 * com zoom + rotação sutil, escolhas frosted com ícone + check.
 *
 * Fluidez Duolingo: os passos são ESTADO INTERNO (o stack não navega) — ao
 * confirmar, o conteúdo SAI pela esquerda e o próximo ENTRA pela direita
 * (entering/exiting orquestrados). Seleção com POP físico (spring) + háptico
 * selectionAsync no handler. Tudo respeita reduce-motion.
 */
import { type ReactNode, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeInRight,
  FadeOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  type EntryExitAnimationFunction,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Input, PressableScale, Screen, Tag, Text } from "@/shared/ui";
import { hapticDone, pulse, useMotionDuration, useReducedMotion } from "@/shared/motion";
import { arena, arenaAlpha, durations, gradients } from "@/theme/tokens";
import { type QuizBlocker, type QuizGoal, useJourney } from "@/features/journey";

type FeatherName = keyof typeof Feather.glyphMap;

const GOALS: { key: QuizGoal; icon: FeatherName }[] = [
  { key: "lose", icon: "trending-down" },
  { key: "health", icon: "activity" },
  { key: "confidence", icon: "smile" },
  { key: "event", icon: "calendar" },
];
const BLOCKERS: { key: QuizBlocker; icon: FeatherName }[] = [
  { key: "consistency", icon: "repeat" },
  { key: "motivation", icon: "battery-charging" },
  { key: "stress", icon: "wind" },
  { key: "alone", icon: "user" },
];
const STEP_ICON: FeatherName[] = ["target", "heart", "shield"];

/** Pulso da cabeça luminosa da barra (CSS API do RN4, off-thread) — module-level, determinístico. */
const HEAD_PULSE = pulse(1600);

/**
 * Entrada do tile de ícone do passo: zoom + rotação sutil (−6°→0) que assenta.
 * Custom porque ZoomIn não combina rotação; o delay vive DENTRO (withDelay) pra
 * entrar depois que o passo anterior saiu. Reduce-motion é tratado na tela.
 */
const tileEnter: EntryExitAnimationFunction = () => {
  "worklet";
  return {
    initialValues: { opacity: 0, transform: [{ scale: 0.6 }, { rotate: "-6deg" }] },
    animations: {
      opacity: withDelay(150, withTiming(1, { duration: 180 })),
      transform: [
        { scale: withDelay(150, withSpring(1, { damping: 13, stiffness: 190 })) },
        {
          rotate: withDelay(
            150,
            withTiming("0deg", { duration: 340, easing: Easing.out(Easing.back(1.6)) }),
          ),
        },
      ],
    },
  };
};

function Segment({ filled, head }: { filled: boolean; head: boolean }) {
  const sv = useSharedValue(filled ? 1 : 0);
  const dur = useMotionDuration(durations.base);
  const reduced = useReducedMotion();

  useEffect(() => {
    // API .get()/.set() do Reanimated 4: `sv` é capturado por mais de um hook
    // (regra de imutabilidade do React Compiler no eslint react-hooks v6).
    sv.set(withTiming(filled ? 1 : 0, { duration: dur }));
  }, [filled, dur, sv]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${sv.get() * 100}%` }));
  // A cabeça luminosa acompanha a PONTA do preenchimento (mesmo shared value).
  const headStyle = useAnimatedStyle(() => ({ left: `${sv.get() * 100}%` }));

  return (
    <View className="h-1.5 flex-1">
      <View className="h-full overflow-hidden rounded-full bg-arena-void">
        <Animated.View style={[{ height: "100%" }, fillStyle]}>
          <LinearGradient
            colors={gradients.brand}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      </View>
      {head ? (
        <Animated.View
          pointerEvents="none"
          style={[{ position: "absolute", top: -5, width: 16, height: 16, marginLeft: -8 }, headStyle]}
        >
          {/* Pulso decorativo — em reduce-motion o dot fica estático (fallback digno). */}
          <Animated.View
            className="flex-1 items-center justify-center"
            style={reduced ? undefined : HEAD_PULSE}
          >
            {/* halo translúcido (wash) — profundidade sem sombra RN colorida */}
            <View
              style={{
                position: "absolute",
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: arenaAlpha.violetWash,
              }}
            />
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: arena.violetSoft }} />
          </Animated.View>
        </Animated.View>
      ) : null}
    </View>
  );
}

function Choice({
  icon,
  label,
  selected,
  onPress,
}: {
  icon: FeatherName;
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const reduced = useReducedMotion();
  const popSv = useSharedValue(1);

  useEffect(() => {
    if (!selected || reduced) return;
    // POP físico de seleção: afunda rápido (0.97) e assenta com overshoot leve.
    popSv.set(
      withSequence(
        withTiming(0.97, { duration: 70 }),
        withSpring(1, { damping: 9, stiffness: 320 }),
      ),
    );
  }, [selected, reduced, popSv]);

  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: popSv.get() }] }));

  function handlePress() {
    // Háptico de SELEÇÃO no handler (o PressableScale já dá o tick leve de toque).
    void Haptics.selectionAsync();
    onPress();
  }

  return (
    <PressableScale onPress={handlePress}>
      <Animated.View
        style={[
          {
            backgroundColor: selected ? arenaAlpha.violetWash : arenaAlpha.glass,
            borderColor: selected ? arena.violet : arena.line,
          },
          popStyle,
        ]}
        className="flex-row items-center gap-3 rounded-2xl border px-4 py-3.5"
      >
        <View className="h-9 w-9 items-center justify-center rounded-xl border border-arena-hairline bg-arena-glass">
          <Feather name={icon} size={18} color={selected ? arena.violetSoft : arena.fog} />
        </View>
        <Text variant="body" className={`flex-1 ${selected ? "text-foreground" : "text-muted"}`}>
          {label}
        </Text>
        {selected ? <Feather name="check-circle" size={20} color={arena.violetSoft} /> : null}
      </Animated.View>
    </PressableScale>
  );
}

function StepFrame({ children }: { children: ReactNode }) {
  return <View className="gap-3">{children}</View>;
}

export default function Quiz() {
  const router = useRouter();
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const setQuiz = useJourney((s) => s.setQuiz);

  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<QuizGoal | null>(null);
  const [why, setWhy] = useState("");
  const [blocker, setBlocker] = useState<QuizBlocker | null>(null);

  const canAdvance =
    step === 0 ? goal != null : step === 1 ? why.trim().length > 0 : blocker != null;

  function advance() {
    if (step < 2) {
      // Confirmação tátil da virada de passo (handler, não render).
      void Haptics.selectionAsync();
      setStep(step + 1);
      return;
    }
    if (goal == null || blocker == null) return;
    setQuiz({ goal, why: why.trim(), blocker });
    hapticDone();
    router.push("/(onboarding)/motivation");
  }

  return (
    <Screen>
      <View className="flex-1 py-4">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Tag label={t("quiz.eyebrow")} />
              <Text variant="label" className="text-muted-foreground">
                {t("quiz.step", { current: step + 1, total: 3 })}
              </Text>
            </View>
            <View className="flex-row gap-2">
              {[0, 1, 2].map((i) => (
                <Segment key={i} filled={i <= step} head={i === step} />
              ))}
            </View>
          </View>

          {/* O passo é estado interno: sai pela ESQUERDA, o próximo entra pela DIREITA
              (o delay do entering deixa a saída respirar antes da chegada). */}
          <Animated.View
            key={step}
            entering={FadeInRight.duration(320).delay(110)}
            exiting={FadeOutLeft.duration(200)}
            className="gap-6"
          >
            <Animated.View entering={reduced ? undefined : tileEnter} className="items-center">
              <View
                style={{ backgroundColor: arenaAlpha.violetWash }}
                className="h-20 w-20 items-center justify-center rounded-3xl border border-arena-hairline-strong"
              >
                <Feather name={STEP_ICON[step] ?? "zap"} size={32} color={arena.violetSoft} />
              </View>
            </Animated.View>

            {step === 0 ? (
              <StepFrame>
                <Text variant="title" className="text-center">
                  {t("quiz.goalQ")}
                </Text>
                <View className="gap-2.5">
                  {GOALS.map((g, i) => (
                    <Animated.View key={g.key} entering={FadeInDown.delay(170 + i * 60).springify()}>
                      <Choice
                        icon={g.icon}
                        label={t(`quiz.goal.${g.key}`)}
                        selected={goal === g.key}
                        onPress={() => setGoal(g.key)}
                      />
                    </Animated.View>
                  ))}
                </View>
              </StepFrame>
            ) : null}

            {step === 1 ? (
              <StepFrame>
                <Text variant="title" className="text-center">
                  {t("quiz.whyQ")}
                </Text>
                <Input
                  value={why}
                  onChangeText={setWhy}
                  placeholder={t("quiz.whyPlaceholder")}
                  autoFocus
                  returnKeyType="done"
                />
                <Text variant="caption" className="text-center text-muted">
                  {t("quiz.whyHint")}
                </Text>
              </StepFrame>
            ) : null}

            {step === 2 ? (
              <StepFrame>
                <Text variant="title" className="text-center">
                  {t("quiz.blockerQ")}
                </Text>
                <View className="gap-2.5">
                  {BLOCKERS.map((b, i) => (
                    <Animated.View key={b.key} entering={FadeInDown.delay(170 + i * 60).springify()}>
                      <Choice
                        icon={b.icon}
                        label={t(`quiz.blocker.${b.key}`)}
                        selected={blocker === b.key}
                        onPress={() => setBlocker(b.key)}
                      />
                    </Animated.View>
                  ))}
                </View>
              </StepFrame>
            ) : null}
          </Animated.View>
        </ScrollView>

        <View className="pt-3">
          <Button
            label={step < 2 ? t("quiz.next") : t("quiz.finish")}
            icon={step < 2 ? "arrow-right" : "check"}
            onPress={advance}
            disabled={!canAdvance}
          />
        </View>
      </View>
    </Screen>
  );
}
