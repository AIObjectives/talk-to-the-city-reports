import { writable } from 'svelte/store';
import Cookies from 'js-cookie';
import type { Writable } from 'svelte/store';
import type { User } from '$lib/types';

const fitViewStore: Writable<number> = writable(0);
const user: Writable<User | null> = writable(null);
const dataset: Writable<Object | null> = writable(null);
const message: Writable<Object | null> = writable(null);
const graphNotice: Writable<boolean> = writable(false);
const viewMode = writable(Cookies.get('viewMode') || 'standard');

export { user, dataset, message, viewMode, fitViewStore, graphNotice };
