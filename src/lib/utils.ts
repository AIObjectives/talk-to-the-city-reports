import CryptoJS from 'crypto-js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

export async function uploadDataToGCS(node, data, slug) {
	try {
		if (!node) {
			throw new Error('Node not provided');
		}
		const storage = getStorage();
		const userId = getAuth().currentUser.uid;
		const filePath = `uploads/${userId}/${slug}/${node.id}.json`;
		const fileRef = storageRef(storage, filePath);
		const jsonData = JSON.stringify(data, null, 2);
		const blob = new Blob([jsonData], { type: 'application/json' });
		await uploadBytes(fileRef, blob);
		node.data.gcs_path = filePath;
		return filePath;
	} catch (error) {
		console.error('Error uploading file to GCS:', error.message);
		throw error;
	}
}

export async function readFileFromGCS(node) {
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
	} catch (error) {
		console.error('Error reading file from GCS:', error.message);
		throw error;
	}
}

export function topologicalSort(nodes, edges) {
	let sorted = [];
	let visited = {};
	let graph = {};

	// Initialize the graph
	nodes.forEach((node) => {
		graph[node.id] = { node: node, edges: [] };
		visited[node.id] = false;
	});

	// Map the edges to the graph
	edges.forEach((edge) => {
		if (graph[edge.source]) {
			graph[edge.source].edges.push(edge.target);
		}
	});

	// DFS to sort the graph
	function visit(nodeId) {
		if (visited[nodeId]) return;
		visited[nodeId] = true;

		graph[nodeId].edges.forEach((neighbor) => visit(neighbor));

		// Push the actual node instead of node ID
		sorted.push(graph[nodeId].node);
	}

	nodes.forEach((node) => visit(node.id));

	return sorted.reverse();
}

export function hashString(str) {
	return CryptoJS.SHA256(str).toString();
}

export function hashObject(obj) {
	const str = JSON.stringify(obj);
	return CryptoJS.SHA256(str).toString();
}
