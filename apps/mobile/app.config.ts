import type { ExpoConfig, ConfigContext } from "expo/config";

/**
 * Configuração do app Expo (SDK 56 / RN 0.85 / React 19.2).
 *
 * Pontos críticos do briefing (§3 Arquitetura Técnica):
 * - New Architecture (Fabric + JSI + Hermes) é OBRIGATÓRIA. Em RN 0.82+ ela é a
 *   única arquitetura, então `newArchEnabled` deixou de existir no ExpoConfig.
 * - 120Hz ProMotion: `CADisableMinimumFrameDurationOnPhone = true` no Info.plist iOS.
 *   Sem isso o app trava silenciosamente em 60fps (Orçamento de performance).
 * - Plugins nativos: expo-router, vision-camera (gravação contínua), reanimated
 *   (worklets), expo-secure-store (tokens).
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Charya",
  slug: "charya",
  scheme: "charya",
  version: "0.0.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  // New Architecture (Fabric/JSI/Hermes) é a ÚNICA arquitetura no SDK 56 / RN
  // 0.82+ — `newArchEnabled` foi removida do ExpoConfig (já é implícito).
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.charya.app",
    infoPlist: {
      // 120Hz ProMotion: habilita frame rate alto (ver Orçamento de performance).
      CADisableMinimumFrameDurationOnPhone: true,
      // Permissões da câmera/áudio para gravação contínua da pesagem.
      NSCameraUsageDescription:
        "O Charya usa a câmera para gravar o vídeo da pesagem dentro do app.",
      NSMicrophoneUsageDescription:
        "O Charya grava áudio junto ao vídeo da pesagem para integridade da evidência.",
    },
  },
  android: {
    package: "com.charya.app",
    permissions: ["CAMERA", "RECORD_AUDIO"],
  },
  plugins: [
    "expo-router",
    [
      "react-native-vision-camera",
      {
        cameraPermissionText: "O Charya precisa da câmera para gravar a pesagem dentro do app.",
        enableMicrophonePermission: true,
        microphonePermissionText: "O Charya grava áudio junto ao vídeo da pesagem.",
      },
    ],
    "react-native-reanimated",
    "expo-secure-store",
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    // Valores públicos lidos em runtime via process.env.EXPO_PUBLIC_*.
    // Ver .env.example.
    router: {},
  },
});
