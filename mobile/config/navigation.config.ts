import {
  ArrowLeft,
  DailyTask,
  File,
  Hand,
  Message,
  PrecisionDrop,
  RapidFire,
  Reaction,
  Settings,
  SpotDifference,
  Star,
  Statistic,
  User,
} from '@/components/icons';
import { Href, router } from 'expo-router';
import { Home } from 'lucide-react-native';
import { PAGES } from './pages.config';
import { HEADINGS } from './text.config';

export const NAVIGATION = {
  BACK: {
    action: (previousUrl: Href) => router.push(previousUrl),
    icon: ArrowLeft,
  },
  HOME: {
    action: () => router.push(PAGES.HOME),
    icon: Home,
  },
  PROFILE: {
    action: () => router.push(PAGES.PROFILE),
    icon: User,
  },
  SETTINGS: {
    action: () => router.push(PAGES.SETTINGS),
    icon: Settings,
  },
  STATISTICS: {
    // action: () => router.push(PAGES.STATISTICS),
    action: () => {},
    label: HEADINGS.PROFILE.STATISTICS,
    icon: Statistic,
  },
  CONTACT_US: {
    // action: () => router.push(PAGES.CONTACT_US),
    action: () => {},
    label: HEADINGS.SETTINGS.CONTACT,
    icon: Message,
  },
  PRIVACY_POLICY: {
    // action: () => router.push(PAGES.PRIVACY_POLICY),
    action: () => {},
    label: HEADINGS.SETTINGS.PRIVACY,
    icon: Hand,
  },
  TERMS_OF_USE: {
    // action: () => router.push(PAGES.TERMS_OF_USE),
    action: () => {},
    label: HEADINGS.SETTINGS.TERMS,
    icon: File,
  },
  RATE_US: {
    // action: () => router.push(PAGES.RATE_US),
    action: () => {},
    label: HEADINGS.SETTINGS.RATE,
    icon: Star,
  },
  REACTION: {
    // action: () => router.push(PAGES.RATE_US),
    action: () => {},
    label: HEADINGS.GAME.REACTION,
    icon: Reaction,
  },
  RAPID_FIRE: {
    // action: () => router.push(PAGES.RATE_US),
    action: () => {},
    label: HEADINGS.GAME.RAPID,
    icon: RapidFire,
  },
  PRECISION_DROP: {
    // action: () => router.push(PAGES.RATE_US),
    action: () => {},
    label: HEADINGS.GAME.DROP,
    icon: PrecisionDrop,
  },
  SPOT: {
    // action: () => router.push(PAGES.RATE_US),
    action: () => {},
    label: HEADINGS.GAME.SPOT,
    icon: SpotDifference,
  },
  DAILY_TASK: {
    // action: () => router.push(PAGES.RATE_US),
    action: () => {},
    label: HEADINGS.GAME.DAILY_TASK,
    icon: DailyTask,
  },
} as const;

export const SETTINGS_NAVIGATION_GROUP = [
  NAVIGATION.CONTACT_US,
  NAVIGATION.PRIVACY_POLICY,
  NAVIGATION.TERMS_OF_USE,
  NAVIGATION.RATE_US,
];

export const GAME_NAVIGATION_GROUP = [
  NAVIGATION.REACTION,
  NAVIGATION.RAPID_FIRE,
  NAVIGATION.PRECISION_DROP,
  NAVIGATION.SPOT,
];
