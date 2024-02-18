import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { User } from 'firebase/auth';

const reportStore: Writable<Record<string, any>> = writable(null);
const fitViewStore: Writable<number> = writable(0);
const user: Writable<User | null> = writable(null);
const globalViewMode: Writable<string> = writable('standard');
const chartMode: Writable<string> = writable('bar');
const storeDataset: Writable<Object | null> = writable(null);
const message: Writable<Object | null> = writable(null);
const graphNotice: Writable<boolean> = writable(false);
const pipelineStepsRemaining: Writable<number> = writable(0);

export {
  user,
  storeDataset,
  message,
  fitViewStore,
  graphNotice,
  globalViewMode,
  reportStore,
  chartMode,
  pipelineStepsRemaining
};
