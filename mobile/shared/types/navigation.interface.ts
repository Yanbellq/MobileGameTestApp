import { Href } from 'expo-router';
import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

export interface INavLink {
  name?: string;
  label?: string;
  icon?: FC<SvgProps>;
  href?: Href; // Тепер опціонально
  action?: () => void; // Для таких речей як router.back()
}
