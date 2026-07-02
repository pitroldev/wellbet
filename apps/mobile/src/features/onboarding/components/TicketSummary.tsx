/**
 * TicketSummary — mini-cupom do bilhete que o usuário monta ao longo do funil
 * (META / PRAZO / EM JOGO). DNA de bilhete físico: chama da marca no cabeçalho,
 * costura tracejada e linhas em Geist Mono. Sem Skia — View sólida
 * (arena.surface) com hairline e canto 2xl; valores ausentes viram "—" (o
 * bilhete vai se preenchendo conforme o usuário avança). Rótulos via t()
 * (chaves onboarding.ticket.*); os VALORES chegam crus por props e são
 * formatados aqui (formatKg/formatMoney do journey — mesma régua da home).
 */
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { formatKg, formatMoney } from "@/features/journey";
import { BrandFlame, Text } from "@/shared/ui";
import { arenaAlpha } from "@/theme/tokens";

export interface TicketSummaryProps {
  /** Quilos a perder (a meta escolhida). Ausente → "—". */
  metaKg?: number | null;
  /** Prazo em semanas. Ausente → "—". */
  weeks?: number | null;
  /** Valor em jogo (R$). Ausente → "—". */
  stake?: number | null;
  className?: string;
}

// Costura tracejada DESENHADA (traços flex) — `borderStyle: "dashed"` em linha
// única é traiçoeiro no Android. Contagem fixa = determinístico, sem random.
const STITCH = Array.from({ length: 18 }, (_, i) => i);

export function TicketSummary({ metaKg, weeks, stake, className }: TicketSummaryProps) {
  const { t } = useTranslation();
  const vazio = t("onboarding.ticket.vazio");

  // As três linhas do cupom (valores ausentes → "—", o bilhete "em branco").
  const rows = [
    {
      key: "meta",
      label: t("onboarding.ticket.meta"),
      value: metaKg != null ? `${formatKg(metaKg)} kg` : vazio,
    },
    {
      key: "prazo",
      label: t("onboarding.ticket.prazo"),
      value: weeks != null ? t("onboarding.goal.weeks", { n: weeks }) : vazio,
    },
    {
      key: "emjogo",
      label: t("onboarding.ticket.emjogo"),
      value: stake != null ? formatMoney(stake) : vazio,
    },
  ] as const;

  return (
    <View
      className={`rounded-2xl border border-arena-hairline bg-arena-surface px-5 py-4${
        className ? ` ${className}` : ""
      }`}
    >
      {/* cabeçalho: chama pequena + título mono */}
      <View className="flex-row items-center gap-2.5 pb-3">
        {/* O BrandFlame carrega respiro interno pro glow (canvas maior que o
            símbolo) — esta janelinha centrada devolve o footprint de ~16px e
            deixa o halo vazar de leve, sem inflar o cabeçalho. */}
        <View
          pointerEvents="none"
          style={{ width: 14, height: 18, alignItems: "center", justifyContent: "center" }}
        >
          <BrandFlame size={16} />
        </View>
        <Text variant="label" className="text-arena-fog">
          {t("onboarding.ticket.title")}
        </Text>
      </View>

      {/* costura tracejada */}
      <View className="flex-row" style={{ gap: 5 }}>
        {STITCH.map((i) => (
          <View key={i} style={{ flex: 1, height: 1, backgroundColor: arenaAlpha.hairline }} />
        ))}
      </View>

      {/* linhas do bilhete */}
      <View className="gap-2 pt-3">
        {rows.map((r) => (
          <View key={r.key} className="flex-row items-center justify-between gap-3">
            <Text variant="label">{r.label}</Text>
            <Text variant="mono" className="text-sm">
              {r.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
