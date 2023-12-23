// +layout.ts
import { browser } from '$app/environment';
import '$lib/i18n';
import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';
import '$lib/templates';
import Cookies from 'js-cookie';

export const load: LayoutLoad = async () => {
	if (browser) {
		const outputData = document.createElement('div');
		outputData.id = 'output';
		outputData.style.display = 'none';
		document.body.appendChild(outputData);
		setTimeout(() => {
			locale.set(Cookies.get('locale') || locale || window.navigator.language);
		}, 1000);
	}
	await waitLocale();
};
