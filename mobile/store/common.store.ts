import { HEADINGS } from '@/config/text.config';
import { create } from 'zustand';

export interface CommonState {
  headerLabel: string;
  setHeaderLabel: (label: string) => void;

  headerRightAction: (() => void) | null;
  headerRightIcon: any | null;
  setHeaderRight: (action: (() => void) | null, icon?: any | null) => void;

  bgGradientColors: [string, string];
  setBgGradientColors: (colors: [string, string]) => void;
}

export const useCommonStore = create<CommonState>((set) => ({
  headerLabel: HEADINGS.LOGO,
  setHeaderLabel: (label) => set({ headerLabel: label }),

  headerRightAction: null,
  headerRightIcon: null,
  setHeaderRight: (action, icon) => set({ headerRightAction: action, headerRightIcon: icon }),

  bgGradientColors: ['#2A2D32', '#1D1D1D'],
  setBgGradientColors: (colors) => set({ bgGradientColors: colors }),
}));
