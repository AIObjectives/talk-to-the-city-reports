import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { User } from '$lib/types';

const fitViewStore: Writable<number> = writable(0);
const user: Writable<User | null> = writable(null);
const globalViewMode: Writable<string> = writable('standard');
const storeDataset: Writable<Object | null> = writable(null);
const message: Writable<Object | null> = writable(null);
const graphNotice: Writable<boolean> = writable(false);

export { user, storeDataset, message, fitViewStore, graphNotice, globalViewMode };
