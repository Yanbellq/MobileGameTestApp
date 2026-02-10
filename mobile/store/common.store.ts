import { HEADINGS } from '@/config/text.config';
import { create } from 'zustand';

export interface CommonState {
  headerLabel: string;
  setHeaderLabel: (label: string) => void;
}

export const useCommonStore = create<CommonState>((set) => ({
  headerLabel: HEADINGS.LOGO,
  setHeaderLabel: (label) => set({ headerLabel: label }),
}));
