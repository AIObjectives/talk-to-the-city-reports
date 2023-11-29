<script lang="ts">
	import { get } from 'svelte/store';
	import { user } from '$lib/store';
	import { onMount } from 'svelte';
	import ToggleView from '$components/ToggleView.svelte';
	import PipelineStandard from '$components/PipelineStandard.svelte';
	import PipelineGraph from '$components/PipelineGraph.svelte';
	import Cookies from 'js-cookie';
	import type { Dataset } from '$lib/dataset';
	import Button from '@smui/button';
	import '@xyflow/svelte/dist/style.css';
	import { useEdges, useNodes } from '@xyflow/svelte';
	const n = useNodes();
	import { useUpdateNodeInternals } from '@xyflow/svelte';
	const updateNodeInternals = useUpdateNodeInternals();

	export let dataset: Dataset;

	let isGraphView = Cookies.get('isGraphView') === 'true';

	const nodes = dataset.graph.nodes,
		edges = dataset.graph.edges;

	onMount(async () => {
		await dataset.processNodes('load');
		dataset.graph.nodes.update((x) => x);
		dataset = dataset;
		$n = $n;
	});
</script>

{#if $user && $user.uid === dataset.owner}
	<div class="pipeline-container">
		<ToggleView bind:isGraphView />
		{#if !isGraphView}
			<PipelineStandard />
		{/if}
	</div>

	<PipelineGraph {isGraphView} {nodes} {edges} {dataset} />

	<div class="pipeline-container">
		<Button
			on:click={async () => {
				await dataset.processNodes('run');
				dataset = dataset;
				dataset.graph.nodes.set(get(dataset.graph.nodes));
				for (const node of $n) {
					if (Array.isArray(node.data.output)) {
						node.data.output = node.data.output.map((x) => ({ ...x }));
					} else if (typeof node.data.output === 'object') {
						node.data.output = { ...node.data.output };
					}
					node.data = { ...node.data };
					updateNodeInternals(node.id);
				}
			}}
		>
			Generate Report
		</Button>

		<Button
			on:click={async () => {
				await dataset.updateDataset();
			}}
		>
			Save
		</Button>
	</div>
{/if}

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
