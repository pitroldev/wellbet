/**
 * Cache rápido nativo via MMKV v4 (Nitro).
 *
 * Uso: cache não-sensível e estado leve persistido (flags de onboarding,
 * rascunho do fluxo de pesagem, último device de câmera etc.). Tokens de auth
 * NÃO vão aqui — vão no SecureStore (`secure-store.ts`).
 *
 * MMKV é síncrono e rápido o bastante para ser usado fora de await.
 */
import { createMMKV } from "react-native-mmkv";
import type { MMKV } from "react-native-mmkv";

// MMKV v4 (Nitro): `MMKV` é só um TIPO (HybridObject). A instância é criada
// pelo factory `createMMKV(configuration)`, não mais via `new MMKV(...)`.
export const storage: MMKV = createMMKV({
  id: "charya-cache",
});

/** Helpers tipados finos sobre o MMKV. */
export const kv = {
  getString(key: string): string | undefined {
    return storage.getString(key);
  },
  setString(key: string, value: string): void {
    storage.set(key, value);
  },
  getJSON<T>(key: string): T | undefined {
    const raw = storage.getString(key);
    if (raw == null) return undefined;
    try {
      return JSON.parse(raw) as T;
    } catch {
      // Valor corrompido: trata como ausente.
      return undefined;
    }
  },
  setJSON<T>(key: string, value: T): void {
    storage.set(key, JSON.stringify(value));
  },
  getBool(key: string): boolean | undefined {
    return storage.contains(key) ? storage.getBoolean(key) : undefined;
  },
  setBool(key: string, value: boolean): void {
    storage.set(key, value);
  },
  remove(key: string): void {
    // MMKV v4 renomeou `delete` → `remove` (retorna boolean; ignoramos).
    storage.remove(key);
  },
};

/** Chaves de cache conhecidas (evita strings soltas pelo código). */
export const StorageKeys = {
  onboardingDone: "onboarding.done",
  weighinDraft: "weighin.draft",
  lastCameraDevice: "camera.lastDevice",
  /** Idioma escolhido manualmente (override da detecção do dispositivo). */
  language: "app.language",
  /** Estado local-first da jornada (a espinha — ver features/journey). */
  journey: "journey.v1",
} as const;
