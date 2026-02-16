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
import { formatMsToSeconds } from '@/utils/format.utils';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, Pressable, View } from 'react-native';

const GAME_STATE = {
  IDLE: 'idle',
  SEQUENCING: 'sequencing',
  WAITING_FOR_TAP: 'waiting_for_tap',
  RESULT: 'result',
} as const;

const screenWidth = Dimensions.get('window').width;

type GameState = (typeof GAME_STATE)[keyof typeof GAME_STATE];

export default function Reaction() {
  const setHeaderLabel = useCommonStore((state) => state.setHeaderLabel);
  const [gameState, setGameState] = useState<GameState>(GAME_STATE.IDLE);
  const [litCircleIndex, setLitCircleIndex] = useState(-1);
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);

  useEffect(() => {
    setHeaderLabel(HEADINGS.GAME.REACTION);
  }, [setHeaderLabel]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === GAME_STATE.SEQUENCING && litCircleIndex < 5) {
      timer = setTimeout(() => {
        setLitCircleIndex(litCircleIndex + 1);
      }, 300);
    } else if (litCircleIndex === 5) {
      const randomDelay = Math.random() * 2000 + 1000; // 1-3 seconds delay
      timer = setTimeout(() => {
        setGameState(GAME_STATE.WAITING_FOR_TAP);
        setLitCircleIndex(-1); // All circles off
        setStartTime(Date.now());
      }, randomDelay);
    }

    return () => clearTimeout(timer);
  }, [gameState, litCircleIndex]);

  const handleStartGame = () => {
    setReactionTime(null);
    setGameState(GAME_STATE.SEQUENCING);
    setLitCircleIndex(0);
  };

  const handleTap = useCallback(() => {
    if (gameState === GAME_STATE.WAITING_FOR_TAP) {
      const now = Date.now();
      setReactionTime(now - startTime);
      setGameState(GAME_STATE.RESULT);
    }
  }, [gameState, startTime]);

  const handleReset = () => {
    setGameState(GAME_STATE.IDLE);
    setLitCircleIndex(-1);
    setReactionTime(null);
  };

  const renderHeading = () => {
    switch (gameState) {
      case GAME_STATE.IDLE:
        return 'Tap to Start the lights sequence';
      case GAME_STATE.SEQUENCING:
        return 'Wait for ALL lights to turn OFF';
      case GAME_STATE.WAITING_FOR_TAP:
        return 'TAP NOW!';
      case GAME_STATE.RESULT:
        return reactionTime !== null ? `${formatMsToSeconds(reactionTime)}s` : 'Game Over';
      default:
        return '';
    }
  };

  const renderButton = () => {
    if (gameState === GAME_STATE.IDLE) {
      return (
        <Button onPress={handleStartGame} variant={'default'} size="none" className="py-7">
          <ButtonText size={'title'} className="text-accent">
            {BUTTONS.TAP_START}
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
    return null; // No button during sequencing or waiting for tap
  };

  return (
    <Pressable onPress={handleTap} className={'flex flex-1'}>
      <Container className="flex-col items-center justify-between">
        <View className="flex flex-col items-center gap-3">
          {gameState === GAME_STATE.RESULT && <Heading>Your reaction:</Heading>}
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
                2s
              </Heading>
            </View>

            <Chart data={chartData} width={screenWidth - 90} config={chartConfig} />
          </View>
        ) : (
          <View className="flex w-full flex-row items-center justify-between">
            {Array.from({ length: 5 }).map((_, index) => (
              <Circle
                key={index}
                color={
                  gameState === GAME_STATE.SEQUENCING && index <= litCircleIndex
                    ? COLORS.ACCENT
                    : COLORS.GRAY
                }
              />
            ))}
          </View>
        )}

        <View className="h-[90px] items-center justify-center">{renderButton()}</View>
      </Container>
    </Pressable>
  );
}
