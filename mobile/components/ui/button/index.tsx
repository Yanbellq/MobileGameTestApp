'use client';

import { ChevronRight, IconButtonBorder } from '@/components/icons';
import { cn } from '@/utils/cn.utils';
import { createButton } from '@gluestack-ui/core/button/creator';
import { PrimitiveIcon, UIIcon } from '@gluestack-ui/core/icon/creator';
import {
  useStyleContext,
  withStyleContext,
  type VariantProps,
} from '@gluestack-ui/utils/nativewind-utils';
import { GlassView } from 'expo-glass-effect';
import { cssInterop } from 'nativewind';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { BlurBlob } from '../blur-blob';
import {
  buttonGroupStyle,
  buttonIconStyle,
  buttonSpinnerStyle,
  buttonStyle,
  buttonTextStyle,
} from './styles';

const SCOPE = 'BUTTON';
const Root = withStyleContext(Pressable, SCOPE);
const UIButton = createButton({
  Root: Root,
  Text,
  Group: View,
  Spinner: ActivityIndicator,
  Icon: UIIcon,
});
cssInterop(PrimitiveIcon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: 'classNameColor',
      stroke: true,
    },
  },
});
cssInterop(GlassView, {
  className: 'style',
});

type IButtonProps = Omit<React.ComponentPropsWithoutRef<typeof UIButton>, 'context'> &
  VariantProps<typeof buttonStyle> & { className?: string; effect?: 'glass' | 'solid' };

type IButtonTextProps = React.ComponentPropsWithoutRef<typeof UIButton.Text> &
  VariantProps<typeof buttonTextStyle> & { className?: string };

type IButtonIcon = React.ComponentPropsWithoutRef<typeof UIButton.Icon> &
  VariantProps<typeof buttonIconStyle> & {
    className?: string | undefined;
    as?: React.ElementType;
    height?: number;
    width?: number;
  };

type IButtonGroupProps = React.ComponentPropsWithoutRef<typeof UIButton.Group> &
  VariantProps<typeof buttonGroupStyle>;

const Button = React.forwardRef<React.ElementRef<typeof UIButton>, IButtonProps>(
  (
    { className = '', variant = 'default', effect = 'glass', size = 'default', children, ...props },
    ref
  ) => {
    const isAnyLink = ['link', 'ghost-link'].includes(variant);

    return (
      <UIButton
        ref={ref}
        {...props}
        className={cn(buttonStyle({ variant, size }))}
        context={{ variant, size }}>
        {(pressableState: any) => {
          // Створюємо контент
          const content = (
            <View
              className={cn(
                'flex-row items-center px-8 py-5',
                isAnyLink ? 'justify-between' : 'justify-center',
                className
              )}>
              {isAnyLink ? (
                <View className={'flex flex-row items-center gap-3'}>
                  {typeof children === 'function' ? children(pressableState) : children}
                </View>
              ) : typeof children === 'function' ? (
                children(pressableState)
              ) : (
                children
              )}

              <View>{isAnyLink && <ButtonIcon as={ChevronRight} size={'icon'} />}</View>
            </View>
          );

          // Якщо варіант glass — огортаємо у GlassView
          if (effect === 'glass') {
            return (
              <GlassView
                glassEffectStyle="clear"
                // Можна додати класи для закруглення, якщо cssInterop налаштований
                className="w-full overflow-hidden rounded-full">
                {content}
              </GlassView>
            );
          }

          // Для інших варіантів рендеримо як було (з вашою логікою BlurBlob тощо)
          return (
            <>
              {variant === 'icon' && (
                <>
                  <View className={'pointer-events-none absolute'}>
                    {size === 'icon-xl' ? (
                      <IconButtonBorder height={180} width={180} />
                    ) : (
                      <IconButtonBorder />
                    )}
                  </View>
                  <BlurBlob
                    className={'pointer-events-none absolute'}
                    radius={size === 'icon-xl' ? '80' : '30'}
                    color={'#FFFFFF'}
                    zIndex={5}
                    pos={size === 'icon-xl' ? { x: '75', y: '75' } : { x: '35', y: '35' }}
                  />
                  <BlurBlob
                    className={'pointer-events-none absolute'}
                    radius={size === 'icon-xl' ? '80' : '30'}
                    color={'#202122'}
                    zIndex={10}
                    pos={size === 'icon-xl' ? { x: '115', y: '115' } : { x: '55', y: '55' }}
                  />
                </>
              )}
              {content}
            </>
          );
        }}
      </UIButton>
    );
  }
);

const ButtonText = React.forwardRef<React.ElementRef<typeof UIButton.Text>, IButtonTextProps>(
  ({ className, size, ...props }, ref) => {
    const { size: parentSize, variant: parentVariant } = useStyleContext(SCOPE);
    return (
      <UIButton.Text
        ref={ref}
        {...props}
        className={buttonTextStyle({
          parentVariants: {
            size: parentSize,
            variant: parentVariant,
          },
          size,
          class: className,
        })}
      />
    );
  }
);

const ButtonSpinner = React.forwardRef<
  React.ElementRef<typeof UIButton.Spinner>,
  React.ComponentPropsWithoutRef<typeof UIButton.Spinner>
>(({ className, size, ...props }, ref) => {
  const { size: parentSize } = useStyleContext(SCOPE);
  return (
    <UIButton.Spinner
      ref={ref}
      {...props}
      className={buttonSpinnerStyle({
        parentVariants: { size: parentSize },
        class: className,
        size,
      })}
    />
  );
});

const ButtonIcon = React.forwardRef<React.ElementRef<typeof UIButton.Icon>, IButtonIcon>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    if (typeof size === 'number') {
      return (
        <UIButton.Icon
          ref={ref}
          {...props}
          className={buttonIconStyle({ class: className })}
          size={size}
        />
      );
    } else if ((props.height !== undefined || props.width !== undefined) && size === undefined) {
      return (
        <UIButton.Icon ref={ref} {...props} className={buttonIconStyle({ class: className })} />
      );
    }
    return (
      <UIButton.Icon
        {...props}
        className={buttonIconStyle({
          parentVariants: {
            size,
            variant,
          },
          size,
          class: className,
        })}
        ref={ref}
      />
    );
  }
);

const ButtonGroup = React.forwardRef<React.ElementRef<typeof UIButton.Group>, IButtonGroupProps>(
  (
    { className, space = 'md', isAttached = false, flexDirection = 'row', children, ...props },
    ref
  ) => {
    return (
      <UIButton.Group
        className={cn(
          buttonGroupStyle({
            space,
            isAttached,
            flexDirection,
          }),
          className
        )}
        {...props}
        ref={ref}>
        <GlassView
          glassEffectStyle="clear"
          // Можна додати класи для закруглення, якщо cssInterop налаштований
          className="w-full overflow-hidden rounded">
          {children}
        </GlassView>
      </UIButton.Group>
    );
  }
);

Button.displayName = 'Button';
ButtonText.displayName = 'ButtonText';
ButtonSpinner.displayName = 'ButtonSpinner';
ButtonIcon.displayName = 'ButtonIcon';
ButtonGroup.displayName = 'ButtonGroup';

export { Button, ButtonGroup, ButtonIcon, ButtonSpinner, ButtonText };
