/**
 * Háptico frame-accurate dentro de worklets de gesto.
 *
 * Regra do briefing (§3 Animação/Feel): o háptico dispara DENTRO do worklet de
 * gesto (na UI thread), não num handler na thread JS — assim ele acompanha o
 * progresso do gesto frame a frame.
 *
 * expo-haptics roda na thread JS, então usamos `scheduleOnRN` (worklets) para
 * pular do worklet para o JS sem bloquear a UI thread.
 */
import * as Haptics from "expo-haptics";
import { scheduleOnRN } from "react-native-worklets";

/** Pulso leve — ticks de progresso de gesto. */
export function hapticTick(): void {
  "worklet";
  scheduleOnRN(impactLight);
}

/** Pulso médio — confirmação/snap. */
export function hapticSnap(): void {
  "worklet";
  scheduleOnRN(impactMedium);
}

/** Notificação de sucesso — recompensa/meta batida. */
export function hapticSuccess(): void {
  "worklet";
  scheduleOnRN(notifySuccess);
}

// Funções "na thread JS" chamadas a partir do worklet. expo-haptics é async;
// não precisamos aguardar dentro do worklet.
function impactLight(): void {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}
function impactMedium(): void {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}
function notifySuccess(): void {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
