<script lang="ts">
	import Card from '@smui/card';
	import { writable, get } from 'svelte/store';
	import { SvelteFlow, SvelteFlowProvider, type Node, type Edge } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import { topologicalSort } from '$lib/utils';
	import { doc, updateDoc } from 'firebase/firestore/lite';
	import { datasetCollection } from '$lib/firebase';
	import { csv } from '$lib/compute/csv';
	import { cluster_extraction } from '$lib/compute/cluster_extraction';
	import { argument_extraction } from '$lib/compute/argument_extraction';
	import { open_ai_key } from '$lib/compute/open_ai_key';
	import { report } from '$lib/compute/report';
	import { participant_filter } from '$lib/compute/participant_filter';
	import { success, error, info } from '$components/toast/theme';
	import Button from '@smui/button';
	import { user } from '$lib/store';

	// input nodes
	import TextInputNode from '$components/TextInputNode.svelte';
	import PromptNode from '$components/PromptNode.svelte';
	import CSVNode from '$components/CSVNode.svelte';

	export let dataset;

	async function updateDataset(updatedData) {
		try {
			info('Updating dataset...');
			await updateDoc(doc(datasetCollection, dataset.id), updatedData);
			dataset.graph = updatedData.graph;
			success('Dataset updated');
		} catch (err) {
			console.error('Error updating dataset: ', err);
			error('Error updating dataset');
		}
	}

	const nodeTypes = {
		'text-input': TextInputNode,
		prompt: PromptNode,
		csv: CSVNode
	};

	const compute = {
		open_ai_key: open_ai_key,
		csv: csv,
		cluster_extraction: cluster_extraction,
		argument_extraction: argument_extraction,
		report: report,
		participant_filter: participant_filter
	};

	const nodes = writable<Node[]>(dataset.graph.nodes);
	const edges = writable<Edge[]>(dataset.graph.edges);

	async function processNodes() {
		let nodeOutputs = {};
		const allNodes = get(nodes);
		const allEdges = get(edges);
		const sortedNodes = topologicalSort(allNodes, allEdges);
		let save = false;

		let dirtyNodes = new Set(allNodes.filter((node) => node.data.dirty).map((node) => node.id));

		function markDownstreamNodesAsDirty(nodeId) {
			allEdges.forEach((edge) => {
				if (edge.source === nodeId && !dirtyNodes.has(edge.target)) {
					dirtyNodes.add(edge.target);
					markDownstreamNodesAsDirty(edge.target);
				}
			});
		}

		dirtyNodes.forEach((nodeId) => markDownstreamNodesAsDirty(nodeId));

		for (let nodeId of sortedNodes) {
			const node = allNodes.find((n) => n.id === nodeId);

			let inputData = {};
			allEdges
				.filter((edge) => edge.target === node.id)
				.forEach((edge) => {
					if (nodeOutputs[edge.source] !== undefined) {
						inputData[edge.source] = nodeOutputs[edge.source];
					}
				});

			save = save || node.data.dirty;
			let output = await compute[node.id](node, inputData, info, error, success);
			nodeOutputs[node.id] = output;
		}

		if (save) {
			updateDataset({ graph: { nodes: allNodes, edges: allEdges } });
		}
	}
</script>

<div class="pipeline-container">
	{#if $user && $user.uid === dataset.owner}
		<SvelteFlowProvider>
			{#each $nodes as node (node.id)}
				{#if nodeTypes[node.type]}
					<Card class="m-4">
						<div class="p-4">
							<svelte:component this={nodeTypes[node.type]} data={node.data} />
						</div>
					</Card>
				{/if}
			{/each}

			<div style:height="0vh">
				<SvelteFlow
					{nodes}
					{edges}
					{nodeTypes}
					elementsSelectable={false}
					preventScrolling={false}
					nodesDraggable={false}
					panOnDrag={false}
					autoPanOnNodeDrag={false}
					zoomOnDoubleClick={false}
					fitView
				/>
			</div>
		</SvelteFlowProvider>

		<Button
			on:click={async () => {
				await processNodes();
			}}
		>
			Generate Report
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
