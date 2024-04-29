<script lang="ts">
  import { user } from '$lib/store';
  import { getContext } from 'svelte';
  import { type Writable } from 'svelte/store';
  import { _ as __ } from 'svelte-i18n';

  import { globalViewMode } from '$lib/store';
  import { Dataset } from '$lib/dataset';

  import Pipeline from '$components/Pipeline.svelte';
  import Report from '$components/report/Report.svelte';
  import Description from '$components/report/Description.svelte';

  let dataset: Dataset | null = null;

  const datasetSub = getContext('dataset') as Writable<Dataset | null>;
  datasetSub.subscribe((value) => {
    dataset = value;
  });
  $: isAdmin = $user?.uid === import.meta.env.VITE_ADMIN;
  $: isOwner = dataset?.owner === $user?.uid;
</script>

<main id="report-main">
  {#if !dataset}
    <p class="text-center text-lg text-gray-500">{$__('loading')}</p>
  {:else if dataset?.isPrivate && !(isAdmin || isOwner)}
    <p class="text-center text-lg text-gray-500">{$__('report_is_private')}</p>
  {:else}
    {#if $globalViewMode == 'standard'}
      <Description bind:dataset />
    {/if}
    <Pipeline
      bind:dataset
      showSaveButton={true}
      showCopyButton={true}
      showScreenshotButton={true}
      enableGlobalViewMode={true}
      autoSave={true}
    />
    {#if $globalViewMode == 'graph'}
      <Description bind:dataset />
    {/if}
    <Report bind:dataset />
  {/if}
</main>

<style>
  main {
    overflow-y: auto;
    overflow-x: hidden;
  }

  @media (max-width: 768px) {
    main {
      order: 1;
      width: 100%;
    }
  }
</style>
