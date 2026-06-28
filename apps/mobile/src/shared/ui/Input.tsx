/**
 * Campo de texto — direção Arena. TextInput sobre surface navy, texto branco,
 * placeholder fog. Foco acende a borda em magenta; erro em vermelho. Base para
 * formulários (perfil, nova aposta, gate de peso).
 */
import { useState } from "react";
import { TextInput, View, type TextInputProps } from "react-native";

import { arena } from "@/theme/tokens";

import { Text } from "./Text";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, onFocus, onBlur, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = error != null ? arena.danger : focused ? arena.magenta : arena.navyLine;

  return (
    <View className="gap-1.5">
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
        style={{ borderColor }}
        className={`h-14 rounded-2xl border bg-arena-navy-soft px-4 font-sans text-base text-foreground${
          className ? ` ${className}` : ""
        }`}
        {...props}
      />
      {error != null ? (
        <Text variant="caption" className="text-danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
