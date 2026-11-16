import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { RouteLink } from '@/components/route-link';
import { Screen } from '@/components/screen';
import { theme } from '@/theme/theme';

export default function HistoryScreen() {
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Expense history' }} />
      <Text accessibilityRole="header" style={styles.title}>Your everyday, in one place.</Text>
      <View style={styles.card}>
        <Text style={styles.heading}>No expenses yet</Text>
        <Text style={styles.body}>
          Your purchases will appear here once expense recording is available.
          This preview does not store transactions.
        </Text>
      </View>
      <RouteLink href="/" label="Back to home" replace />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 30, fontWeight: '700', color: theme.colors.text },
  card: { backgroundColor: theme.colors.surface, padding: 24, borderRadius: theme.radius.md, gap: 12 },
  heading: { fontSize: 20, fontWeight: '600', color: theme.colors.text },
  body: { fontSize: 16, lineHeight: 25, color: theme.colors.muted },
});
