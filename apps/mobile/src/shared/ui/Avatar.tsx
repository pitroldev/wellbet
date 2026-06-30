/**
 * Avatar/imagem com placeholder via expo-image (ThumbHash/BlurHash). Canto
 * arredondado por padrão (Midnight Aurora); `radius` ajusta (use 999 para um
 * avatar perfeitamente redondo).
 *
 * Orçamento de performance: expo-image mantém a decodificação fora do caminho
 * de jank e mostra placeholder sem flash. Usar SEMPRE expo-image (nunca a
 * <Image> do RN) para mídia remota.
 */
import { Image, type ImageProps } from "expo-image";

export interface AvatarProps extends Omit<ImageProps, "source"> {
  uri: string;
  size?: number;
  /** Raio do canto (default 16; use 999 para redondo). */
  radius?: number;
  /** ThumbHash/BlurHash para placeholder sem jank. */
  placeholder?: string;
}

export function Avatar({ uri, size = 48, radius = 16, placeholder, style, ...props }: AvatarProps) {
  return (
    <Image
      {...props}
      source={{ uri }}
      placeholder={placeholder != null ? { thumbhash: placeholder } : undefined}
      contentFit="cover"
      transition={150}
      style={[{ width: size, height: size, borderRadius: radius }, style]}
    />
  );
}
