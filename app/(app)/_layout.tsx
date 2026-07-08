import { Stack } from 'expo-router';

import { RecycleHistoryProvider } from '@/contexts/recycle-history-context';

export default function AppGroupLayout() {
  return (
    <RecycleHistoryProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="recycle" />
      </Stack>
    </RecycleHistoryProvider>
  );
}