<script>
	import Graph from 'svelte-material-icons/Graph.svelte';
	import Table from 'svelte-material-icons/Table.svelte';
	import { useSvelteFlow } from '@xyflow/svelte';
	const { fitView } = useSvelteFlow();
	import { useEdges, useNodes } from '@xyflow/svelte';
	export let isGraphView = false;
	const nodes = useNodes();
</script>

<button
	on:click={() => {
		isGraphView = !isGraphView;
		if (isGraphView) {
			setTimeout(() => {
				$nodes = $nodes;
				for (const node of $nodes) {
					node.data = { ...node.data };
				}
				fitView();
			}, 500);
		}
	}}
>
	{#if isGraphView}
		<Table color="#888" />
	{:else}
		<Graph color="#888" />
	{/if}
</button>
