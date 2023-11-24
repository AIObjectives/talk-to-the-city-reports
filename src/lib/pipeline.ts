import { writable, get } from 'svelte/store';
import { success, error, info } from '$components/toast/theme';
import { doc, updateDoc } from 'firebase/firestore/lite';
import { topologicalSort } from '$lib/utils';
import { datasetCollection } from '$lib/firebase';
import { compute } from '$lib/compute/compute';

export async function updateDataset(updatedData, datasetId) {
	try {
		info('Updating dataset...');
		const copy = JSON.parse(JSON.stringify(updatedData));
		copy.graph.nodes = copy.graph.nodes.map((x) => {
			if (!x.data.save_output) {
				x.data.output = [];
			}
			return x;
		});
		await updateDoc(doc(datasetCollection, datasetId), copy);
		success('Dataset updated');
	} catch (err) {
		console.error('Error updating dataset: ', err);
		error('Error updating dataset');
	}
}

export async function processNodes(nodes, edges, dataset) {
	let allNodes = get(nodes),
		allEdges = get(edges),
		nodeOutputs = {},
		save = false,
		dirtyNodes = new Set(allNodes.filter((node) => node.data.dirty).map((node) => node.id));

	console.log('Dirty nodes', dirtyNodes);

	function markDownstreamNodesAsDirty(nodeId) {
		allEdges.forEach((edge) => {
			if (edge.source === nodeId && !dirtyNodes.has(edge.target)) {
				dirtyNodes.add(edge.target);
				allNodes.find((n) => n.id === nodeId).data.dirty = true;
				markDownstreamNodesAsDirty(edge.target);
			}
		});
	}

	dirtyNodes.forEach((nodeId) => markDownstreamNodesAsDirty(nodeId));

	for (let node of topologicalSort(allNodes, allEdges)) {
		let inputData = {};
		allEdges
			.filter((edge) => edge.target === node.id)
			.forEach((edge) => {
				inputData[edge.source] = nodeOutputs[edge.source];
			});

		save = save || (node.data.dirty && node.data.save_output);
		nodeOutputs[node.id] = await compute[node.data.compute_type](
			node,
			inputData,
			info,
			error,
			success
		);
		dataset.graph = { nodes: allNodes, edges: allEdges };
	}
	if (save) await updateDataset({ graph: { nodes: allNodes, edges: allEdges } }, dataset.id);
}
