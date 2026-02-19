import { Href } from 'expo-router'

export const PAGES: Record<string, Href> = {
	HOME: '/',
	
	AUTH: '/auth',
	FORGOT_PASSWORD: '/forgot-password',
	CHANGE_PASSWORD: '/change-password',
	PROFILE: '/profile',

	SETTINGS: '/settings',
	STATISTICS: '/statistics',
	CONTACT_US: '/contact-us',
	PRIVACY_POLICY: '/privacy-policy',
	TERMS_OF_USE: '/terms',
	RATE_US: '/rate-us',

	REACTION: '/reaction',
	RAPID: '/rapid',
	DROP: '/drop',
	SPOT: '/spot',
} as const;