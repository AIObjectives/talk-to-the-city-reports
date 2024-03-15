<script lang="ts">
  import { tick } from 'svelte';
  import { setContext, getContext } from 'svelte';
  import { get } from 'svelte/store';
  import { type Writable } from 'svelte/store';

  import '@xyflow/svelte/dist/style.css';
  import { useNodes } from '@xyflow/svelte';
  import { useSvelteFlow } from '@xyflow/svelte';
  import { _ as __ } from 'svelte-i18n';

  import { user, storeDataset, fitViewStore, refreshStore } from '$lib/store';
  import type { Dataset } from '$lib/dataset';

  import Pipe from '$lib/icons/Pipe.svelte';
  import Tune from '$lib/icons/Tune.svelte';
  import Button from '@smui/button';
  import ToggleNotice from '$components/ToggleNotice.svelte';
  import PipelineStandard from '$components/PipelineStandard.svelte';
  import PipelineGraph from '$components/PipelineGraph.svelte';
  import GraphNotice from '$components/GraphNotice.svelte';
  import PipelineNotice from '$components/PipelineNotice.svelte';
  import TemplateSwitcher from '$components/TemplateSwitcher.svelte';

  export let height = '97vh';
  export let width = '100%';
  export let showNodesToolbar = true;
  export let dataset: Dataset;
  export let showSaveButton: boolean = false;
  export let showCopyButton: boolean = false;
  export let showScreenshotButton: boolean = false;
  export let autoSave: boolean = false;

  let viewMode = getContext('viewMode') as Writable<string>;
  const { fitView } = useSvelteFlow();
  const n = useNodes();
  let showPipeline = false;
  let tune = false;
  let standardHasNodes = false;
  const nodes = dataset.graph.nodes,
    edges = dataset.graph.edges;

  setContext('dataset', dataset);

  function refreshData() {
    // Force refresh of dataset
    // please leave as is
    dataset = dataset;
    dataset.graph.nodes.set(get(dataset.graph.nodes));
    setTimeout(() => {
      $n = $n;
      for (const node of $n) {
        node.data = { ...node.data };
      }
    }, 500);
  }

  const load = async () => {
    await dataset.processNodes('load', $user, false, refreshData);
    await tick();
    refreshData();
  };

  $: load();
  $: $storeDataset = dataset;

  refreshStore.subscribe(async () => {
    refreshData();
  });

  $: {
    $fitViewStore;
    // Delay fitView to ensure elements are rendered and positioned
    setTimeout(() => {
      fitView();
    }, 100);
  }
</script>

<div class="pipeline-icon">
  <button
    aria-label="Toggle Pipeline View"
    on:click={(e) => {
      showPipeline = !showPipeline;
    }}
  >
    <Pipe color="#dcdcdd" size="30px" />
  </button>
</div>

{#if showPipeline || ($user && $user.uid === dataset.owner)}
  {#if $viewMode == 'standard'}
    <div class="pipeline-container">
      <Button
        style="width: 300px; margin-left: auto;"
        on:click={(e) => {
          tune = !tune;
        }}
      >
        <Tune size="30px" /> &nbsp; {#if tune}{$__('hide_advanced_settings')}{:else}{$__(
            'show_advanced_settings'
          )}{/if}
      </Button>
      {#if tune}
        <ToggleNotice />
        <TemplateSwitcher {dataset} />
      {/if}
    </div>
  {/if}
{/if}

<!-- The pipeline graph must be in the DOM even when in standard view -->
<!-- it is therefore off-screen when in standard view  -->
<PipelineGraph
  {nodes}
  {edges}
  bind:dataset
  {showNodesToolbar}
  {showSaveButton}
  {showCopyButton}
  {showScreenshotButton}
  {height}
  {width}
  {autoSave}
/>

{#if $viewMode == 'standard'}
  <PipelineStandard {dataset} {showPipeline} bind:standardHasNodes />
{/if}

{#if standardHasNodes}
  <div class="pipeline-container">
    <Button
      on:click={async () => {
        await dataset.processNodes('run', $user, autoSave);
        refreshData();
      }}
    >
      {$__('generate_report')}
    </Button>

    {#if $user && $user.uid === dataset.owner && showSaveButton}
      <Button
        on:click={async () => {
          await dataset.updateDataset($user);
        }}
      >
        {$__('save')}
      </Button>
    {/if}
  </div>
{/if}
<br />
<br />

<PipelineNotice />
<GraphNotice />

<style>
  .pipeline-icon {
    position: fixed;
    bottom: 10px;
    right: 10px;
    cursor: pointer;
  }
  .pipeline-container {
    padding: var(--main-padding);
    max-width: 50rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
