import { toast } from '@zerodevx/svelte-toast';
import type { SvelteToastOptions } from '@zerodevx/svelte-toast/stores.d.ts';

export const success = (m: string | SvelteToastOptions) =>
  toast.push(m, {
    theme: {
      '--toastBackground': '#1e824c',
      '--toastColor': '#fff',
      '--toastBarBackground': '#17a589'
    },
    duration: 5000,
    reversed: true
  });

export const info = (m: string | SvelteToastOptions) =>
  toast.push(m, {
    theme: {
      '--toastBackground': '#141619',
      '--toastColor': '#fff',
      '--toastBarBackground': '#1a4f74'
    },
    duration: 5000,
    reversed: true
  });

export const warning = (m: string | SvelteToastOptions) =>
  toast.push(m, {
    theme: {
      '--toastBackground': '#d39e00',
      '--toastColor': '#fff',
      '--toastBarBackground': '#b37400'
    },
    duration: 5000,
    reversed: true
  });

export const error = (m: string | SvelteToastOptions) =>
  toast.push(m, {
    theme: {
      '--toastBackground': '#c0392b',
      '--toastColor': '#fff',
      '--toastBarBackground': '#a03226'
    },
    duration: 5000,
    reversed: true
  });
