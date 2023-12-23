import _ from 'lodash';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import type { DGNodeInterface, GCSBaseData, DGEdgeInterface } from '$lib/node_data_types';

export async function uploadJSONToGCS(
	node: DGNodeInterface<GCSBaseData>,
	data: GCSBaseData,
	slug: string
) {
	try {
		if (!node) {
			throw new Error('Node not provided');
		}
		const storage = getStorage();
		const userId = getAuth().currentUser?.uid;
		const filePath = `uploads/${userId}/${slug}/${node.id}.json`;
		const fileRef = storageRef(storage, filePath);
		const jsonData = JSON.stringify(data, null, 2);
		const blob = new Blob([jsonData], { type: 'application/json' });
		await uploadBytes(fileRef, blob);
		node.data.gcs_path = filePath;
		return filePath;
	} catch (error: any) {
		console.error('Error uploading file to GCS:', error.message);
		throw error;
	}
}

export async function uploadDataToGCS(
	node: DGNodeInterface<GCSBaseData>,
	data: GCSBaseData,
	slug: string,
	fileName: string
) {
	try {
		if (!node) {
			throw new Error('Node not provided');
		}
		const storage = getStorage();
		const userId = getAuth().currentUser?.uid;
		const filePath = `uploads/${userId}/${slug}/${fileName}`;
		const fileRef = storageRef(storage, filePath);

		let blob;
		if (typeof data === 'object' && data !== null) {
			const jsonData = JSON.stringify(data);
			blob = new Blob([jsonData], { type: 'application/json' });
		} else if (typeof data === 'string') {
			blob = new Blob([data], { type: 'text/plain' });
		} else {
			throw new Error('Unsupported data type');
		}

		await uploadBytes(fileRef, blob);

		node.data.gcs_path = filePath;
		return filePath;
	} catch (error) {
		console.error('Error uploading file to GCS:', error.message);
		throw error;
	}
}

export async function uploadFileToGCS(
	node: DGNodeInterface<GCSBaseData>,
	data: GCSBaseData,
	slug: string
) {
	try {
		if (!node) {
			throw new Error('Node not provided');
		}
		const storage = getStorage();
		const userId = getAuth().currentUser?.uid;
		const filePath = `uploads/${userId}/${slug}/${node.id}.json`;
		const fileRef = storageRef(storage, filePath);
		const jsonData = JSON.stringify(data, null, 2);
		const blob = new Blob([jsonData], { type: 'application/json' });
		await uploadBytes(fileRef, blob);
		node.data.gcs_path = filePath;
		return filePath;
	} catch (error: any) {
		console.error('Error uploading file to GCS:', error.message);
		throw error;
	}
}

export async function readFileFromGCS(node: DGNodeInterface<GCSBaseData>) {
	try {
		if (!node || !node.data.gcs_path) {
			throw new Error('Node or GCS path not provided');
		}
		const storage = getStorage();
		const fileRef = storageRef(storage, node.data.gcs_path);
		const downloadURL = await getDownloadURL(fileRef);
		const response = await fetch(downloadURL);
		if (!response.ok) {
			throw new Error('Failed to fetch file from GCS');
		}
		const fileContent = await response.text();
		return fileContent;
	} catch (error: any) {
		console.error('Error reading file from GCS:', error.message);
		throw error;
	}
}

export function topologicalSort(nodes: [DGNodeInterface], edges: [DGEdgeInterface]) {
	let sorted: DGNodeInterface[] = [];
	let visited: Record<string, boolean> = {};
	let graph = _.mapValues(_.keyBy(nodes, 'id'), (node: DGNodeInterface) => ({ node, edges: [] }));

	_.each(edges, (edge: DGEdgeInterface) => {
		if (graph[edge.source]) {
			graph[edge.source].edges.push(edge.target);
		}
	});

	_.each(nodes, (node: DGNodeInterface) => {
		(function visit(nodeId) {
			if (visited[nodeId]) return;
			visited[nodeId] = true;
			_.each(graph[nodeId].edges, visit);
			sorted.push(graph[nodeId].node);
		})(node.id);
	});

	return _.reverse(sorted);
}
