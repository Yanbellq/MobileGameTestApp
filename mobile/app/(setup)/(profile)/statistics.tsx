import { ArrowLeft } from '@/components/icons';
import { Container } from '@/components/layout/Container';
import { Heading } from '@/components/ui/heading';
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; // Переконайся, що шлях правильний
import { HEADINGS } from '@/config/text.config';
import { PAGES } from '@/constants/pages.constants';
import { Api } from '@/services/api.client';
import { useCommonStore } from '@/store/common.store';
import { useGameStore } from '@/store/game.store';
import { cn } from '@/utils/cn.utils';
import { formatMsToSeconds } from '@/utils/format.utils'
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

export default function Statistic() {
  const { setHeaderLabel, setHeaderLeft, setHeaderRight } = useCommonStore((state) => state);
  const { user: currentUser } = useGameStore();

  // 1. Отримуємо дані (наприклад, для rapid-fire-light)
  const { data: allBoards, isLoading } = useQuery({
    queryKey: ['all-leaderboards'],
    queryFn: () => Api.game.getAllLeaderboard(),
  });

  useEffect(() => {
    setHeaderLabel(HEADINGS.PROFILE.STATISTICS);
    setHeaderLeft(() => router.push(PAGES.PROFILE), ArrowLeft);
    setHeaderRight(null);
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Container>
          <ActivityIndicator size="large" color="#FFD700" />
        </Container>
      </View>
    );
  }

  return (
    <View className={'flex flex-1'}>
      <Container>
        <ScrollView showsVerticalScrollIndicator={false}>
          {allBoards?.map((board, index) => (
            <View className="py-6" key={board.game}>
              <View className="mb-6 flex flex-row items-baseline justify-between">
                <Heading size="2xl" bold>
                  {board?.game.replace(/-/g, ' ').toUpperCase()}
                </Heading>
              </View>

              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-outline-variant border-b">
                    <TableHead>#</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead className="text-right">
                      {board?.metric === 'max' ? 'Score' : 'Time'}
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {board?.leaderboard.map((item: any, index: number) => {
                    const isMe = item.username === currentUser?.username;

                    return (
                      <TableRow
                        key={index}
                        className={cn(
                          'border-outline-variant/50 border-b',
                          isMe && 'bg-accent/10' // Підсвічуємо себе
                        )}>
                        <TableData>
                          <Heading size="sm" accent={index < 3} bold={index < 3}>
                            {index + 1}
                          </Heading>
                        </TableData>
                        <TableData>
                          <Heading size="sm" bold={isMe}>
                            {item.username} {isMe && '(You)'}
                          </Heading>
                        </TableData>
                        <TableData className="text-right">
                          <Heading size="sm" accent bold>
                            {board.game === 'reaction-test' ? formatMsToSeconds(item.score) : item.score}
                            {board?.metric === 'min' ? 's' : ''}
                          </Heading>
                        </TableData>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {board?.leaderboard.length === 0 && (
                <View className="items-center py-10">
                  <Heading size="md" className="text-gray">
                    No scores yet today
                  </Heading>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </Container>
    </View>
  );
}

/* 
        <View className="mb-6 flex flex-row items-baseline justify-between">
          <Heading size="2xl" bold>
            {"Today's Top 10"}
          </Heading>
          <Heading size="sm" className="uppercase text-muted-foreground">
            {data?.game.replace(/-/g, ' ')}
          </Heading>
        </View>

        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-outline-variant border-b">
              <TableHead>#</TableHead>
              <TableHead>Username</TableHead>
              <TableHead className="text-right">
                {data?.metric === 'max' ? 'Score' : 'Time'}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.leaderboard.map((item: any, index: number) => {
              const isMe = item.username === currentUser?.username;

              return (
                <TableRow
                  key={index}
                  className={cn(
                    'border-outline-variant/50 border-b',
                    isMe && 'bg-accent/10' // Підсвічуємо себе
                  )}>
                  <TableData>
                    <Heading size="sm" accent={index < 3} bold={index < 3}>
                      {index + 1}
                    </Heading>
                  </TableData>
                  <TableData>
                    <Heading size="sm" bold={isMe}>
                      {item.username} {isMe && '(You)'}
                    </Heading>
                  </TableData>
                  <TableData className="text-right">
                    <Heading size="sm" accent bold>
                      {item.score}
                      {data?.metric === 'min' ? 's' : ''}
                    </Heading>
                  </TableData>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {data?.leaderboard.length === 0 && (
          <View className="items-center py-10">
            <Heading size="md" className="text-gray">
              No scores yet today
            </Heading>
          </View>
        )}
*/
