import { useStore } from '@/store/game.store';

export const resetProgress = () => {
  // Викликаємо persist безпосередньо у хука-стора
  useStore.persist.clearStorage();

  // Також корисно примусово скинути стан у пам'яті до початкового,
  // бо clearStorage видаляє дані з диска, але не змінює поточний стан у грі
  // useStore.setState({ score: 0, playerName: "Гравець 1" });
};
