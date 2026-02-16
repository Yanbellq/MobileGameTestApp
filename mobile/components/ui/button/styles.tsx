import { tva } from '@gluestack-ui/utils/nativewind-utils'

export const buttonStyle = tva({
  base: 'rounded flex flex-row items-center justify-center data-[focus-visible=true]:web:outline-none data-[focus-visible=true]:web:ring-2 data-[disabled=true]:opacity-40 gap-2 h-fit',
  variants: {
    variant: {
      default:
        'bg-primary data-[hover=true]:bg-primary/90 data-[active=true]:opacity-70',
      destructive:
        'bg-destructive data-[hover=true]:bg-destructive/90 data-[active=true]:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
      outline:
        'border border-border bg-background shadow-xs data-[hover=true]:bg-accent data-[active=true]:bg-accent dark:bg-input/[0.045] dark:border-border/90 dark:data-[hover=true]:bg-input/[0.075] dark:data-[active=true]:bg-input/[0.075]',
      secondary:
        'bg-secondary text-secondary-foreground data-[hover=true]:bg-secondary/80 data-[active=true]:bg-secondary/80',
      ghost: '',
      "ghost-link": 'w-full bg-transparent bg-blend-overlay data-[active=true]:bg-transparent/15 rounded-none',
			icon: 'relative h-20 w-20 items-center justify-center rounded-full data-[active=true]:opacity-70',
      link:
        'bg-transparent bg-blend-overlay data-[hover=true]:bg-transparent data-[active=true]:opacity-70',
      // glass: 'bg-transparent data-[active=true]:opacity-70',
    },
    size: {
      default: 'px-8 py-5',
      sm: 'min-h-8 px-3 text-xs',
      lg: 'min-h-10 px-8',
      icon: 'min-h-9 min-w-9 p-3.5',
      "icon-xl": 'min-h-48 min-w-48 p-10',
      none: '',
    },
  },
});

export const buttonTextStyle = tva({
  base: 'web:select-none font-sans text-foreground text-center flex flex-row items-center justify-center',
  parentVariants: {
    variant: {
      default: '',
      destructive: '',
      outline:'data-[hover=true]:text-accent-foreground data-[active=true]:text-accent-foreground',
      secondary: 'text-secondary-foreground',
      ghost: '',
      link: '',
    },
    size: {
      default: 'text-xl font-semibold',
      sm: 'text-xs',
      lg: 'text-sm',
      title: 'text-2xl font-bold',
      icon: 'text-sm',
    },
  },
});

export const buttonSpinnerStyle = tva({
  base: '',
  parentVariants: {
    size: {
      default: 'h-4 w-4',
      sm: 'h-4 w-4',
      lg: 'h-4 w-4',
      icon: 'h-4 w-4',
    },
  },
});

export const buttonIconStyle = tva({
  base: 'pointer-events-none shrink-0',
  parentVariants: {
    variant: {
			default: '',
      parentDefault: 'text-primary-foreground',
      destructive: 'text-white',
      outline:
        'text-foreground data-[hover=true]:text-accent-foreground data-[active=true]:text-accent-foreground',
      secondary: 'text-secondary-foreground',
      ghost:
        'text-foreground data-[hover=true]:text-accent-foreground data-[active=true]:text-accent-foreground',
      link: 'text-primary',
    },
    size: {
      default: 'h-6 w-6',
      sm: 'h-4 w-4',
      lg: 'h-4 w-4',
      icon: 'h-4 w-4',
      "none": '',
    },
  },
});

export const buttonGroupStyle = tva({
  base: 'bg-transparent bg-blend-overlay data-[hover=true]:bg-transparent data-[active=true]:opacity-70',
  variants: {
    space: {
      'none': 'gap-0',
      'xs': 'gap-1',
      'sm': 'gap-2',
      'md': 'gap-3',
      'lg': 'gap-4',
      'xl': 'gap-5',
      '2xl': 'gap-6',
      '3xl': 'gap-7',
      '4xl': 'gap-8',
    },
    isAttached: {
      true: 'gap-0',
    },
    flexDirection: {
      'row': 'flex-row',
      'column': 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse',
    },
  },
});