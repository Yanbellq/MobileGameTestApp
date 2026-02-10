import { cn } from '@/utils/cn.utils';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

type BlurBlopPos = {
  x: string;
  y: string;
};

interface Props {
  color?: string;
  radius?: string;
  className?: string;
  zIndex?: number;
  pos?: BlurBlopPos;
}

export const BlurBlob = ({
  color = '#56CCF2',
  radius = '200',
  className,
  zIndex = -1,
  pos = { x: '5%', y: '400' },
}: Props) => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={[StyleSheet.absoluteFill, { zIndex: zIndex }]}
      className={cn(className, '')}
      pointerEvents="none">
      <Svg height="100%" width="100%">
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx={pos.x} cy={pos.y} r={radius} fill="url(#grad)" />
      </Svg>
    </View>
  );
};
