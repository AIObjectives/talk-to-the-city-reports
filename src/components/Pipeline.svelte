<script lang="ts">
	import Pipe from '$lib/icons/Pipe.svelte';
	import { get } from 'svelte/store';
	import { user, dataset as store_dataset } from '$lib/store';
	// import { user } from '$lib/store';
	import { onMount } from 'svelte';
	import ToggleView from '$components/ToggleView.svelte';
	import PipelineStandard from '$components/PipelineStandard.svelte';
	import PipelineGraph from '$components/PipelineGraph.svelte';
	import Cookies from 'js-cookie';
	import type { Dataset } from '$lib/dataset';
	import Button from '@smui/button';
	import '@xyflow/svelte/dist/style.css';
	import { useNodes } from '@xyflow/svelte';
	import { useUpdateNodeInternals } from '@xyflow/svelte';
	const updateNodeInternals = useUpdateNodeInternals();

	const n = useNodes();

	export let dataset: Dataset;
	let showPipeline = false;

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
			updateNodeInternals();
		}, 500);
	}

	onMount(async () => {
		await dataset.processNodes('load');
		refreshData();
	});
	$: $store_dataset = dataset;
</script>

<div class="pipeline-icon">
	<button
		on:click={(e) => {
			showPipeline = !showPipeline;
		}}
	>
		<Pipe color="#dcdcdd" size="30px" />
	</button>
</div>

{#if showPipeline || ($user && $user.uid === dataset.owner)}
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
				await dataset.processNodes('run', $user);
				refreshData();
			}}
		>
			Generate Report
		</Button>

		{#if $user && $user.uid === dataset.owner}
			<Button
				on:click={async () => {
					await dataset.updateDataset($user);
				}}
			>
				Save
			</Button>
		{/if}
	</div>
{/if}

<style>
	.pipeline-icon {
		position: fixed;
		bottom: 10px;
		right: 10px;
		cursor: pointer;
	}
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
