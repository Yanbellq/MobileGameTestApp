import { NAVIGATION } from '@/config/navigation.config';
import { PAGES } from '@/config/pages.config';
import { useHistory } from '@/providers/HistoryProvider';
import { useCommonStore } from '@/store/common.store';
import { cn } from '@/utils/cn.utils';
import { usePathname } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ButtonIcon } from '../ui/button';
import { Heading } from '../ui/heading';

interface Props {
  className?: string;
}

export function Header({ className = '' }: Props) {
  const insets = useSafeAreaInsets();
  const {
    headerLabel: label,
    headerRightAction,
    headerRightIcon: HeaderRightIcon,
  } = useCommonStore((state) => state);

  const pathname = usePathname();

  const { history } = useHistory();
  // The second to last entry is the previous page
  const previousUrl = history[history.length - 2] || '/';

  return (
    <View className={'px-4'} style={{ paddingTop: insets.top }}>
      <View className={cn(className, 'flex h-16 flex-row items-center justify-between')}>
        {pathname === PAGES.HOME ? (
          <Button variant={'icon'} effect="solid" onPress={NAVIGATION.PROFILE.action}>
            <ButtonIcon as={NAVIGATION.PROFILE.icon} />
          </Button>
        ) : (
          <Button
            variant={'icon'}
            effect="solid"
            onPress={() => NAVIGATION.BACK.action(previousUrl)}>
            <ButtonIcon as={NAVIGATION.BACK.icon} />
          </Button>
        )}

        <Heading size={'xl'} bold>
          {label}
        </Heading>

        {headerRightAction && HeaderRightIcon ? (
          <Button variant={'icon'} effect="solid" onPress={headerRightAction}>
            <ButtonIcon as={HeaderRightIcon} />
          </Button>
        ) : pathname === PAGES.HOME ? (
          <Button variant={'icon'} effect="solid" onPress={NAVIGATION.SETTINGS.action}>
            <ButtonIcon as={NAVIGATION.SETTINGS.icon} />
          </Button>
        ) : (
          // Fix to prevent layout shift when navigating history will work good
          // <View className="h-20 w-20" />
          <Button variant={'icon'} effect="solid" onPress={NAVIGATION.HOME.action}>
            <ButtonIcon className={'h-7 w-7 text-gray'} as={NAVIGATION.HOME.icon} />
          </Button>
        )}
      </View>
    </View>
  );
}
