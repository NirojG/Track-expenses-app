import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { theme } from '@/theme/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          title: 'Track Expenses',
          headerTintColor: theme.colors.text,
          headerStyle: { backgroundColor: theme.colors.surface },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      />
    </>
  );
}
