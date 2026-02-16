import { cn } from '@/utils/cn.utils';
import { View } from 'react-native';
import { Heading } from '../ui/heading';

interface IGeneralProps {
  className?: string;
	label?: string
}

type TSectionProps = IGeneralProps & {
	children?: React.ReactNode;
};
type TSectionTitleProps = IGeneralProps;


export function Section({ className = '', children, label }: TSectionProps) {
  return (
    <View className={cn('flex flex-col gap-4 items-center mb-6', className)}>
      {label && <SectionTitle label={label} />}

			{ children }
    </View>
  );
}

export function SectionTitle({ className = '', label }: TSectionTitleProps) {
  return <Heading size={'2xl'} className={cn('font-bold', className)}>{label ? label : 'Section Title'}</Heading>;
}
