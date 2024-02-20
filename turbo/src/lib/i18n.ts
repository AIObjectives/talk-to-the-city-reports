import { browser } from '$app/environment';
import { locale } from 'svelte-i18n';
import { init, register } from 'svelte-i18n';
import _ from 'lodash';
import Cookies from 'js-cookie';

// clear old locale, we are now using fully qualified locale
// not ISO 639-1
if (Cookies.get('locale') == 'en') Cookies.set('locale', 'en-US');

export const defaultLocale = Cookies.get('locale') || 'en-US';

export const flags = {
  'en-US': '🇺🇸',
  'zh-TW': '🇹🇼'
};

register('en-US', () => import(`./i18n/en-US.json`));
register('zh-TW', () => import(`./i18n/zh-TW.json`));

init({
  fallbackLocale: defaultLocale,
  initialLocale: browser ? window.navigator.language : defaultLocale
});

locale.set(defaultLocale);
