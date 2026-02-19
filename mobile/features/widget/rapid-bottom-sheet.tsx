import { WidgetBottomSheet } from '@/components/ui/bottom-sheet';
import { Heading } from '@/components/ui/heading';
import { HEADINGS } from '@/config/text.config';
import { bottomSheetSnapPoints } from '@/constants/bottom-sheet.constants';
import { TScore } from '@/services/game.service'
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { forwardRef } from 'react';
import { View } from 'react-native';

interface Props { 
  light?: TScore
  hard?: TScore
}

export const RapidBottomSheet = forwardRef<BottomSheetModal, Props>((props, ref) => {
  return (
    <WidgetBottomSheet
      ref={ref}
      title={HEADINGS.WIDGETS.BOTTOM_SHEET.RAPID}
      snapPoints={bottomSheetSnapPoints}>
      <View
        className="h-full w-full flex-1 flex-col items-center"
        style={{ paddingHorizontal: 60 }}>
        <View className="mt-4 w-full flex-col items-center gap-4" style={{ paddingTop: 16 }}>
          <Heading size="xl" className="text-yellow">
            Normal Mode
          </Heading>
          <Heading>High Score:</Heading>
          <Heading size="5xl" accent bold>
            {props.light?.bestScore || '--'}
          </Heading>
          <Heading>Last Game Score:</Heading>
          <Heading size="5xl" accent bold>
            {props.light?.latestScore || '--'}
          </Heading>
        </View>
        <View className="mt-4 w-full flex-col items-center gap-4" style={{ paddingTop: 16 }}>
          <Heading size="xl" className="text-red" style={{ color: 'red' }}>
            Hard Mode
          </Heading>
          <Heading>High Score:</Heading>
          <Heading size="5xl" accent bold>
            {props.hard?.bestScore || '--'}
          </Heading>
          <Heading>Last Game Score:</Heading>
          <Heading size="5xl" accent bold>
            {props.hard?.latestScore || '--'}
          </Heading>
        </View>
      </View>
    </WidgetBottomSheet>
  );
});
