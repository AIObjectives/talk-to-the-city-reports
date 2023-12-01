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
	import { useNodes } from '@xyflow/svelte';
	const n = useNodes();

	export let dataset: Dataset;

	let isGraphView = Cookies.get('isGraphView') === 'true';

	const nodes = dataset.graph.nodes,
		edges = dataset.graph.edges;

	function refreshData() {
		dataset = dataset;
		dataset.graph.nodes.set(get(dataset.graph.nodes));
		setTimeout(() => {
			$n = $n;
			for (const node of $n) {
				node.data = { ...node.data };
			}
		}, 500);
	}

	onMount(async () => {
		await dataset.processNodes('load');
		refreshData();
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
				refreshData();
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
