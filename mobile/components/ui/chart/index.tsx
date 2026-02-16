import { View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';

interface Props {
  data: React.ComponentProps<typeof LineChart>['data'];
  width: number;
  config: AbstractChartConfig;
}

export function Chart({ data, width, config }: Props) {
  return (
    <View className="flex items-center justify-center">
      <LineChart
        data={data}
        width={width}
        height={220}
        chartConfig={config}
        withVerticalLines={false}
        fromNumber={100}
        fromZero
        bezier
        getDotProps={() => ({ r: '10' })}
      />
    </View>
  );
}
