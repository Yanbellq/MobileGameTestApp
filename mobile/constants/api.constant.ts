export const API = {
  BASE_URL: 'http://localhost:4200/api',

  LOGIN: '/auth/login',
  REGISTER: '/auth/register',

  SCORE: '/games/score',
  ALL_BEST_SCORE: '/games/best-scores',

  STATISTIC: (game: string) => `games/${game}/stats`,

  LEADERBOARD: (game: string) => `games/${game}/leaderboard/today`,
  ALL_LEADERBOARD: '/games/leaderboards/all',

  VALIDATE_EMAIL: '/auth/validate-email',
  RESET_PASSWORD: '/auth/reset-password',

  VERIFY_CURRENT_PASSWORD: '/auth/verify-current-password',
  UPDATE_PASSWORD: '/auth/update-password',

};