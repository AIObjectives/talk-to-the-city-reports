<script lang="ts">
  import { writable } from 'svelte/store';
  import { setContext } from 'svelte';
  import { SvelteFlowProvider } from '@xyflow/svelte';
  import { Dataset } from '$lib/dataset';
  import PipelineView from './PipelineView.svelte';
  import { globalViewMode } from '$lib/store';
  import { onMount } from 'svelte';

  export let height = '97vh';
  export let width = '100%';
  export let showNodesToolbar = true;
  export let dataset: Dataset;
  export let viewMode: string = 'standard';
  export let showSaveButton: boolean = false;
  export let showCopyButton: boolean = false;
  export let showScreenshotButton: boolean = false;
  export let enableGlobalViewMode: boolean = false;
  export let autoSave: boolean = false;

  onMount(() => {
    viewModeStore.subscribe((x) => {
      if (x != $globalViewMode) $globalViewMode = x;
    });
    if (enableGlobalViewMode)
      globalViewMode.subscribe((x) => {
        if (x != $viewModeStore) $viewModeStore = x;
      });
  });

  let viewModeStore = writable(viewMode);

  setContext('viewMode', viewModeStore);
</script>

<SvelteFlowProvider>
  <PipelineView
    {width}
    {height}
    {showNodesToolbar}
    {showSaveButton}
    {showCopyButton}
    {showScreenshotButton}
    {autoSave}
    bind:dataset
  />
</SvelteFlowProvider>
