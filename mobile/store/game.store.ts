import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface GameState {
  score: number;
  playerName: string;
  increaseScore: (by: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      score: 0,
      playerName: 'Гравець 1',

      increaseScore: (by) => set((state) => ({ score: state.score + by })),

      resetGame: () => set({ score: 0 }),
    }),
    {
      name: 'game-storage', // Ключ, за яким дані збережуться в AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // Вказуємо, що використовуємо пам'ять телефона
      partialize: (state) => ({ score: state.score, playerName: state.playerName }), // Збережеться ТІЛЬКИ score та playerName, без функцій
    }
  )
);

/*

useStore((state) => state.score) — Використовується тільки всередині компонентів, щоб реагувати на зміни.

useStore.getState() — Використовується поза компонентами (у звичайних функціях), щоб просто прочитати дані один раз.

useStore.setState({ ... }) — Використовується для запису даних поза компонентами.

useStore.persist — Спеціальне API для керування збереженими даними.

*/
