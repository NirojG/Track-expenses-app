import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme/theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Expenses</Text>
      <Text>A little clarity for your everyday spending.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text, marginBottom: 12 },
});
