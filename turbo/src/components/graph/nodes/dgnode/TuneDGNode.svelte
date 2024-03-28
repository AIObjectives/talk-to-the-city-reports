<script lang="ts">
  import TuneRow from './TuneRow.svelte';
  import Paper from '@smui/paper';
  import _ from 'lodash';
  import type { Dataset } from '$lib/dataset';

  export let data: object;
  export let dataset: Dataset;
</script>

<Paper class="mb-5">
  {#each _.keys(data) as key}
    <TuneRow {key} bind:data={data[key]} {dataset} />
  {/each}
</Paper>
