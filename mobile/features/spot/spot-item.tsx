import { cn } from '@/utils/cn.utils';
import { createButton } from '@gluestack-ui/core/button/creator';
import { UIIcon } from '@gluestack-ui/core/icon/creator';
import { withStyleContext } from '@gluestack-ui/utils/nativewind-utils';
import { ActivityIndicator, Pressable, PressableProps, Text, View } from 'react-native';
import { VariantProps } from 'tailwind-variants';
import { spotItemStyle } from './styles';

const SCOPE = 'BUTTON';
const Root = withStyleContext(Pressable, SCOPE);
const UIButton = createButton({
  Root: Root,
  Text,
  Group: View,
  Spinner: ActivityIndicator,
  Icon: UIIcon,
});

interface Props extends VariantProps<typeof spotItemStyle>, PressableProps {
  children?: React.ReactNode;
  className?: string;
}

export function SpotItem({
  children,
  className = '',
  variant = 'default',
  size = 'default',
  ...props
}: Props) {
  return (
    <UIButton
      className={cn(spotItemStyle({ variant, size }), className)}
      {...props}>
      {children}
    </UIButton>
  );
}
