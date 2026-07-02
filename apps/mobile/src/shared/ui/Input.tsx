/**
 * Campo de texto — TextInput sobre poço escuro, canto redondo, hairline de 1px;
 * foco acende a borda em violeta (com leve wash), erro em vermelho. Rótulo em
 * Geist Mono (variant label). Base para formulários (perfil, nova aposta, gate,
 * auth).
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
  const borderColor = errored ? arena.danger : focused ? arena.violet : arena.line;
  const backgroundColor = errored
    ? arenaAlpha.dangerWash
    : focused
      ? arenaAlpha.violetWash
      : arena.void;

  return (
    <View className="gap-2">
      {label != null ? <Text variant="label">{label}</Text> : null}
      <TextInput
        placeholderTextColor={arena.fogMute}
        selectionColor={arena.violet}
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
