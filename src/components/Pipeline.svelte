<script lang="ts">
	import { writable, get } from 'svelte/store';
	import { SvelteFlow, type Node, type Edge } from '@xyflow/svelte';
	import TextInputNode from '$components/TextInputNode.svelte';
	import PromptNode from '$components/PromptNode.svelte';
	import CSVNode from '$components/CSVNode.svelte';
	import '@xyflow/svelte/dist/style.css';
	import { topologicalSort } from '$lib/utils';
	import { doc, updateDoc } from 'firebase/firestore/lite';
	import { datasetCollection } from '$lib/firebase';
	import { csv } from '$lib/compute/csv';
	import { cluster_extraction } from '$lib/compute/cluster_extraction';
	import { argument_extraction } from '$lib/compute/argument_extraction';
	import { open_ai_key } from '$lib/compute/open_ai_key';
	import { report } from '$lib/compute/report';

	export let dataset;

	async function updateDataset(updatedData) {
		try {
			await updateDoc(doc(datasetCollection, dataset.id), updatedData);
		} catch (err) {
			console.error('Error updating document: ', err);
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
		report: report
	};

	const nodes = writable<Node[]>(dataset.graph.nodes);
	const edges = writable<Edge[]>(dataset.graph.edges);
	async function processNodes() {
		let nodeOutputs = {};
		const sortedNodes = topologicalSort(get(nodes), edges);
		for (let i = 0; i < sortedNodes.length; i++) {
			const nodeId = sortedNodes[i];
			const node = get(nodes).find((n) => n.id === nodeId);
			let edgeData = get(edges)
				.filter((edge) => edge.target === node.id)
				.filter((edge) => nodeOutputs[edge.source] !== undefined);

			let inputData = {};
			edgeData.forEach((edge) => {
				inputData[edge.source] = nodeOutputs[edge.source];
			});
			let output = await compute[node.id](node, inputData);
			nodeOutputs[node.id] = output;
		}
	}
</script>

<div style:height="80vh">
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

<button
	class="mt-10 w-40 bg-blue-300 hover:bg-blue-400 py-2 px-4 rounded"
	on:click={async () => {
		await processNodes();
	}}
>
	Process
</button>

<button
	class="mt-10 w-40 bg-blue-300 hover:bg-blue-400 py-2 px-4 rounded"
	on:click={() => {
		updateDataset({ graph: { nodes: get(nodes), edges: get(edges) } });
	}}
>
	Save
</button>
