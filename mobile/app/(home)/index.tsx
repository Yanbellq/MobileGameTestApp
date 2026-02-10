import { Lightning, Spot } from '@/components/icons';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Heading } from '@/components/ui/heading/';
import { Widget } from '@/components/ui/widget';
import { GAME_NAVIGATION_GROUP, NAVIGATION } from '@/config/navigation.config';
import { HEADINGS } from '@/config/text.config';
import { useCommonStore } from '@/store/common.store';
import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';

export default function Home() {
  const setHeaderLabel = useCommonStore((state) => state.setHeaderLabel);

  useEffect(() => {
    setHeaderLabel(HEADINGS.LOGO);
  }, []);

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false} className={'overflow-visible'}>
        <Section>
          <View className={'flex w-full flex-row items-center justify-between'}>
            <Widget size={'lg'}>
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
            <Widget size={'lg'}>
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
              <Widget onPress={NAVIGATION.DAILY_TASK.action} accent className="mb-3 justify-center">
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
  );
}
