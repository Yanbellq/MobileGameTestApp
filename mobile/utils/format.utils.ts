import { IWeeklyStatsResponse } from '@/services/game.service';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';

export interface IChartKitData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
}


export const formatMsToSeconds = (ms: number, decimals: number = 3): string => {
  return (ms / 1000).toFixed(decimals);
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatStatsToChartData = (
  stats: IWeeklyStatsResponse | undefined,
  fallbackData: IChartKitData
): IChartKitData => {
  if (!stats?.bestWeekData) {
    return fallbackData;
  }

  const labels = Object.keys(stats.bestWeekData);
  const data = Object.values(stats.bestWeekData).map((v) => v ?? 0);

  return {
    labels,
    datasets: [
      {
        data,
        color: (opacity = 1) => `rgba(47, 184, 255, ${opacity})`,
        strokeWidth: 10,
      },
    ],
  };
};
