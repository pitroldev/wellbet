/**
 * Jest config do app mobile.
 *
 * ⚠️ Vitest NÃO suporta React Native — o runner oficial do Expo é Jest via
 * preset `jest-expo` (ver §3 / §7 e Roadmap §10).
 *
 * `transformIgnorePatterns` permite transpilar os pacotes RN/Expo ESM e os
 * pacotes internos @charya/* (que publicam TS/ESM).
 *
 * @type {import('jest').Config}
 */
module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|nativewind|react-native-css-interop|react-native-reanimated|react-native-worklets|react-native-gesture-handler|react-native-vision-camera|react-native-mmkv|@shopify/.*|@charya/.*))",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "app/**/*.{ts,tsx}"],
};
