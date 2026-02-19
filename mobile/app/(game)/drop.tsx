import { Pause, Play, ArrowLeft } from '@/components/icons';
import { CircleOutline, Oval, Square } from '@/components/icons/game';
import { Container } from '@/components/layout/Container';
import { Button, ButtonText } from '@/components/ui/button';
import { Chart } from '@/components/ui/chart';
import { Heading } from '@/components/ui/heading';
import { chartConfig } from '@/config/chart.config';
import { BUTTONS, HEADINGS } from '@/config/text.config';
import { CIRCLE_SIZE, FallingCircle } from '@/features/drop/falling-circle'
import { Api } from '@/services/api.client'
import { IWeeklyStatsResponse } from '@/services/game.service'
import { chartData } from '@/shared/data/chart.data';
import { useCommonStore } from '@/store/common.store';
import { cn } from '@/utils/cn.utils';
import { formatStatsToChartData } from '@/utils/format.utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

const GAME_STATE = {
  IDLE: 'idle',
  GAME: 'game',
  PAUSED: 'paused',
  RESULT: 'result',
} as const;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SPAWN_INTERVAL = 1500; // ms between spawns

export type GameState = (typeof GAME_STATE)[keyof typeof GAME_STATE];

export default function Drop() {
  const { setHeaderLabel, setHeaderRight, setHeaderLeft } = useCommonStore((state) => state);
  const [gameState, setGameState] = useState<GameState>(GAME_STATE.IDLE);
  const [score, setScore] = useState<number>(0);
  const scoreRef = useRef(0);
  const [circles, setCircles] = useState<{ id: number; startX: number }[]>([]);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const scrollX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const queryClient = useQueryClient();

  // 1. Отримуємо статистику для графіка
  const { data: stats } = useQuery<IWeeklyStatsResponse>({
    queryKey: ['drop-stats'],
    queryFn: () => Api.game.getStats('drop', true),
  });

  // 2. Мутація для відправки результату
  const { mutate, isPending } = useMutation({
    mutationFn: (score: number) => Api.game.saveScore(score, 'drop'),
    onSuccess: () => {
      // Оновлюємо статку після успішного запису
      queryClient.invalidateQueries({ queryKey: ['drop-stats'] });
    },
  });

  useEffect(() => {
    setHeaderLabel(HEADINGS.GAME.DROP);
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

  useEffect(() => {
    let interval: any;
    if (gameState === GAME_STATE.GAME && containerHeight > 0) {
      // If we are resuming (circles exist), don't reset circles/score
      if (circles.length === 0 && score === 0) {
        // Initial start
      }

      interval = setInterval(() => {
        const id = Date.now();
        // Random Start X within screen bounds, keeping padding in mind
        const startX = Math.random() * (SCREEN_WIDTH - CIRCLE_SIZE - 40) + 20;
        setCircles((prev) => [...prev, { id, startX }]);
      }, SPAWN_INTERVAL);
    }
    return () => clearInterval(interval);
  }, [gameState, containerHeight]);

  const handleReset = () => {
    setGameState(GAME_STATE.IDLE);
    setCircles([]);
    setScore(0);
  };

  const handleStartGame = () => {
    setGameState(GAME_STATE.GAME);
  };

  const handlePause = () => {
    setGameState(GAME_STATE.PAUSED);
  };

  const handleResume = () => {
    setGameState(GAME_STATE.GAME);
  };

  const onMiss = React.useCallback((id: number) => {
    setCircles((prev) => prev.filter((c) => c.id !== id));
    const newScore = score + 1;
    setScore(newScore);
    scoreRef.current = newScore;
  }, [score]);

  const onHit = React.useCallback(() => {
    mutate(scoreRef.current);
    setGameState(GAME_STATE.RESULT);
  }, [mutate]);

  // 3. Форматуємо дані для ChartKit
  const formattedChartData = useMemo(() => formatStatsToChartData(stats, chartData), [stats]);

  const renderHeading = () => {
    switch (gameState) {
      case GAME_STATE.IDLE:
        return 'Game ends if a dot hits a block.';
      case GAME_STATE.RESULT:
        return score !== null ? `${score}` : 'Game Over';
      default:
        return '';
    }
  };

  const renderButton = () => {
    if (gameState === GAME_STATE.IDLE) {
      return (
        <Button onPress={handleStartGame} variant={'default'} size="none" className="py-7">
          <ButtonText size={'title'} className="text-accent">
            {BUTTONS.START}
          </ButtonText>
        </Button>
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
        {gameState === GAME_STATE.IDLE && (
          <Heading className="text-center text-yellow">
            Tap to toggle the alternating block pattern. Guide the falling dots through the
            gaps.{' '}
          </Heading>
        )}
        {gameState === GAME_STATE.RESULT && <Heading>Final Score:</Heading>}
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
            <Heading>Your streak progress:</Heading>
            <Heading accent bold size={'2xl'}>
              {stats?.bestEverData ?? '--'}
            </Heading>
          </View>

          <Chart data={formattedChartData} width={SCREEN_WIDTH - 90} config={chartConfig} />
        </View>
      ) : gameState === GAME_STATE.IDLE ? (
        <></>
      ) : (
        <>
          <View className="flex w-full flex-row items-center justify-between">
            <Heading size={'xl'}>
              Score:{' '}
              <Heading accent bold size={'2xl'}>
                {score}
              </Heading>
            </Heading>
            <Heading size={'xl'}>
              Pattern:{' '}
              <View className="flex flex-row items-center gap-1">
                {Array.from({ length: 3 }).map((_, index) => (
                  <React.Fragment key={index}>
                    <Square />
                    <CircleOutline />
                  </React.Fragment>
                ))}
                <Square />
              </View>
            </Heading>
          </View>
          <View
            className="relative z-10 my-10 flex w-full flex-1"
            onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}>
            {circles.map((circle) => (
              <FallingCircle
                key={circle.id}
                {...circle}
                scrollX={scrollX}
                onMiss={onMiss}
                onHit={onHit}
                gameState={gameState}
                containerHeight={containerHeight}
              />
            ))}
          </View>
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            className="z-20 w-full flex-shrink-0 flex-grow-0">
            <View className="flex w-full flex-row items-center gap-20 px-10">
              {Array.from({ length: 15 }).map((_, index) => (
                <Oval key={index} />
              ))}
            </View>
          </Animated.ScrollView>
        </>
      )}

      <View className="flex flex-col gap-6">{renderButton()}</View>
    </Container>
  );
}
