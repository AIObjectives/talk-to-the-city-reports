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
    // This setTimeout is required else the locale is not set properly
    setTimeout(() => {
      locale.set(Cookies.get('locale') || get(locale) || navigator.language);
    }, 500);
  }
  await waitLocale();
};
