import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

const defaultLocale = 'en';

register('en', () => import('./en.json'));
register('zh-TW', () => import('./zh-TW.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale
});
