import { tva } from '@gluestack-ui/utils/nativewind-utils';

export const widgetStyle = tva({
  base: 'p-5 flex flex-col items-center justify-between rounded-3xl -z-10',
  variants: {
    variant: {
      default: 'bg-widget shadow data-[active=true]:opacity-70',
    },
    size: {
      default: 'max-w-[180px] min-h-[180px]',
      sm: '',
      lg: 'max-w-[180px] min-h-[240px]',
    },
    accent: {
      true: 'bg-widget-accent shadow-none data-[active=true]:opacity-80',
    },
  },
});
