import { WidgetBottomSheet } from '@/components/ui/bottom-sheet';
import { Heading } from '@/components/ui/heading';
import { HEADINGS } from '@/config/text.config';
import { bottomSheetSnapPoints } from '@/constants/bottom-sheet.constants';
import { TScore } from '@/services/game.service'
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { forwardRef } from 'react';
import { View } from 'react-native';

interface Props { 
  data?: TScore
}

export const SpotBottomSheet = forwardRef<BottomSheetModal, Props>((props, ref) => {
  return (
    <WidgetBottomSheet
      ref={ref}
      title={HEADINGS.WIDGETS.BOTTOM_SHEET.SPOT}
      snapPoints={bottomSheetSnapPoints}>
      <View
        className="h-full w-full flex-1 flex-col items-center"
        style={{ paddingHorizontal: 60 }}>
        <View className="mt-4 w-full flex-col items-center gap-4" style={{ paddingTop: 16 }}>
          <Heading>High Score:</Heading>
          <Heading size="5xl" accent bold>
            {props.data?.bestScore || '--'}
          </Heading>
          <Heading>Last Game Score:</Heading>
          <Heading size="5xl" accent bold>
            {props.data?.latestScore || '--'}
          </Heading>
        </View>
      </View>
    </WidgetBottomSheet>
  );
});
