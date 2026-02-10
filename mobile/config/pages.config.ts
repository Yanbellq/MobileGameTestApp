import { Href } from 'expo-router'

export const PAGES: Record<string, Href> = {
	HOME: '/',
	PROFILE: '/profile',
	SETTINGS: '/settings',
	STATISTICS: '/statistics',
	CONTACT_US: '/contact-us',
	PRIVACY_POLICY: '/privacy-policy',
	TERMS_OF_USE: '/terms',
	RATE_US: '/rate-us',
} as const;