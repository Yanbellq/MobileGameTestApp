import { Stack } from 'expo-router';
import { ComponentProps } from 'react';

type StackProps = ComponentProps<typeof Stack>;
type StackScreenOptions = StackProps['screenOptions'];

export const STACK_CONFIG: Record<string, StackScreenOptions> = {
  SCREEN_OPTIONS: {
    headerShown: false,
    contentStyle: { backgroundColor: 'transparent' },
    animation: 'none',
  },
};