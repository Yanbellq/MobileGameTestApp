import { NAVIGATION } from '@/config/navigation.config';
import { PAGES } from '@/constants/pages.constants';
import { ButtonComponent } from '@/features/header/button';
import { useHistory } from '@/providers/HistoryProvider';
import { useCommonStore } from '@/store/common.store';
import { useGameStore } from '@/store/game.store';
import { cn } from '@/utils/cn.utils';
import { usePathname } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heading } from '../ui/heading';

interface Props {
  className?: string;
}

export function Header({ className = '' }: Props) {
  const insets = useSafeAreaInsets();
  const {
    headerLabel: label,

    headerLeftAction,
    headerLeftIcon: HeaderLeftIcon,

    headerRightAction,
    headerRightIcon: HeaderRightIcon,
  } = useCommonStore((state) => state);

  const { user } = useGameStore((state) => state);

  const pathname = usePathname();

  // const { history } = useHistory();
  // The second to last entry is the previous page
  // const previousUrl = history[history.length - 2] || '/';

  const isAuthPage = pathname.includes('auth');
  const isForgotPage = pathname.includes('forgot-password')

  const renderLeftButton = () => {
    if (headerLeftAction && HeaderLeftIcon)
      return <ButtonComponent icon={HeaderLeftIcon} action={headerLeftAction} />;

    if (pathname === PAGES.HOME) {
      if (!user)
        return <ButtonComponent icon={NAVIGATION.AUTH.icon} action={NAVIGATION.AUTH.action} />;
      return <ButtonComponent icon={NAVIGATION.PROFILE.icon} action={NAVIGATION.PROFILE.action} />;
    }

    // fixme change to IDLE in game pages
    return <ButtonComponent icon={NAVIGATION.BACK.icon} action={NAVIGATION.HOME.action} />;
  };

  const renderRightButton = () => {
    if (headerRightAction && HeaderRightIcon)
      return (
        <ButtonComponent
          icon={HeaderRightIcon}
          action={headerRightAction}
          iconClassName={'h-7 w-7 text-gray'}
        />
      );
    if (pathname === PAGES.HOME)
      return (
        <ButtonComponent icon={NAVIGATION.SETTINGS.icon} action={NAVIGATION.SETTINGS.action} />
      );

    return (
      <ButtonComponent
        icon={NAVIGATION.HOME.icon}
        action={NAVIGATION.HOME.action}
        iconClassName={'h-7 w-7 text-gray'}
      />
    );
  };

  return (
    <View className={'px-4'} style={{ paddingTop: insets.top }}>
      <View className={cn(className, 'flex h-16 flex-row items-center justify-between')}>
        {!isAuthPage && !isForgotPage ? renderLeftButton() : <View className="h-20 w-20" />}

        <Heading size={'xl'} bold>
          {label}
        </Heading>

        {!isAuthPage && !isForgotPage ? renderRightButton() : <View className="h-20 w-20" />}
      </View>
    </View>
  );
}
