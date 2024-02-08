import { browser } from '$app/environment';
import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';

import Cookies from 'js-cookie';

import '$lib/templates';
import '$lib/i18n';

export const load: LayoutLoad = async () => {
	if (browser) {
		setTimeout(() => {
			locale.set(Cookies.get('locale') || locale || (window.navigator.language as any));
		}, 1000);
	}
	await waitLocale();
};
