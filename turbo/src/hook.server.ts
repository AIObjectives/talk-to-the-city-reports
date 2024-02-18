import admin from 'firebase-admin';
import serviceAccount from '$lib/service-account-pk.json' assert { type: 'json' };
import type { Handle } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';

export const handle: Handle = async ({ event, resolve }) => {
  const lang = event.request.headers.get('accept-language')?.split(',')[0];
  if (typeof lang === 'string') {
    locale.set(lang);
  }
  return resolve(event);
};
if (!admin.apps.length) {
  console.log('initializing firebase');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
  });
}
