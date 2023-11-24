import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

const user: Writable<Object | null> = writable(null);
const dataset: Writable<Object | null> = writable(null);

export { user, dataset };
