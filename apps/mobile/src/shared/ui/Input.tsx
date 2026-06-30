/**
 * Campo de texto — Midnight Aurora. TextInput sobre poço de vidro, canto redondo,
 * hairline de 1px; foco acende a borda em magenta (com leve wash), erro em
 * vermelho. Rótulo em Geist Mono (variant label). Base para formulários (perfil,
 * nova aposta, gate, auth).
 */
import { useState } from "react";
import { TextInput, View, type TextInputProps } from "react-native";

import { arena, arenaAlpha, radius } from "@/theme/tokens";

import { Text } from "./Text";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, onFocus, onBlur, style, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);
  const errored = error != null;
  const borderColor = errored ? arena.danger : focused ? arena.magenta : arena.navyLine;
  const backgroundColor = errored
    ? arenaAlpha.dangerWash
    : focused
      ? arenaAlpha.magentaWash
      : arena.ink;

  return (
    <View className="gap-2">
      {label != null ? <Text variant="label">{label}</Text> : null}
      <TextInput
        placeholderTextColor={arena.fogMute}
        selectionColor={arena.magenta}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[{ borderColor, backgroundColor, borderRadius: radius.md, borderWidth: 1.5 }, style]}
        className={`h-14 px-4 font-sans text-base text-foreground${className ? ` ${className}` : ""}`}
        {...props}
      />
      {errored ? (
        <Text variant="caption" className="text-danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
