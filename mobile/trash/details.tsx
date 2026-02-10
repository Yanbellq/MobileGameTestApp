import { View } from 'react-native';

import { Stack, useLocalSearchParams } from 'expo-router';

import { Container } from '@/components/layout/Container';
import { ScreenContent } from '@/components/ScreenContent';
import { useCommonStore } from '@/store/common.store';
import { useEffect } from 'react';

export default function Details() {
  const { name } = useLocalSearchParams();

  useEffect(() => {
    useCommonStore.getState().setHeaderHeading(`Details for ${name}`);
  }, [name]);

  return (
    <View className={styles.container}>
      <Stack.Screen options={{ title: 'Details' }} />
      <Container>
        <ScreenContent path="screens/details.tsx" title={`Showing details for user ${name}`} />
      </Container>
    </View>
  );
}

const styles = {
  container: 'flex flex-1 bg-white',
};
