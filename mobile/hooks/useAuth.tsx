import { API } from '@/constants/api.constant'
import { useGameStore } from '@/store/game.store'
import axios from 'axios'
import { useEffect, useState } from 'react'

const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const { refreshToken, setToken, setUser, _hasHydrated } = useGameStore();

  useEffect(() => {
    const initAuth = async () => {
      // 1. Чекаємо, поки Zustand зчитає дані з AsyncStorage
      if (!_hasHydrated) return;

      // 2. Якщо після зчитування рефрешу немає — стоп
      if (!refreshToken) {
        console.log('No refresh token found after hydration');
        setLoading(false);
        return;
      }

      try {
        console.log('Attempting auto-refresh...');
        const { data } = await axios.post(`${API.BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        setToken(data.access_token, data.refresh_token);
        setUser(data.user);
      } catch (error) {
        setToken(null, null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [_hasHydrated]); // Залежність від гідратації ✅

  return { loading };
};

export default useAuth;