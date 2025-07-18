const DEFAULT_LOCALE = 'en';

export const locale = $state<{
	current?: string;
}>({
	current: DEFAULT_LOCALE
});

export const locales = ['en', 'it', 'fr', 'de'];

export function getSystemLocale() {
	return DEFAULT_LOCALE;
}
