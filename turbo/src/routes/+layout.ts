import { browser } from '$app/environment';
import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';
import { get } from 'svelte/store';
import Cookies from 'js-cookie';
import '$lib/templates';
import '$lib/i18n';

if (typeof global === 'undefined') {
	window.global = window;
}

export const load: LayoutLoad = async () => {
	if (browser) {
		locale.set(Cookies.get('locale') || get(locale) || navigator.language);
	}
	await waitLocale();
};
