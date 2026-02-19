import { Container } from '@/components/layout/Container';
import { Button, ButtonGroup, ButtonIcon, ButtonText } from '@/components/ui/button';
import { SETTINGS_NAVIGATION_GROUP } from '@/config/navigation.config';
import { HEADINGS } from '@/config/text.config';
import { useCommonStore } from '@/store/common.store';
import React, { useEffect } from 'react';

export default function Settings() {
  const setHeaderLabel = useCommonStore((state) => state.setHeaderLabel);

  useEffect(() => {
    setHeaderLabel(HEADINGS.SETTINGS.HEADING);
  }, []);

  return (
    <Container>
      <ButtonGroup isAttached space={'none'}>
        {SETTINGS_NAVIGATION_GROUP.map((item) => (
          <Button
            key={item.label}
            onPress={item.action}
            variant={'ghost-link'}
            effect="solid"
            size="none"
            className="w-full">
            <ButtonIcon as={item.icon} />
            <ButtonText size={'default'}>{item.label}</ButtonText>
          </Button>
        ))}
      </ButtonGroup>
    </Container>
  );
}
