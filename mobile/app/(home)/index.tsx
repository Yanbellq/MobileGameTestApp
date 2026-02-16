import { ChevronDown, Lightning, Spot } from '@/components/icons';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { WidgetBottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Chart } from '@/components/ui/chart';
import { Heading } from '@/components/ui/heading/';
import { Widget } from '@/components/ui/widget';
import { bottomSheetSnapPoints } from '@/config/bottom-sheet.config';
import { chartConfig } from '@/config/chart.config';
import { GAME_NAVIGATION_GROUP, NAVIGATION } from '@/config/navigation.config';
import { HEADINGS } from '@/config/text.config';
import { RapidBottomSheet } from '@/features/widget/rapid-bottom-sheet'
import { SpotBottomSheet } from '@/features/widget/spot-bottom-sheet'
import { chartData } from '@/shared/data/chart.data';
import { useCommonStore } from '@/store/common.store';
import { cn } from '@/utils/cn.utils';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;
// - 90
export default function Home() {
  const setHeaderLabel = useCommonStore((state) => state.setHeaderLabel);
  const [openChart, setOpenChart] = useState(false);

  useEffect(() => {
    setHeaderLabel(HEADINGS.LOGO);
  }, []);

  const chartDataLastElement = chartData.datasets[0].data[chartData.datasets[0].data.length - 1];

  // 1. Створюємо Ref
  const rapidBottomSheetRef = useRef<BottomSheetModal>(null);
  const spotBottomSheetRef = useRef<BottomSheetModal>(null);

  // 2. Функція для відкриття
  const handleRapidOpenPress = useCallback(() => {
    console.log('handleOpenPress called', rapidBottomSheetRef.current);
    // index 1 відповідає другому значенню в snapPoints (наприклад, '50%')
    rapidBottomSheetRef.current?.present();
  }, []);
  const handleSpotOpenPress = useCallback(() => {
    console.log('handleOpenPress called', spotBottomSheetRef.current);
    // index 1 відповідає другому значенню в snapPoints (наприклад, '50%')
    spotBottomSheetRef.current?.present();
  }, []);

  return (
    <View className="flex-1">
      <Container>
        <ScrollView showsVerticalScrollIndicator={false} className={'overflow-visible'}>
          <Section>
            <View className="mb-2 flex w-full flex-col gap-6 overflow-hidden rounded bg-primary p-4 ">
              <View className="flex flex-row items-center justify-between py-4 pl-4">
                <View>
                  <Heading size={'xl'}>Your reaction:</Heading>
                  <Heading size={'2xl'} accent bold>
                    {chartDataLastElement}s
                  </Heading>
                </View>
                <Button variant="icon" effect="solid" onPress={() => setOpenChart(!openChart)}>
                  <View
                    className={cn(
                      'flex items-center justify-center',
                      openChart ? '-translate-y-1 rotate-[180deg]' : 'translate-y-1'
                    )}>
                    <ChevronDown />
                  </View>
                </Button>
              </View>
              <View className={cn('pr-2', openChart ? '' : 'hidden')}>
                <Chart data={chartData} width={screenWidth - 90} config={chartConfig} />
              </View>
            </View>
            <View className={'flex w-full flex-row items-center justify-between'}>
              <Widget size={'lg'} onPress={handleRapidOpenPress}>
                <View className="flex flex-col items-center gap-3">
                  <Lightning />
                  <Heading className="text-center" size="xl">
                    {HEADINGS.WIDGETS.RAPID}
                  </Heading>
                </View>
                <Heading accent bold size={'2xl'}>
                  25
                </Heading>
              </Widget>
              <Widget size={'lg'} onPress={handleSpotOpenPress}>
                <View className="flex flex-col items-center gap-3">
                  <Spot />
                  <Heading className="text-center" size="xl">
                    {HEADINGS.WIDGETS.SPOT}
                  </Heading>
                </View>
                <Heading accent bold size={'2xl'}>
                  45
                </Heading>
              </Widget>
            </View>
          </Section>
          <Section label={'Games'}>
            <View className={'flex w-full flex-row flex-wrap items-center justify-between gap-y-6'}>
              {GAME_NAVIGATION_GROUP.map((item, index) => {
                const Icon = item.icon;
                return (
                  <View className="w-[180px] self-start" key={index}>
                    <Widget onPress={item.action} className="mb-3 justify-center">
                      <Icon />
                    </Widget>
                    <Heading className="text-center" size="xl">
                      {item.label}
                    </Heading>
                  </View>
                );
              })}
            </View>
          </Section>
          <Section label={'Daily Challenges'}>
            <View className={'flex w-full flex-row items-center justify-between'}>
              <View className="w-[180px] self-start">
                <Widget
                  onPress={NAVIGATION.DAILY_TASK.action}
                  accent
                  className="mb-3 justify-center">
                  <NAVIGATION.DAILY_TASK.icon />
                </Widget>
                <Heading className="text-center" size="xl">
                  {NAVIGATION.DAILY_TASK.label}
                </Heading>
              </View>
            </View>
          </Section>
        </ScrollView>
        {/* <Heading>Welcome to the Home Screen</Heading> */}
      </Container>
      <RapidBottomSheet ref={rapidBottomSheetRef} />
      <SpotBottomSheet ref={spotBottomSheetRef} />
    </View>
  );
}
