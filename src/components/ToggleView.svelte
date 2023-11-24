<script>
	import Graph from 'svelte-material-icons/Graph.svelte';
	import Table from 'svelte-material-icons/Table.svelte';
	import { useSvelteFlow } from '@xyflow/svelte';
	const { fitView } = useSvelteFlow();
	export let isGraphView = false;
</script>

<button
	on:click={() => {
		isGraphView = !isGraphView;
		if (isGraphView) {
			setTimeout(() => {
				fitView();
			}, 100);
		}
	}}
>
	{#if isGraphView}
		<Table color="#888" />
	{:else}
		<Graph color="#888" />
	{/if}
</button>
