<script lang="ts">
  import { query, where, getDocs, orderBy } from 'firebase/firestore/lite';
  import type { QueryConstraint } from 'firebase/firestore';
  import { datasetCollection } from '$lib/firebase';
  import { _ as __ } from 'svelte-i18n';

  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import TextField from '@smui/textfield';

  import { user } from '$lib/store';
  import { Dataset } from '$lib/dataset';
  import Tune from '$lib/icons/Tune.svelte';
  import ProjectCard from '$components/ProjectCard.svelte';

  let datasets: Dataset[] = [];
  let filteredDatasets: Dataset[] = [];
  let loading: boolean = true;
  $: isAdmin = $user.uid === import.meta.env.VITE_ADMIN;
  let showAll: boolean = false;
  let showAdmin: boolean = false;
  let filterByComputeType: string = '';

  async function loadDatasets() {
    let filter: QueryConstraint[] = showAll ? [] : [where('owner', '==', $user.uid)];
    filter.push(orderBy('timestamp', 'desc'));
    const q = query(datasetCollection, ...filter);
    const querySnapshot = await getDocs(q);
    datasets = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return new Dataset(
        data.title,
        data.slug,
        data.owner,
        data.template,
        data.description,
        data.graph,
        doc.id
      );
    });
    datasets = datasets;
    filteredDatasets = datasets;
    loading = false;
  }

  $: if (filterByComputeType) {
    filteredDatasets = datasets.filter((dataset) => {
      const nodes = dataset.graph.findByComputeType(filterByComputeType);
      return nodes.length > 0;
    });
  }

  $: {
    showAll;
    loadDatasets();
  }
</script>

{#if isAdmin}
  <button on:click={() => (showAdmin = !showAdmin)}><Tune /></button>
{/if}

{#if showAdmin}
  <div class="flex justify-center px-4">
    <div class="max-w-xl w-full">
      <FormField align="end">
        <Checkbox bind:checked={showAll} />
        <span slot="label">Show all.</span>
      </FormField>
      <TextField
        label="Filter by compute type"
        helperLine$style="width: 100% !important;"
        bind:value={filterByComputeType}
      />
    </div>
  </div>
{/if}

<div class="flex flex-wrap justify-center">
  {#if loading}
    <p class="text-center text-lg text-gray-500">{$__('loading')}</p>
  {/if}
  {#each filteredDatasets as dataset (dataset.id)}
    <ProjectCard {dataset} {loadDatasets} showOwner={showAll} />
  {/each}
</div>
