<script lang="ts">
	import { setContext } from 'svelte';
	import Pipe from '$lib/icons/Pipe.svelte';
	import { get } from 'svelte/store';
	import Tune from '$lib/icons/Tune.svelte';
	import { user, storeDataset, fitViewStore } from '$lib/store';
	import PipelineStandard from '$components/PipelineStandard.svelte';
	import PipelineGraph from '$components/PipelineGraph.svelte';
	import type { Dataset } from '$lib/dataset';
	import Button from '@smui/button';
	import '@xyflow/svelte/dist/style.css';
	import { useNodes } from '@xyflow/svelte';
	import { useSvelteFlow } from '@xyflow/svelte';
	import ToggleNotice from '$components/ToggleNotice.svelte';
	import GraphNotice from '$components/GraphNotice.svelte';
	import TemplateSwitcher from '$components/TemplateSwitcher.svelte';
	import { _ as __ } from 'svelte-i18n';
	import { getContext } from 'svelte';
	let viewMode = getContext('viewMode');
	const { fitView } = useSvelteFlow();

	const n = useNodes();

	export let height = '97vh';
	export let width = '100%';
	export let showNodesToolbar = true;
	export let dataset: Dataset;
	export let showSaveButton: boolean = false;
	export let showCopyButton: boolean = false;
	export let showScreenshotButton: boolean = false;

	let showPipeline = false;
	let tune = false;

	setContext('dataset', dataset);

	const nodes = dataset.graph.nodes,
		edges = dataset.graph.edges;

	function refreshData() {
		// Force refresh of dataset
		// please leave as is
		dataset = dataset;
		dataset.graph.nodes.set(get(dataset.graph.nodes));
		setTimeout(() => {
			$n = $n;
			for (const node of $n) {
				node.data = { ...node.data };
			}
		}, 500);
	}

	const load = async () => {
		await dataset.processNodes('load', $user);
		refreshData();
	};

	$: load();
	$: $storeDataset = dataset;

	$: {
		$fitViewStore;
		// Delay fitView to ensure elements are rendered and positioned
		setTimeout(() => {
			fitView();
		}, 100);
	}
</script>

<div class="pipeline-icon">
	<button
		aria-label="Toggle Pipeline View"
		on:click={(e) => {
			showPipeline = !showPipeline;
		}}
	>
		<Pipe color="#dcdcdd" size="30px" />
	</button>
</div>

{#if showPipeline || ($user && $user.uid === dataset.owner)}
	{#if $viewMode == 'standard'}
		<div class="pipeline-container">
			<Button
				style="width: 300px; margin-left: auto;"
				on:click={(e) => {
					tune = !tune;
				}}
			>
				<Tune size="30px" /> &nbsp; {#if tune}{$__('hide_advanced_settings')}{:else}{$__(
						'show_advanced_settings'
					)}{/if}
			</Button>
			{#if tune}
				<ToggleNotice />
				<TemplateSwitcher {dataset} />
			{/if}
		</div>
	{/if}

	<div style="display: flex; width: 100%;">
		<div
			class="graph-div"
			style="flex-direction: column; width: {$viewMode === 'graph' ? '100%' : '0vw'};"
		>
			<PipelineGraph
				{nodes}
				{edges}
				bind:dataset
				{showNodesToolbar}
				{showSaveButton}
				{showCopyButton}
				{showScreenshotButton}
				{height}
				{width}
			/>
		</div>
		{#if $viewMode == 'standard'}
			<div
				class="standard-div"
				style="display: flex; justify-content: center; align-items: center; flex-direction: column; width: {$viewMode ===
				'standard'
					? '100%'
					: '0vw'}"
			>
				<PipelineStandard />
			</div>
		{/if}
	</div>

	<div class="pipeline-container">
		<Button
			on:click={async () => {
				await dataset.processNodes('run', $user);
				refreshData();
			}}
		>
			{$__('generate_report')}
		</Button>

		{#if $user && $user.uid === dataset.owner && showSaveButton}
			<Button
				on:click={async () => {
					await dataset.updateDataset($user);
				}}
			>
				{$__('save')}
			</Button>
		{/if}
	</div>
{/if}

<GraphNotice />

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

	.graph-div,
	.standard-div {
		box-sizing: border-box; /* Include padding and border in the element's total width */
	}

	.graph-div {
		flex: none;
		overflow: auto;
		height: 100%;
	}

	.standard-div {
		flex: none;
		overflow: auto;
		height: 100%;
	}
</style>
