import type { ExpoConfig, ConfigContext } from "expo/config";

/**
 * Configuração do app Expo (SDK 56 / RN 0.85 / React 19.2).
 *
 * Pontos críticos do briefing (§3 Arquitetura Técnica):
 * - New Architecture (Fabric + JSI + Hermes) é OBRIGATÓRIA. Em RN 0.82+ ela é a
 *   única arquitetura, então `newArchEnabled` deixou de existir no ExpoConfig.
 * - 120Hz ProMotion: `CADisableMinimumFrameDurationOnPhone = true` no Info.plist iOS.
 *   Sem isso o app trava silenciosamente em 60fps (Orçamento de performance).
 * - Plugins nativos: expo-router, reanimated (worklets), expo-secure-store (tokens).
 * - vision-camera (gravação contínua) NÃO entra em `plugins`: a versão 5.x não
 *   publica config plugin (`app.plugin.js`); o linking nativo é por autolinking
 *   (`react-native.config.js`) e as permissões já estão declaradas abaixo à mão.
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "WellBet",
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
        "O WellBet usa a câmera para gravar o vídeo da pesagem dentro do app.",
      NSMicrophoneUsageDescription:
        "O WellBet grava áudio junto ao vídeo da pesagem para integridade da evidência.",
    },
  },
  android: {
    package: "com.charya.app",
    permissions: ["CAMERA", "RECORD_AUDIO"],
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    // NÃO listar aqui: react-native-vision-camera (5.x) nem react-native-reanimated
    // (4.x) publicam config plugin (`app.plugin.js`). Declará-los faz o Expo carregar
    // o entry de runtime ESM como se fosse plugin e quebra o `expo start`.
    //  · vision-camera → permissões em ios.infoPlist/android.permissions (acima);
    //    linking nativo por autolinking (react-native.config.js).
    //  · reanimated   → transform de worklets é via babel (react-native-worklets/plugin).
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
