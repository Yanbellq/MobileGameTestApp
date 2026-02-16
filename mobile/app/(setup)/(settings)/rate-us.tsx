import { Container } from '@/components/layout/Container';
import { Heading } from '@/components/ui/heading';
import { HEADINGS } from '@/config/text.config';
import { useCommonStore } from '@/store/common.store';
import React, { useEffect } from 'react';
import { View } from 'react-native';

export default function Rate() {
  const setHeaderLabel = useCommonStore((state) => state.setHeaderLabel);

  useEffect(() => {
    setHeaderLabel(HEADINGS.SETTINGS.RATE);
  }, []);

  return (
    <View className={'flex flex-1'}>
      <Container>
        <Heading>Welcome to the Rate-Us Screen</Heading>
      </Container>
    </View>
  );
}
