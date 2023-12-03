import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { User } from '$lib/types';
// import { Dataset } from '$lib/dataset';

const user: Writable<User | null> = writable(null);
const dataset: Writable<Object | null> = writable(null);

export { user, dataset };
