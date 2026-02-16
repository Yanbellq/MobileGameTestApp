// app/_layout.tsx

import { Background, Header, Loading } from '@/components/layout';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { STACK_CONFIG } from '@/config/stack.config';
import useAuth from '@/hooks/useAuth';
import { HistoryProvider } from '@/providers/HistoryProvider';
import { OverlayProvider } from '@gluestack-ui/overlay';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

export default function RootLayout() {
  const { loading } = useAuth();

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GluestackUIProvider mode="dark">
          <BottomSheetModalProvider>
            <OverlayProvider>
              <HistoryProvider>
                <Background>
                  {loading ? (
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
        </GluestackUIProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
