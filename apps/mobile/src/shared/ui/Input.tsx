/**
 * Campo de texto. RN TextInput estilizado via NativeWind, com rótulo opcional e
 * estado de erro. Base para formulários (ex.: perfil).
 */
import { TextInput, View, type TextInputProps } from "react-native";

import { Text } from "./Text";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <View className="gap-1.5">
      {label != null ? <Text variant="caption">{label}</Text> : null}
      <TextInput
        placeholderTextColor="#9ca3af"
        className={`h-14 rounded-2xl border bg-surface px-4 text-base text-foreground ${
          error != null ? "border-red-500" : "border-border"
        }${className ? ` ${className}` : ""}`}
        {...props}
      />
      {error != null ? (
        <Text variant="caption" className="text-red-500">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
