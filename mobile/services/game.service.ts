import { API } from '@/constants/api.constant';
import { apiClient } from '@/lib/api.instance';

export interface IScoreResponse {
  id: number;
  userId: number;
  game: string;
  score: number;
  createdAt: string;
}

export type TWeekScore = Record<string, number | null>

export interface IWeeklyStatsResponse {
  bestWeekData: TWeekScore;
  bestEverData: number | null;
}

export type TScore = {
  game: string;
  bestScore: number;
  latestScore: number;
  metric: 'min' | 'max';
};

export interface IAllBestScoresResponse {
  gameStats: TScore[];
  averageReaction: number;
  weeklyAverageStats: TWeekScore;
}

export type ILeader = {
  username: string
  score: number
}

export interface ILeaderboardResponse {
  game: string
  metric: 'min' | 'max'
  leaderboard: ILeader[]
}

export const saveScore = async (score: number, game: string): Promise<IScoreResponse> => {
  const { data } = await apiClient.post(API.SCORE, { game, score });
  return data;
};

export const getStats = async (game: string, max: boolean = false): Promise<IWeeklyStatsResponse> => {
  const link = max ? '/max' : '/min';
  const { data } = await apiClient.get(API.STATISTIC(game) + link);
  return data;
};

export const getAllBestScores = async (): Promise<IAllBestScoresResponse> => {
  const { data } = await apiClient.get(API.ALL_BEST_SCORE);
  return data;
}

export const getTodayLeaderboard = async (game: string): Promise<ILeaderboardResponse> => {
  const { data } = await apiClient.get(API.LEADERBOARD(game));
  return data;
}

export const getAllLeaderboard = async (): Promise<ILeaderboardResponse[]> => {
  const { data } = await apiClient.get(API.ALL_LEADERBOARD);
  return data;
}