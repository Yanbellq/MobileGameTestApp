import { Container } from '@/components/layout/Container';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { BUTTONS, HEADINGS } from '@/config/text.config';
import { ProfileCard } from '@/features/profile/profile-card';
import { useCommonStore } from '@/store/common.store';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function Profile() {
  const setHeaderLabel = useCommonStore((state) => state.setHeaderLabel);

  useEffect(() => {
    setHeaderLabel(HEADINGS.PROFILE.HEADING);
  }, []);

  return (
    <Container className="flex-col items-center justify-between">
      <ProfileCard />

      <View className="flex flex-col items-center justify-center">
        <Heading className="pb-6 font-bold">
          Date Joined:{' '}
          <Heading accent bold>
            January 10, 2024
          </Heading>
        </Heading>

        <Button onPress={() => {}} variant={'default'} size="none" className="py-7">
          <ButtonText size={'title'} className="text-yellow">
            {BUTTONS.SUBSCRIPTION}
          </ButtonText>
        </Button>
      </View>
    </Container>
  );
}
