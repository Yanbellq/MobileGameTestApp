import { Container } from '@/components/layout/Container';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { BUTTONS, HEADINGS } from '@/config/text.config';
import { PAGES } from '@/constants/pages.constants'
import { ProfileCard } from '@/features/profile/profile-card';
import { useCommonStore } from '@/store/common.store';
import { useGameStore } from '@/store/game.store'
import { formatDate } from '@/utils/format.utils'
import { router } from 'expo-router'
import { LogOut } from 'lucide-react-native'
import { useEffect } from 'react';
import { View } from 'react-native';

export default function Profile() {
  const { setHeaderLabel, setHeaderRight, setHeaderLeft } = useCommonStore((state) => state);
  const { user, setUser, setToken } = useGameStore((state) => state);

  useEffect(() => {
    setHeaderRight(handleLogOut, LogOut);
  }, [setHeaderRight]);

  const handleLogOut = () => {
    setUser(null);
    setToken(null, null);
    router.push(PAGES.AUTH)
  }

  useEffect(() => {
    setHeaderLabel(HEADINGS.PROFILE.HEADING);
    setHeaderLeft(null);
  }, []);

  return (
    <Container className="flex-col items-center justify-between">
      <ProfileCard username={user?.username || ''} />

      <View className="flex flex-col items-center justify-center">
        <Heading className="pb-6 font-bold">
          Date Joined:{' '}
          <Heading accent bold>
            {formatDate(user?.createdAt || '')}
          </Heading>
        </Heading>

        <Button onPress={() => router.push(PAGES.CHANGE_PASSWORD)} variant={'default'} size="none" className="py-7">
          <ButtonText size={'title'} className="text-yellow">
            {BUTTONS.CHANGE_PASSWORD}
          </ButtonText>
        </Button>
      </View>
    </Container>
  );
}
