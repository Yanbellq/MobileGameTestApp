import { Container } from '@/components/layout/Container';
import { Heading } from '@/components/ui/heading';
import { HEADINGS } from '@/config/text.config';
import { useCommonStore } from '@/store/common.store';
import React, { useEffect } from 'react';
import { View } from 'react-native';

export default function Contact() {
  const setHeaderLabel = useCommonStore((state) => state.setHeaderLabel);

  useEffect(() => {
    setHeaderLabel(HEADINGS.SETTINGS.CONTACT);
  }, []);

  return (
    <View className={'flex flex-1'}>
      <Container>
        <Heading>Welcome to the Contact-Us Screen</Heading>
      </Container>
    </View>
  );
}
