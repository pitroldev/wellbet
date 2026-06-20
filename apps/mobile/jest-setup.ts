/**
 * Setup global dos testes (Jest + jest-expo + RN Testing Library).
 *
 * Mocks dos módulos nativos que não rodam no ambiente de teste node/JSDOM:
 * Reanimated, gesture-handler, MMKV, secure-store, haptics e vision-camera.
 * Mantemos mocks mínimos e coerentes — a lógica real fica nos // TODO de cada
 * módulo. (RN Testing Library v13.)
 */
import "@testing-library/react-native";

// Reanimated traz um mock oficial para Jest.
jest.mock("react-native-reanimated", () => require("react-native-reanimated/mock"));

// Worklets: no ambiente de teste, `scheduleOnRN(fn, ...args)` executa o callback
// imediatamente na thread JS do teste (a API real agenda e retorna void).
jest.mock("react-native-worklets", () => ({
  scheduleOnRN: (fn: (...args: unknown[]) => unknown, ...args: unknown[]) => fn(...args),
  scheduleOnUI: (fn: (...args: unknown[]) => unknown, ...args: unknown[]) => fn(...args),
  runOnJS: (fn: unknown) => fn,
  runOnUI: (fn: unknown) => fn,
}));

// Haptics: no-op em teste.
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
  NotificationFeedbackType: {
    Success: "success",
    Warning: "warning",
    Error: "error",
  },
}));

// SecureStore: armazenamento em memória para testes.
jest.mock("expo-secure-store", () => {
  const store = new Map<string, string>();
  return {
    getItemAsync: jest.fn(async (k: string) => store.get(k) ?? null),
    setItemAsync: jest.fn(async (k: string, v: string) => {
      store.set(k, v);
    }),
    deleteItemAsync: jest.fn(async (k: string) => {
      store.delete(k);
    }),
  };
});

// MMKV: mock em memória (a lib é Nitro/nativa).
jest.mock("react-native-mmkv", () => {
  class MMKV {
    private store = new Map<string, string>();
    getString = (k: string) => this.store.get(k);
    set = (k: string, v: string) => this.store.set(k, v);
    delete = (k: string) => this.store.delete(k);
    contains = (k: string) => this.store.has(k);
    clearAll = () => this.store.clear();
  }
  return { MMKV };
});

// Vision Camera: mock dos hooks usados na captura.
jest.mock("react-native-vision-camera", () => ({
  Camera: "Camera",
  useCameraDevice: jest.fn(() => undefined),
  useCameraPermission: jest.fn(() => ({
    hasPermission: true,
    requestPermission: jest.fn(async () => true),
  })),
  useMicrophonePermission: jest.fn(() => ({
    hasPermission: true,
    requestPermission: jest.fn(async () => true),
  })),
}));
