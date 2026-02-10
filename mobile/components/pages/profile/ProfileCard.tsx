import { Profile } from '@/components/icons';
import { NAVIGATION } from '@/config/navigation.config';
import { View } from 'react-native';
import { Button, ButtonIcon, ButtonText } from '../../ui/button';
import { Heading } from '../../ui/heading';
import { cn } from '@/utils/cn.utils'

interface Props {
  className?: string;
}

export function ProfileCard({ className = '' }: Props) {
  return (
    <View className={cn('flex flex-col items-center justify-center gap-12', className)}>
      <View className={'flex flex-col items-center justify-center gap-5'}>
        <Button onPress={() => {}} variant={'icon'} effect={'solid'} size={'icon-xl'}>
          <ButtonIcon as={Profile} size={'none'} />
        </Button>
        <Heading>Change Avatar</Heading>
      </View>

      <Button onPress={NAVIGATION.STATISTICS.action} variant={'link'} size="none">
        <ButtonIcon as={NAVIGATION.STATISTICS.icon} />
        <ButtonText size={'default'}>{NAVIGATION.STATISTICS.label}</ButtonText>
      </Button>
    </View>
  );
}
