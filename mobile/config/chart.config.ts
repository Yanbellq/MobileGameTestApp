import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';

export const chartConfig: AbstractChartConfig = {
  backgroundGradientFromOpacity: 0,
  backgroundGradientToOpacity: 0,
  color: () => `rgb(255, 255, 255)`,
  propsForBackgroundLines: {
    strokeWidth: 5,
    stroke: '#615f5f',
    strokeDasharray: '0',
    strokeOpacity: '0.2',
  },
};
