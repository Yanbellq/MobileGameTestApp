import { cn } from '@/utils/cn.utils';
import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';
import { BlurBlob } from '@/components/ui/blur-blob';

cssInterop(LinearGradient, {
  className: 'style',
});

interface Props {
  className?: string;
  children: React.ReactNode;
}

export function Background({ className, children }: Props) {
  return (
    <LinearGradient
      colors={['#2A2D32', '#1D1D1D']}
      locations={[0, 0.99]}
      className={cn('flex-1', className)}
		>
      <BlurBlob />
      {children}
    </LinearGradient>
  );
}
