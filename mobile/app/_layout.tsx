// app/_layout.tsx

import { Background, Header, Loading } from '@/components/layout';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { STACK_CONFIG } from '@/config/stack.config';
import useAuth from '@/hooks/useAuth';
import { HistoryProvider } from '@/providers/HistoryProvider';
import { OverlayProvider } from '@gluestack-ui/overlay';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import '../global.css';
import { useGameStore } from '@/store/game.store'

// Створюємо клієнт (краще всередині компонента або за межами, якщо це синглтон)
const queryClient = new QueryClient();

export default function RootLayout() {
  const { loading } = useAuth();
  const { user, _hasHydrated } = useGameStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 1. Чекаємо повної готовності: і гідратації стору, і закінчення перевірки токенів
    if (!_hasHydrated || loading) return;

    const inAuthGroup =
      segments[0] === '(setup)' && segments[1] === '(profile)' && segments[2] === '(auth)';
    // Або простіше, якщо шлях містить auth
    const isAuthPage = segments.some((s) => s.includes('auth'));

    if (!user && !isAuthPage) {
      // Використовуємо setTimeout(0), щоб дати Expo Router час замонтувати Stack
      setTimeout(() => {
        router.replace('/auth');
      }, 0);
    } else if (user && isAuthPage) {
      setTimeout(() => {
        router.replace('/');
      }, 0);
    }
  }, [user, loading, _hasHydrated, segments]);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GluestackUIProvider mode="dark">
          <QueryClientProvider client={queryClient}>
            <BottomSheetModalProvider>
              <OverlayProvider>
                <HistoryProvider>
                  <Background>
                    {!_hasHydrated || loading ? (
                      <Loading />
                    ) : (
                      <>
                        <Header />
                        <Stack screenOptions={STACK_CONFIG.SCREEN_OPTIONS} />
                      </>
                    )}
                  </Background>
                </HistoryProvider>
              </OverlayProvider>
            </BottomSheetModalProvider>
          </QueryClientProvider>
        </GluestackUIProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
