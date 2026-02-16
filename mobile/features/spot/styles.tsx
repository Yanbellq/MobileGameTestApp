import { tva } from '@gluestack-ui/utils/nativewind-utils'

export const spotItemStyle = tva({
  base: 'flex flex-col flex-shrink-0 items-center justify-center rounded-md p-6',
  variants: {
    variant: {
      default: 'bg-widget data-[active=true]:opacity-70',
    },
    size: {
      default: '',
    },
  },
});