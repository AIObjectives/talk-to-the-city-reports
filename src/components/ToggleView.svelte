<script>
	import Graph from 'svelte-material-icons/Graph.svelte';
	import Table from 'svelte-material-icons/Table.svelte';
	import Cookies from 'js-cookie';
	import { useSvelteFlow } from '@xyflow/svelte';
	import { useNodes } from '@xyflow/svelte';

	export let isGraphView;

	const { fitView } = useSvelteFlow();
	const nodes = useNodes();
</script>

<button
	on:click={() => {
		Cookies.set('isGraphView', !isGraphView);
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
