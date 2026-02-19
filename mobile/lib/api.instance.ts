import { API } from '@/constants/api.constant';
import { useGameStore } from '@/store/game.store'
import axios from 'axios';
import { router } from 'expo-router'

// fixme @ts-ignore POTENTIAL PROBLEM
const { token } = useGameStore.getState()

export const apiClientUntoken = axios.create({
  // Заміни на свій IP, якщо тестуєш на телефоні (напр. 'http://192.168.1.5:3000/api')
  baseURL: API.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiClient = axios.create({
  // Заміни на свій IP, якщо тестуєш на телефоні (напр. 'http://192.168.1.5:3000/api')
  baseURL: API.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${token}`,
  },
});

// 1. Додаємо Access Token до кожного запиту
apiClient.interceptors.request.use((config) => {
  const token = useGameStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Обробляємо 401 помилку (Expired Token)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = useGameStore.getState().refreshToken;

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API.BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          // Оновлюємо все в сторі, включаючи юзера
          useGameStore.getState().setToken(data.access_token, data.refresh_token);
          if (data.user) useGameStore.getState().setUser(data.user);

          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return axios(originalRequest);
        } catch (refreshError) {
          useGameStore.getState().setUser(null);
          useGameStore.getState().setToken(null, null);
          router.replace('/auth'); // Перенаправлення при помилці
          return Promise.reject(refreshError);
        }
      }
    } 
    return Promise.reject(error);
  }
);