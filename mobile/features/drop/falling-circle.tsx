import { GameState } from '@/app/(game)/drop';
import { Circle } from '@/components/icons/game';
import React, { useEffect } from 'react';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

const GAME_STATE = {
  IDLE: 'idle',
  GAME: 'game',
  PAUSED: 'paused',
  RESULT: 'result',
} as const;

const OVAL_WIDTH = 78;
const GAP_WIDTH = 80; // Approximate gap between ovals in the scroll view
export const CIRCLE_SIZE = 55;
const OVAL_HEIGHT = 40;
const FALL_SPEED = 2000; // ms to fall

export interface FallingCircleProps {
  id: number;
  startX: number;
  onMiss: (id: number) => void;
  onHit: () => void;
  scrollX: SharedValue<number>;
  gameState: GameState;
  containerHeight: number;
}

export const FallingCircle = React.memo(
  ({ id, startX, onMiss, onHit, scrollX, gameState, containerHeight }: FallingCircleProps) => {
    const translateY = useSharedValue(-CIRCLE_SIZE);
    const isHit = useSharedValue(false);

    useEffect(() => {
      const targetY = containerHeight + OVAL_HEIGHT + 50;
      const startY = -CIRCLE_SIZE;
      const totalDistance = targetY - startY;

      if (gameState === GAME_STATE.GAME && containerHeight > 0) {
        const currentY = translateY.value;
        const remainingDistance = targetY - currentY;
        const infoDuration = (remainingDistance / totalDistance) * FALL_SPEED;

        // Ensure duration is positive and reasonable
        const duration = infoDuration > 0 ? infoDuration : 0;

        translateY.value = withTiming(
          targetY,
          { duration: duration }, // Resume with proportional duration
          (finished) => {
            if (finished) {
              runOnJS(onMiss)(id);
            }
          }
        );
      } else if (gameState === GAME_STATE.PAUSED) {
        cancelAnimation(translateY);
      } else {
        cancelAnimation(translateY);
      }
    }, [gameState, id, onMiss, translateY, containerHeight]);

    useAnimatedReaction(
      () => translateY.value,
      (y) => {
        // Defines the collision zone Y coordinate
        // Visually, the Ovals are immediately below the container.
        // So collision happens when the circle reaches the bottom of the container.
        const collisionY = containerHeight - 10; // Slight tolerance

        if (y > collisionY && y < collisionY + OVAL_HEIGHT && !isHit.value) {
          // Collision Logic
          // The Ovals are in a horizontal scroll view with padding (px-10 = 40px).
          // Pattern: Oval (78) + Gap (80). Cycle = 158.

          const cycleLength = OVAL_WIDTH + GAP_WIDTH; // 158
          const relativeX = startX + scrollX.value;
          const shiftedX = relativeX - 40; // Account for px-10 padding

          // Normalize to positive cycle position
          let pos = shiftedX % cycleLength;
          if (pos < 0) pos += cycleLength;

          // Oval is at [0, 78] in the cycle
          // Gap is at [78, 158] (Width 80)

          // Strict Collision Condition:
          // If ANY part of the circle (width 55) touches the Oval (width 78).
          // Circle Range in Cycle: [pos, pos + 55]
          // Oval Range in Cycle: [0, 78]

          // Overlap Logic:
          // Start1 < End2 && Start2 < End1
          // pos < 78 && 0 < pos + 55
          // Since pos >= 0, check pos < 78.

          // Safe if Circle is fully in Gap.
          // Condition: pos >= 78 AND pos + 55 <= 158
          // => pos >= 78 AND pos <= 103

          // Relaxed Collision Condition (Hitbox reduction):
          // Allow 10px tolerance on each side.
          // Effective Circle Range: [pos + 10, pos + 45]
          // Hit Left Oval: pos + 10 < 78 => pos < 68
          // Hit Right Oval: pos + 45 > 158 => pos > 113

          if (pos < 68 || pos > 113) {
            isHit.value = true;
            runOnJS(onHit)();
          }
        }
      }
    );

    const style = useAnimatedStyle(() => ({
      transform: [{ translateX: startX }, { translateY: translateY.value }],
      position: 'absolute',
      top: 0,
      left: 0,
    }));

    return (
      <Animated.View style={style}>
        <Circle color={isHit.value ? 'red' : '#999999'} />
      </Animated.View>
    );
  }
);
