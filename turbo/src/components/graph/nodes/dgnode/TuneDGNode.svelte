<script lang="ts">
	import TuneRow from './TuneRow.svelte';
	import Paper from '@smui/paper';
	import _ from 'lodash';
	export let data: object;
</script>

<Paper class="mb-5">
	{#each _.keys(data) as key}
		<TuneRow {key} bind:data={data[key]} />
	{/each}
</Paper>
