import { Button, ButtonIcon } from '@/components/ui/button'
import { cn } from '@/utils/cn.utils'
import { FC } from 'react'
import { SvgProps } from 'react-native-svg'

interface ButtonProps {
  icon: FC<SvgProps>;
	action: () => void;
	iconClassName?: string
}

export function ButtonComponent({ icon, action, iconClassName = '' }: ButtonProps) {
  return (
    <Button variant={'icon'} effect="solid" onPress={action}>
      <ButtonIcon as={icon} className={cn('', iconClassName)} />
    </Button>
  );
}
