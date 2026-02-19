import { Pause, Play, ArrowLeft } from '@/components/icons';
import { Container } from '@/components/layout/Container';
import { Button, ButtonText } from '@/components/ui/button';
import { Chart } from '@/components/ui/chart';
import { Heading } from '@/components/ui/heading';
import { chartConfig } from '@/config/chart.config';
import { BUTTONS, HEADINGS } from '@/config/text.config';
import { COLORS } from '@/constants/colors.constants';
import { SpotItem } from '@/features/spot/spot-item';
import { Api } from '@/services/api.client'
import { IWeeklyStatsResponse } from '@/services/game.service'
import { chartData } from '@/shared/data/chart.data';
import { useCommonStore } from '@/store/common.store';
import { cn } from '@/utils/cn.utils';
import { formatStatsToChartData } from '@/utils/format.utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';

const GAME_STATE = {
  IDLE: 'idle',
  GAME: 'game',
  PAUSED: 'paused',
  RESULT: 'result',
} as const;

const screenWidth = Dimensions.get('window').width;

type GameState = (typeof GAME_STATE)[keyof typeof GAME_STATE];

const MATCH_COLORS = [
  COLORS.BLUE,
  COLORS.ORANGE,
  COLORS.PINK,
  COLORS.ACID,
  COLORS.BLOOD,
  COLORS.GRAY, // Fallback
];

export default function Spot() {
  const { setHeaderLabel, setHeaderRight, setHeaderLeft } = useCommonStore((state) => state);
  const [gameState, setGameState] = useState<GameState>(GAME_STATE.IDLE);
  const [usedTime, setUsedTime] = useState<number>(0.0);
  const [arrows, setArrows] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
  const [pairColors, setPairColors] = useState<Record<number, string>>({});

  const startTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const queryClient = useQueryClient();

  // 1. Отримуємо статистику для графіка
  const { data: stats } = useQuery<IWeeklyStatsResponse>({
    queryKey: ['spot-stats'],
    queryFn: () => Api.game.getStats('spot'),
  });

  // 2. Мутація для відправки результату
  const { mutate, isPending } = useMutation({
    mutationFn: (score: number) => Api.game.saveScore(score, 'spot'),
    onSuccess: () => {
      // Оновлюємо статку після успішного запису
      queryClient.invalidateQueries({ queryKey: ['spot-stats'] });
    },
  });

  useEffect(() => {
    setHeaderLabel(HEADINGS.GAME.SPOT);
    return () => stopTimer();
  }, [setHeaderLabel]);

  useEffect(() => {
    if (gameState === GAME_STATE.GAME) {
      setHeaderLeft(() => setGameState('idle'), ArrowLeft);
      setHeaderRight(handlePause, Pause);
    } else if (gameState === GAME_STATE.PAUSED) {
      setHeaderLeft(() => setGameState('idle'), ArrowLeft);
      setHeaderRight(handleResume, Play);
    } else {
      setHeaderLeft(null);
      setHeaderRight(null);
    }
  }, [gameState, setHeaderRight, setHeaderLeft]);

  const clear = () => {
    setMatchedIndices([]);
    setSelectedIndex(null);
    setPairColors({});
    setUsedTime(0);
    generateArrows();
    startTimer(0);
  };

  const startTimer = (initialOffset: number = 0) => {
    startTimeRef.current = Date.now() - initialOffset * 1000;
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const now = Date.now();
        const diff = (now - startTimeRef.current) / 1000;
        setUsedTime(parseFloat(diff.toFixed(1)));
      }
    }, 100);
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const generateArrows = () => {
    // 8 directions: 0, 45, 90, 135, 180, 225, 270, 315
    // We need pairs, so we'll have indices 0-7 twice.
    const baseAngles = [0, 45, 90, 135, 180, 225, 270, 315];
    let newArrows = [...baseAngles, ...baseAngles];

    // Shuffle (Fisher-Yates)
    for (let i = newArrows.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArrows[i], newArrows[j]] = [newArrows[j], newArrows[i]];
    }

    setArrows(newArrows);
  };

  const handlesStartGame = () => {
    clear();
    setGameState(GAME_STATE.GAME);
  };

  const handleReset = () => {
    clear();
    setGameState(GAME_STATE.IDLE);
  };

  const handlePause = () => {
    setGameState(GAME_STATE.PAUSED);
    stopTimer();
  };

  const handleResume = () => {
    setGameState(GAME_STATE.GAME);
    startTimer(usedTime);
  };

  const handleTap = (index: number) => {
    if (matchedIndices.includes(index)) return;

    if (selectedIndex === null) {
      // First selection
      setSelectedIndex(index);
    } else if (selectedIndex === index) {
      // Tap same item - toggle off? Or do nothing?
      // User said "toggle... change choice", let's deselect
      setSelectedIndex(null);
    } else {
      // Second selection
      const firstAngle = arrows[selectedIndex];
      const secondAngle = arrows[index];

      if (firstAngle === secondAngle) {
        // Match!
        const newMatched = [...matchedIndices, selectedIndex, index];
        setMatchedIndices(newMatched);

        // Assign color
        // Pairs found so far = (newMatched.length / 2) - 1
        // Use modulus to cycle colors
        const pairIndex = newMatched.length / 2 - 1;
        const color = MATCH_COLORS[pairIndex % MATCH_COLORS.length];

        setPairColors((prev) => ({
          ...prev,
          [selectedIndex]: color,
          [index]: color,
        }));

        setSelectedIndex(null);

        // Check Win
        if (newMatched.length === arrows.length) {
          stopTimer();

          // Розраховуємо ТОЧНИЙ фінальний час прямо зараз ✅
          const finalTimeMs = Date.now() - (startTimeRef.current || 0);
          const finalTimeSec = parseFloat((finalTimeMs / 1000).toFixed(1));

          setUsedTime(finalTimeSec); // Оновлюємо UI до фінального значення
          mutate(finalTimeSec); // Відправляємо в базу ТОЧНО ТЕ САМЕ число

          setGameState(GAME_STATE.RESULT);
        }
      } else {
        // No match - switch selection to the new one
        setSelectedIndex(index);
      }
    }
  };

  // 3. Форматуємо дані для ChartKit
  const formattedChartData = useMemo(() => formatStatsToChartData(stats, chartData), [stats]);

  const renderHeading = () => {
    switch (gameState) {
      case GAME_STATE.IDLE:
        return 'Find the cells that are different from the others as quickly as possible.';
      case GAME_STATE.RESULT:
        return usedTime !== null ? `${usedTime}s` : 'Game Over';
      default:
        return '';
    }
  };

  const renderButton = () => {
    if (gameState === GAME_STATE.IDLE) {
      return (
        <>
          <Button onPress={handlesStartGame} variant={'default'} size="none" className="py-7">
            <ButtonText size={'title'} className="text-accent">
              {BUTTONS.START}
            </ButtonText>
          </Button>
        </>
      );
    }
    if (gameState === GAME_STATE.RESULT) {
      return (
        <Button onPress={handleReset} variant={'default'} size="none" className="py-7">
          <ButtonText size={'title'} className="text-accent">
            {BUTTONS.RESTART}
          </ButtonText>
        </Button>
      );
    }
    return null;
  };

  return (
    <Container className="flex-col items-center justify-between">
      <View className="flex flex-col items-center gap-3">
        {gameState === GAME_STATE.RESULT && <Heading>Your time:</Heading>}
        <Heading
          className={cn(
            'max-w-80 text-center text-accent',
            gameState === GAME_STATE.IDLE && 'text-yellow'
          )}
          size={
            gameState === GAME_STATE.IDLE ? 'lg' : gameState === GAME_STATE.RESULT ? '4xl' : '2xl'
          }
          bold={gameState === GAME_STATE.RESULT}>
          {renderHeading()}
        </Heading>
      </View>

      {gameState === GAME_STATE.RESULT ? (
        <View className="flex flex-col gap-5">
          <View className="flex flex-col gap-1 pl-3">
            <Heading>Your reaction progress:</Heading>
            <Heading accent bold size={'2xl'}>
              {stats?.bestEverData ?? '--'}
            </Heading>
          </View>

          <Chart data={formattedChartData} width={screenWidth - 90} config={chartConfig} />
        </View>
      ) : gameState === GAME_STATE.IDLE ? (
        <></>
      ) : (
        <>
          <View className="flex w-full flex-row items-center justify-between">
            <Heading size={'xl'}>
              Pair left:{' '}
              <Heading accent bold size={'2xl'}>
                {(arrows.length - matchedIndices.length) / 2}
              </Heading>
            </Heading>
            <Heading size={'xl'}>
              Time:{' '}
              <Heading accent bold size={'2xl'}>
                {usedTime}s
              </Heading>
            </Heading>
          </View>
          <View className="flex w-full flex-1 flex-col flex-wrap items-center justify-center gap-4">
            <View className="flex flex-row flex-wrap items-center justify-center gap-4">
              {arrows.map((angle, index) => {
                const isSelected = selectedIndex === index;
                const isMatched = matchedIndices.includes(index);
                const color = isMatched ? pairColors[index] : COLORS.SKY; // Default SKY, matched color if found

                return (
                  <SpotItem
                    key={index}
                    style={{
                      width: '21.8%',
                      height: '19%',
                      borderWidth: isSelected ? 2 : 0,
                      borderColor: isSelected ? COLORS.RED : 'transparent',
                      opacity: isMatched ? 0.8 : 1, // Optional visual cue
                    }}
                    onPress={() => handleTap(index)}
                    disabled={isMatched || gameState === GAME_STATE.PAUSED}>
                    <ArrowLeft style={{ transform: [{ rotate: `${angle}deg` }] }} color={color} />
                  </SpotItem>
                );
              })}
            </View>
          </View>
        </>
      )}

      <View className="flex flex-col gap-6">{renderButton()}</View>
    </Container>
  );
}
