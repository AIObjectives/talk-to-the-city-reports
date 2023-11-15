<script lang="ts">
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
	import { success, error, info } from '$components/toast/theme';

	// input nodes
	import TextInputNode from '$components/TextInputNode.svelte';
	import PromptNode from '$components/PromptNode.svelte';
	import CSVNode from '$components/CSVNode.svelte';

	export let dataset;

	async function updateDataset(updatedData) {
		try {
			info('Updating dataset...');
			console.log(JSON.stringify(updatedData));
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
			let output = await compute[node.id](node, inputData, info, error, success);
			nodeOutputs[node.id] = output;
			dataset.graph = { nodes: get(nodes), edges: get(edges) };
			console.log(dataset);
			updateDataset({ graph: { nodes: get(nodes), edges: get(edges) } });
		}
	}
</script>

<SvelteFlowProvider>
	<div class="relative rounded overflow-hidden shadow-lg m-4 p-4 bg-gray-200">
		<TextInputNode data={$nodes[0].data} />
	</div>
	<div class="relative rounded overflow-hidden shadow-lg m-4 p-4 bg-gray-200">
		<CSVNode data={$nodes[1].data} />
	</div>
	<div class="relative rounded overflow-hidden shadow-lg m-4 p-4 bg-gray-200">
		<PromptNode data={$nodes[2].data} />
	</div>
	<div class="relative rounded overflow-hidden shadow-lg m-4 p-4 bg-gray-200">
		<PromptNode data={$nodes[3].data} />
	</div>

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

<button
	class="mt-10 w-40 bg-blue-300 hover:bg-blue-400 py-2 px-4 rounded"
	on:click={async () => {
		await processNodes();
	}}
>
	Generate Report
</button>

<button
	class="mt-10 w-40 bg-blue-300 hover:bg-blue-400 py-2 px-4 rounded"
	on:click={() => {
		updateDataset({ graph: { nodes: get(nodes), edges: get(edges) } });
	}}
>
	Save
</button>
