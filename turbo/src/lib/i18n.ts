import { browser } from '$app/environment';
import { locale } from 'svelte-i18n';
import { init, register } from 'svelte-i18n';
import _ from 'lodash';
import Cookies from 'js-cookie';

const defaultLocale = Cookies.get('locale') || 'en';

export const languages = {
	en: '🇺🇸',
	'zh-TW': '🇹🇼'
};

register('en', () => import(`./i18n/en.json`));
register('zh-TW', () => import(`./i18n/zh-TW.json`));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale
});

locale.set(defaultLocale);
