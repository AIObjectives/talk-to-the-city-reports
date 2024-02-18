<script lang="ts">
  import { Dataset } from '$lib/dataset';
  import Report from '$components/report/Report.svelte';
  import { _ as __ } from 'svelte-i18n';

  export let data;
  const dataset = Dataset.loadDatasetFromDoc(data.doc, data.id);
</script>

<main>
  {#if !dataset}
    <p class="text-center text-lg text-gray-500">{$__('loading')}</p>
  {:else}
    <h1 class="text-3xl uppercase">{dataset.title}</h1>
    <Report {dataset} />
  {/if}
</main>

<style>
  main {
    flex-grow: 1;
    padding: 1rem;
  }

  @media (max-width: 768px) {
    main {
      order: 1;
      width: 100%;
    }
  }
</style>
