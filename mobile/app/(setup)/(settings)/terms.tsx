import { Container } from '@/components/layout/Container';
import { Heading } from '@/components/ui/heading';
import { HEADINGS } from '@/config/text.config';
import { useCommonStore } from '@/store/common.store';
import React, { useEffect } from 'react';
import { View } from 'react-native';

export default function Terms() {
  const setHeaderLabel = useCommonStore((state) => state.setHeaderLabel);

  useEffect(() => {
    setHeaderLabel(HEADINGS.SETTINGS.TERMS);
  }, []);

  return (
    <View className={'flex flex-1'}>
      <Container>
        <Heading>Welcome to the Terms of Use Screen</Heading>
      </Container>
    </View>
  );
}
