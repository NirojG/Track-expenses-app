import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { theme } from '@/theme/theme';

export const ui = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text },
  heading: { fontSize: 19, fontWeight: '700', color: theme.colors.text },
  body: { fontSize: 15, lineHeight: 23, color: theme.colors.muted },
  label: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 },
  stack: { gap: 12 },
  card: { padding: 20, borderRadius: 20, backgroundColor: theme.colors.surface, gap: 12 },
  input: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, backgroundColor: theme.colors.surface, padding: 14, minHeight: 50, color: theme.colors.text, fontSize: 16 },
  button: { minHeight: 48, paddingHorizontal: 18, paddingVertical: 13, borderRadius: 12, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  danger: { backgroundColor: '#B42336' },
  secondary: { backgroundColor: theme.colors.primarySoft },
  choice: { minHeight: 48, padding: 12, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, justifyContent: 'center' },
  selected: { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.primary },
  error: { color: '#A01E30', fontSize: 15, lineHeight: 23 },
});

export function Card({ children }: PropsWithChildren) { return <View style={ui.card}>{children}</View>; }
export function Button({ title, onPress, disabled, secondary, danger }: { title: string; onPress: () => void; disabled?: boolean; secondary?: boolean; danger?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled: !!disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [ui.button, secondary && ui.secondary, danger && ui.danger, { opacity: disabled ? 0.5 : pressed ? 0.75 : 1 }]}><Text style={[ui.buttonText, secondary && { color: theme.colors.primary }]}>{title}</Text></Pressable>;
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return <View style={{ gap: 8 }}><Text style={ui.label}>{label}</Text><TextInput accessibilityLabel={label} placeholderTextColor={theme.colors.muted} {...props} style={[ui.input, props.style]} /></View>;
}
export function Choices<T extends string>({ label, values, value, onChange }: { label: string; values: readonly T[]; value: T; onChange: (value: T) => void }) {
  return <View style={ui.stack}><Text style={ui.label}>{label}</Text><View style={ui.row}>{values.map((item) => <Pressable key={item} accessibilityRole="button" accessibilityLabel={`${label}: ${item}`} accessibilityState={{ selected: value === item }} onPress={() => onChange(item)} style={[ui.choice, value === item && ui.selected]}><Text style={ui.label}>{item}</Text></Pressable>)}</View></View>;
}
