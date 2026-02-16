// import { SafeAreaView } from 'react-native';
import { cn } from '@/utils/cn.utils';
import { View } from 'react-native'

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const Container = ({ className = '', children }: Props) => {
  return <View className={cn(className, 'm-8 flex flex-1 ')}>{children}</View>;
};
