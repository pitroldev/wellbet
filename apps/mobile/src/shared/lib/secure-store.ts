/**
 * Armazenamento seguro de tokens de auth (expo-secure-store).
 *
 * Tokens de sessão (Better Auth, do backend) ficam no Keychain/Keystore via
 * SecureStore — NUNCA no MMKV/cache. API assíncrona.
 */
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "charya.auth.accessToken";
const REFRESH_TOKEN_KEY = "charya.auth.refreshToken";

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export const tokenStore = {
  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async save(tokens: AuthTokens): Promise<void> {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
    if (tokens.refreshToken != null) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
  },

  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
};
