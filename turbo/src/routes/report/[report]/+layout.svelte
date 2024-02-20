<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import { page } from '$app/stores';
  import { writable } from 'svelte/store';
  import { _ as __ } from 'svelte-i18n';
  import _ from 'lodash';

  import { Dataset } from '$lib/dataset';
  import { globalViewMode, reportStore, storeDataset, isMobile, openLeftDrawer } from '$lib/store';

  import Drawer from '$components/report/Drawer.svelte';

  let dataset: Dataset | null = null;
  let datasetSub = writable(null);

  setContext('dataset', datasetSub);

  onMount(async () => {
    const slug = $page.params.report;
    dataset = await Dataset.loadDataset(slug);
    datasetSub.set(dataset);
    storeDataset.set(dataset);
  });

  $: isStandard = $globalViewMode === 'standard';
  $: showDrawer = (!$isMobile || $openLeftDrawer) && isStandard && $reportStore?.topics?.length > 0;
  $: appContentStyle = showDrawer && !$isMobile ? 'margin-left: 256px;' : 'margin-left: 0;';
</script>

<svelte:head>
  {#if dataset}
    <title>{dataset.title}</title>
  {/if}
</svelte:head>

<div class="drawer-container" class:standard-view={isStandard}>
  <Drawer {showDrawer} />
  <div class="app-content" style={appContentStyle}>
    <main class="main-content">
      <slot />
    </main>
  </div>
</div>

<style>
  .drawer-container {
    display: flex;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .drawer-container.standard-view {
    height: auto;
  }

  .drawer-container:not(.standard-view) {
    height: auto;
  }

  .app-content {
    flex-grow: 1;
    overflow-x: hidden;
    position: relative;
    transition: margin-left 0.3s;
  }

  .main-content {
    box-sizing: border-box;
    max-height: 100%;
    height: 100%;
  }
</style>
