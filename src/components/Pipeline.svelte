<script lang="ts">
	import Cookies from 'js-cookie';
	import { onMount } from 'svelte';
	import Pipe from '$lib/icons/Pipe.svelte';
	import { get } from 'svelte/store';
	import { user, dataset as store_dataset, fitViewStore } from '$lib/store';
	import PipelineStandard from '$components/PipelineStandard.svelte';
	import PipelineGraph from '$components/PipelineGraph.svelte';
	import type { Dataset } from '$lib/dataset';
	import Button from '@smui/button';
	import '@xyflow/svelte/dist/style.css';
	import { useNodes } from '@xyflow/svelte';
	import { useUpdateNodeInternals } from '@xyflow/svelte';
	import { viewMode } from '$lib/store';
	import { useSvelteFlow } from '@xyflow/svelte';
	import DragVertical from '$lib/icons/DragVertical.svelte';

	const { fitView } = useSvelteFlow();
	const updateNodeInternals = useUpdateNodeInternals();

	const n = useNodes();

	export let dataset: Dataset;
	export let dataset_refresh: number;
	let showPipeline = false;

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

	const load = async () => {
		await dataset.processNodes('load');
		refreshData();
	};

	$: {
		load(dataset_refresh);
	}

	$: $store_dataset = dataset;

	$: {
		$fitViewStore;
		setTimeout(() => {
			fitView();
		}, 100);
	}

	let startX;
	let startWidthGraph;
	let startWidthStandard;

	function initDrag(e: MouseEvent) {
		e.preventDefault();
		document.body.classList.add('no-select');

		startX = e.clientX;
		const graphDiv = document.querySelector('.graph-div') as HTMLElement;
		const standardDiv = document.querySelector('.standard-div') as HTMLElement;
		startWidthGraph = graphDiv.offsetWidth;
		startWidthStandard = standardDiv.offsetWidth;
		document.addEventListener('mousemove', doDrag, false);
		document.addEventListener('mouseup', stopDrag, false);
	}

	function doDrag(e: MouseEvent) {
		const graphDiv = document.querySelector('.graph-div') as HTMLElement;
		const standardDiv = document.querySelector('.standard-div') as HTMLElement;
		const resizeHandleWidth = document.querySelector('.resize-handle').offsetWidth;

		// New width calculation should subtract the resize handle width
		let delta = e.clientX - startX;
		graphDiv.style.width = startWidthGraph + delta - resizeHandleWidth + 'px';
		standardDiv.style.width = startWidthStandard - delta - resizeHandleWidth + 'px';
	}

	function stopDrag(e: MouseEvent) {
		const graphDiv = document.querySelector('.graph-div') as HTMLElement;
		const standardDiv = document.querySelector('.standard-div') as HTMLElement;
		const resizeHandleWidth = document.querySelector('.resize-handle').offsetWidth;

		// Calculate new width based on the mouse movement and add/subtract the resize handle width accordingly
		let delta = e.clientX - startX;
		let newWidthGraph = startWidthGraph + delta - resizeHandleWidth;
		let newWidthStandard = startWidthStandard - delta;

		// Ensure total width including the resize handle does not exceed the parent's width
		const parentWidth = graphDiv.parentElement.offsetWidth;
		const maxWidthGraph = parentWidth - newWidthStandard - resizeHandleWidth;

		if (newWidthGraph > maxWidthGraph) {
			newWidthGraph = maxWidthGraph;
		}

		let newWidthGraphPercent = (newWidthGraph / parentWidth) * 100;

		Cookies.set('dual-pos', newWidthGraphPercent, { expires: 7 }); // Save for 7 days

		// Set the width using calculated values
		graphDiv.style.width = newWidthGraph + 'px';
		standardDiv.style.width = newWidthStandard + 'px';

		document.removeEventListener('mousemove', doDrag, false);
		document.removeEventListener('mouseup', stopDrag, false);

		document.body.classList.remove('no-select');
	}

	onMount(() => {
		const savedWidthPercent = Cookies.get('dual-pos');
		const resizeHandleWidth = 5;
		if ($viewMode == 'standard') {
			return;
		}

		if (savedWidthPercent) {
			const graphDiv = document.querySelector('.graph-div') as HTMLElement;
			const standardDiv = document.querySelector('.standard-div') as HTMLElement;
			if (!(graphDiv && standardDiv)) return;
			const parentWidth = graphDiv.parentElement.offsetWidth;

			let savedWidthGraph = (parentWidth * parseFloat(savedWidthPercent)) / 100 - resizeHandleWidth;
			let savedWidthStandard = parentWidth - savedWidthGraph - resizeHandleWidth;

			graphDiv.style.width = savedWidthGraph + 'px';
			standardDiv.style.width = savedWidthStandard + 'px';
		}
	});
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
	<div style="display: flex; width: 100%;">
		<div
			class="graph-div"
			style="flex-direction: column; width: {$viewMode === 'graph' || $viewMode === 'dual'
				? $viewMode === 'dual'
					? '70%'
					: '100%'
				: '0vw'};"
		>
			<PipelineGraph {nodes} {edges} bind:dataset />
		</div>

		{#if $viewMode == 'dual'}
			<div class="resize-handle" on:mousedown={initDrag}><DragVertical color={'#9999ee'} /></div>
		{/if}

		{#if $viewMode == 'standard' || $viewMode == 'dual'}
			<div
				class="standard-div"
				style="display: flex; justify-content: center; align-items: center; flex-direction: column; width: {$viewMode ===
					'standard' || $viewMode === 'dual'
					? $viewMode === 'dual'
						? '30%'
						: '100%'
					: '0vw'}"
			>
				<PipelineStandard {dataset} />
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

	.graph-div,
	.standard-div {
		box-sizing: border-box; /* Include padding and border in the element's total width */
	}
	.resize-handle {
		cursor: ew-resize;
		width: 5px;
		height: 100vh;
		z-index: 10;
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

	.no-select {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
</style>
