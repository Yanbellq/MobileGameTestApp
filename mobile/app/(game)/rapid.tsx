import { Circle } from '@/components/icons/game';
import { Container } from '@/components/layout/Container';
import { Button, ButtonText } from '@/components/ui/button';
import { Chart } from '@/components/ui/chart';
import { Heading } from '@/components/ui/heading';
import { chartConfig } from '@/config/chart.config';
import { COLORS } from '@/config/colors.config';
import { BUTTONS, HEADINGS } from '@/config/text.config';
import { chartData } from '@/shared/data/chart.data';
import { useCommonStore } from '@/store/common.store';
import { cn } from '@/utils/cn.utils';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';

const GAME_STATE = {
  IDLE: 'idle',
  LIGHT_MODE: 'light_mode',
  HARD_MODE: 'hard_mode',
  RESULT: 'result',
} as const;

const BUTTON_POS = [
  'left-1/2 top-10',
  'left-1/4 top-32',
  'left-1/4 top-1/3',
  'left-20 top-1/2',
  'left-1/2 top-1/4',
  'left-44 top-80',
  'left-3/4 top-40',
  'left-3/4 top-72',
  'left-2/3 top-1/2',
];

const screenWidth = Dimensions.get('window').width;

type GameState = (typeof GAME_STATE)[keyof typeof GAME_STATE];

export default function Rapid() {
  const setHeaderLabel = useCommonStore((state) => state.setHeaderLabel);
  const setBgColor = useCommonStore((state) => state.setBgGradientColors);
  const [gameState, setGameState] = useState<GameState>(GAME_STATE.IDLE);
  const [totalTapped, setTotalTapped] = useState<number>(0);
  const [leftTime, setLeftTime] = useState<number>(60);
  const [activeCircleIndex, setActiveCircleIndex] = useState<number | null>(null);

  const reactionTimerId = useRef<NodeJS.Timeout | null>(null);
  const gameTimerId = useRef<NodeJS.Timeout | null>(null);
  const reactionTime = useRef<number>(2000);

  useEffect(() => {
    setHeaderLabel(HEADINGS.GAME.RAPID);
    return () => {
      if (gameTimerId.current) clearInterval(gameTimerId.current);
      if (reactionTimerId.current) clearTimeout(reactionTimerId.current);
    };
  }, []);

  useEffect(() => {
    if (gameState === GAME_STATE.HARD_MODE) {
      setBgColor(['#3C2D2D', '#2D0000']);
      reactionTime.current = 1000;
    } else {
      setBgColor(['#2A2D32', '#1D1D1D']);
      reactionTime.current = 2000;
    }
  }, [gameState]);

  const handleGameOver = () => {
    if (gameTimerId.current) clearInterval(gameTimerId.current);
    if (reactionTimerId.current) clearTimeout(reactionTimerId.current);
    setGameState(GAME_STATE.RESULT);
    setActiveCircleIndex(null);
  };

  const selectNextCircle = () => {
    if (reactionTimerId.current) clearTimeout(reactionTimerId.current);

    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * BUTTON_POS.length);
    } while (nextIndex === activeCircleIndex);

    setActiveCircleIndex(nextIndex);

    reactionTimerId.current = setTimeout(() => {
      handleGameOver();
    }, reactionTime.current);
  };

  const handleStartGame = (mode: 'light' | 'hard') => {
    setGameState(mode === 'light' ? GAME_STATE.LIGHT_MODE : GAME_STATE.HARD_MODE);
    setTotalTapped(0);
    setLeftTime(60);

    gameTimerId.current = setInterval(() => {
      setLeftTime((prevTime) => {
        if (prevTime <= 1) {
          handleGameOver();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    selectNextCircle();
  };

  const handleCirclePress = (index: number) => {
    if (index === activeCircleIndex) {
      setTotalTapped((prev) => prev + 1);
      selectNextCircle();
    } else {
      handleGameOver();
    }
  };

  const handleReset = () => {
    setGameState(GAME_STATE.IDLE);
    setTotalTapped(0);
    setLeftTime(60);
    setActiveCircleIndex(null);
    if (gameTimerId.current) clearInterval(gameTimerId.current);
    if (reactionTimerId.current) clearTimeout(reactionTimerId.current);
  };

  const renderHeading = () => {
    switch (gameState) {
      case GAME_STATE.IDLE:
        return 'The game gets faster as your streak increases. Game ends if you miss or tap the wrong circle.';
      case GAME_STATE.RESULT:
        return totalTapped !== null ? `${totalTapped}` : 'Game Over';
      default:
        return '';
    }
  };

  const renderButton = () => {
    if (gameState === GAME_STATE.IDLE) {
      return (
        <>
          <Button
            onPress={() => handleStartGame('light')}
            variant={'default'}
            size="none"
            className="py-7">
            <ButtonText size={'title'} className="text-accent">
              {BUTTONS.START}
            </ButtonText>
          </Button>
          <Button
            onPress={() => handleStartGame('hard')}
            variant={'default'}
            size="none"
            className="bg-red py-7">
            <ButtonText size={'title'}>{BUTTONS.HARD_MODE}</ButtonText>
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
        {gameState === GAME_STATE.IDLE && (
          <Heading className="text-yellow">Tap the red circle as quickly as possible. </Heading>
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
              {/* // fixme */}
              10
            </Heading>
          </View>

          <Chart data={chartData} width={screenWidth - 90} config={chartConfig} />
        </View>
      ) : gameState === GAME_STATE.IDLE ? (
        <></>
      ) : (
        <>
          <View className="flex w-full flex-row items-center justify-between">
            <Heading size={'xl'}>
              Score:{' '}
              <Heading accent bold size={'2xl'}>
                {totalTapped}
              </Heading>
            </Heading>
            <Heading size={'xl'}>
              Time:{' '}
              <Heading accent bold size={'2xl'}>
                {leftTime}s
              </Heading>
            </Heading>
          </View>
          <View className="relative h-full w-full translate-y-20">
            {BUTTON_POS.map((pos, index) => {
              const defaultColor = gameState === GAME_STATE.HARD_MODE ? COLORS.PINK : COLORS.GRAY;
              return (
                <View
                  key={index}
                  onTouchStart={() => handleCirclePress(index)}
                  className={cn('absolute', pos)}>
                  <Circle color={index === activeCircleIndex ? COLORS.RED : defaultColor} />
                </View>
              );
            })}
          </View>
        </>
      )}

      <View className="flex flex-col gap-6">{renderButton()}</View>
    </Container>
  );
}
