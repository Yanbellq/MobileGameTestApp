import { Container } from '@/components/layout/Container';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { PAGES } from '@/config/pages.config';
import { HEADINGS } from '@/config/text.config';
import { useCommonStore } from '@/store/common.store';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useEffect } from 'react';

export default function NotFoundScreen() {
  const router = useRouter();

  useEffect(() => {
    useCommonStore.getState().setHeaderLabel(HEADINGS.PROBLEM);
  }, []);

  return (
    <Container>
      <Heading className="flex-1 text-center" size="2xl">
        {"This screen doesn't exist."}
      </Heading>

      <Button
        variant={'default'}
        size={'none'}
        className="gap-3"
        onPress={() => router.push(PAGES.HOME)}>
        <ButtonIcon as={ArrowLeft} color={'white'} />
        <ButtonText size={'default'}>Go to home screen!</ButtonText>
      </Button>
    </Container>
  );
}
