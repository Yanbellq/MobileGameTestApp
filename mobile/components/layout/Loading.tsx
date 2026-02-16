import { cn } from '@/utils/cn.utils';
import { Logo } from '../icons';
import { Container } from './Container';

interface Props {
  className?: string;
}

export function Loading({ className = '' }: Props) {
  return (
    <Container className={cn('flex flex-1 items-center justify-center', className)}>
      <Logo />
    </Container>
  );
}
