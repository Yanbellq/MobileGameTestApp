import { IUser } from '@/shared/types/user.interface'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface GameState {
  _hasHydrated: boolean; // Додай це поле ✅
  setHasHydrated: (state: boolean) => void;
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  token: string | null;
  refreshToken: string | null;
  setToken: (token: string | null, refreshToken: string | null) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      user: null,
      setUser: (user) => set({ user }),
      token: null,
      refreshToken: null,
      setToken: (token, refreshToken) => set({ token, refreshToken }),
    }),
    {
      name: 'game-storage', // Ключ, за яким дані збережуться в AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // Вказуємо, що використовуємо пам'ять телефона
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // Викликається, коли дані зчитано ✅
      },
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken, // Тепер зберігаємо все ✅
      }), // Збережеться ТІЛЬКИ score та user, без функцій
    }
  )
);

/*

useStore((state) => state.score) — Використовується тільки всередині компонентів, щоб реагувати на зміни.

useStore.getState() — Використовується поза компонентами (у звичайних функціях), щоб просто прочитати дані один раз.

useStore.setState({ ... }) — Використовується для запису даних поза компонентами.

useStore.persist — Спеціальне API для керування збереженими даними.

*/
