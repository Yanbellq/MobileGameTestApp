import { cn } from '@/utils/cn.utils';
import { withStyleContext, type VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { Pressable, View, Text, type PressableProps, ActivityIndicator } from 'react-native';
import { widgetStyle } from './style';
import { createButton } from '@gluestack-ui/core/button/creator'
import { UIIcon } from '@gluestack-ui/core/icon/creator'

const SCOPE = 'BUTTON';
const Root = withStyleContext(Pressable, SCOPE);
const UIButton = createButton({
  Root: Root,
  Text,
  Group: View,
  Spinner: ActivityIndicator,
  Icon: UIIcon,
});

interface Props extends VariantProps<typeof widgetStyle>, PressableProps {
  className?: string;
  children?: React.ReactNode;
}

export function Widget({
  className = '',
  variant = 'default',
  size = 'default',
  accent = false,
  children,
  ...props
}: Props) {
  return (
    <UIButton
      className={cn(widgetStyle({ variant, size, accent: accent as boolean }), className)}
      {...props}>
      {children}
    </UIButton>
  );
}
