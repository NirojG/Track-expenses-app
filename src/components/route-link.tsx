import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '@/theme/theme';

type Props = { href: Href; label: string; replace?: boolean };

export function RouteLink({ href, label, replace = false }: Props) {
  return (
    <Link href={href} replace={replace} asChild>
      <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
  },
  pressed: { backgroundColor: theme.colors.primaryPressed },
  label: { color: theme.colors.onPrimary, fontSize: 16, fontWeight: '600' },
});
