import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { RouteLink } from '@/components/route-link';
import { Screen } from '@/components/screen';
import { theme } from '@/theme/theme';

type Props = { title: string; description: string; example: string };

export function RecordingPreview({ title, description, example }: Props) {
  return (
    <Screen>
      <Stack.Screen options={{ title }} />
      <Text style={styles.eyebrow}>COMING NEXT</Text>
      <Text accessibilityRole="header" style={styles.title}>{title}, made simple.</Text>
      <Text style={styles.body}>{description}</Text>
      <View style={styles.card}>
        <Text style={styles.label}>A look ahead</Text>
        <Text style={styles.example}>{example}</Text>
      </View>
      <Text style={styles.body}>
        This is a preview. Recording is not available yet, and nothing has been saved.
      </Text>
      <RouteLink href="/" label="Back to home" replace />
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: { color: theme.colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  title: { color: theme.colors.text, fontSize: 30, fontWeight: '700' },
  body: { color: theme.colors.muted, fontSize: 16, lineHeight: 25 },
  card: { backgroundColor: theme.colors.primarySoft, borderRadius: theme.radius.md, padding: 24, gap: 12 },
  label: { color: theme.colors.primary, fontSize: 14, fontWeight: '600' },
  example: { color: theme.colors.text, fontSize: 21, lineHeight: 30 },
});
