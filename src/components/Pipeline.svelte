<script lang="ts">
	import { writable, get } from 'svelte/store';
	import { SvelteFlowProvider, type Node, type Edge } from '@xyflow/svelte';
	import { user } from '$lib/store';
	import { onMount } from 'svelte';
	import { updateDataset, processNodes } from '$lib/pipeline';
	import ToggleView from '$components/ToggleView.svelte';
	import PipelineStandard from '$components/PipelineStandard.svelte';
	import PipelineGraph from '$components/PipelineGraph.svelte';
	import { nodeTypes } from '$lib/node_types';

	import Button from '@smui/button';

	import '@xyflow/svelte/dist/style.css';

	onMount(async () => {
		await processNodes(nodes, edges, dataset);
		console.log(dataset);
		dataset = dataset;
	});

	export let dataset;

	let isGraphView = false;

	const nodes = writable<Node[]>(dataset.graph.nodes),
		edges = writable<Edge[]>(dataset.graph.edges);
</script>

<div class="pipeline-container">
	{#if $user && $user.uid === dataset.owner}
		<SvelteFlowProvider>
			<ToggleView bind:isGraphView />
			{#if !isGraphView}
				<PipelineStandard />
			{/if}
			<PipelineGraph {isGraphView} {nodes} {edges} {nodeTypes} />
		</SvelteFlowProvider>

		<Button
			on:click={async () => {
				await processNodes(nodes, edges, dataset);
				dataset = dataset;
			}}
		>
			Generate Report
		</Button>

		<Button
			on:click={async () => {
				await updateDataset({ graph: { nodes: get(nodes), edges: get(edges) } }, dataset.id);
			}}
		>
			Save
		</Button>
	{/if}
</div>

<style>
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
