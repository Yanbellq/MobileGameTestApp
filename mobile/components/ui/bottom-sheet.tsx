import { Heading } from '@/components/ui/heading';
import { cn } from '@/utils/cn.utils';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { cssInterop } from 'nativewind';
import { ComponentPropsWithRef, forwardRef } from 'react';
import { GlassBackground } from '../../features/widget/glass-background';

type TBottomSheetProps = ComponentPropsWithRef<typeof BottomSheetModal>;

export interface IWidgetBottomSheetProps extends Omit<TBottomSheetProps, 'children'> {
  // children?: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}

cssInterop(BottomSheetModal, {
  className: 'style',
});

cssInterop(BottomSheetView, {
  className: 'style',
});

export const WidgetBottomSheet = forwardRef<BottomSheetModal, IWidgetBottomSheetProps>((props, ref) => {
  return (
    <BottomSheetModal
      ref={ref}
      index={2} // 0 is 25%, 1 is 50% based on snapPoints
      backgroundComponent={GlassBackground}
      enablePanDownToClose={true}
      // className="bg-primary"
      {...props}>
      <BottomSheetView className={cn('flex-1 items-center p-6 pt-10', props.className)}>
        <Heading size="xl" bold className='max-w-64 text-center'>
          {props.title}
        </Heading>
        {props.children}
      </BottomSheetView>
    </BottomSheetModal>
  );
});
