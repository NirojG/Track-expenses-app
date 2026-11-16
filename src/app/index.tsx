import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { theme } from '@/theme/theme';

const actions: { number: string; title: string; description: string; href: Href }[] = [
  { number: '01', title: 'Scan receipt', description: 'A photo. Every detail kept.', href: '/record/scan' },
  { number: '02', title: 'Record by voice', description: 'Say what you spent, naturally.', href: '/record/voice' },
  { number: '03', title: 'Type expense', description: 'A quick note, in your own words.', href: '/record/type' },
];

export default function HomeScreen() {
  return (
    <Screen>
      <View style={styles.intro}>
        <Text style={styles.eyebrow}>A LITTLE CLARITY, EVERY DAY</Text>
        <Text accessibilityRole="header" style={styles.title}>Less effort. More insight.</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroLabel}>YOUR SPENDING, SIMPLIFIED</Text>
        <Text style={styles.heroTitle}>Small moments.{ '\n' }A clearer picture.</Text>
        <Text style={styles.heroBody}>
          From your morning coffee to the weekly shop. Make room for a simpler habit.
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Early preview · Recording coming soon</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.sectionTitle}>Three ways to make it easy</Text>
        <Text style={styles.body}>Explore how you’ll record an expense.</Text>
        {actions.map((action) => (
          <Link key={action.href.toString()} href={action.href} asChild>
            <Pressable
              accessibilityLabel={`${action.title}, preview`}
              accessibilityHint="Learn about this upcoming recording feature"
              style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}>
              <View style={styles.numberBadge} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                <Text style={styles.number}>{action.number}</Text>
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </View>
              <Text style={styles.arrow} accessible={false}>›</Text>
            </Pressable>
          </Link>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>Recent expenses</Text>
          <Link href="/history" asChild>
            <Pressable style={styles.historyLink}>
              <Text style={styles.historyLabel}>View history →</Text>
            </Pressable>
          </Link>
        </View>
        <View style={styles.emptyCard}>
          <Text style={styles.actionTitle}>A fresh start</Text>
          <Text style={styles.body}>
            No expenses yet. Your spending overview will grow here as recording becomes available.
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: 10 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.7, color: theme.colors.primary },
  title: { fontSize: 30, fontWeight: '700', letterSpacing: -0.7, color: theme.colors.text },
  hero: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.lg, padding: 28, gap: 18 },
  heroLabel: { color: theme.colors.onPrimary, fontSize: 11, fontWeight: '600', letterSpacing: 1.5 },
  heroTitle: { color: theme.colors.onPrimary, fontSize: 32, fontWeight: '700', letterSpacing: -0.7 },
  heroBody: { color: theme.colors.onPrimary, fontSize: 16, lineHeight: 25 },
  badge: { alignSelf: 'flex-start', backgroundColor: theme.colors.primaryPressed, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  badgeText: { color: theme.colors.onPrimary, fontSize: 12, lineHeight: 18, fontWeight: '500' },
  section: { gap: 12 },
  sectionTitle: { color: theme.colors.text, fontSize: 20, fontWeight: '700' },
  body: { color: theme.colors.muted, fontSize: 15, lineHeight: 24 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 88, backgroundColor: theme.colors.surface, padding: 18, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border },
  actionPressed: { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.primary },
  numberBadge: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: theme.colors.primarySoft },
  number: { color: theme.colors.primary, fontSize: 15, fontWeight: '700' },
  actionText: { flex: 1, gap: 5 },
  actionTitle: { color: theme.colors.text, fontSize: 17, fontWeight: '600' },
  actionDescription: { color: theme.colors.muted, fontSize: 14, lineHeight: 21 },
  arrow: { color: theme.colors.primary, fontSize: 28 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', columnGap: 12 },
  historyLink: { minHeight: 48, justifyContent: 'center' },
  historyLabel: { color: theme.colors.primary, fontSize: 14, fontWeight: '600' },
  emptyCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, padding: 24, gap: 10 },
});
