import _ from 'lodash';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, type User } from 'firebase/auth';
import type { DGNodeInterface, GCSBaseData, DGEdgeInterface } from '$lib/node_data_types';

export async function uploadJSONToGCS(
	node: DGNodeInterface<GCSBaseData>,
	data: GCSBaseData,
	slug: string
): Promise<string> {
	try {
		if (!node) {
			throw new Error('Node not provided');
		}
		const storage = getStorage();
		const auth = getAuth();
		const user: User | null = auth.currentUser;
		const userId: string | undefined = user?.uid;
		if (!userId) {
			throw new Error('User not authenticated');
		}
		const filePath: string = `uploads/${userId}/${slug}/${node.id}.json`;
		const fileRef = storageRef(storage, filePath);
		const jsonData: string = JSON.stringify(data, null, 2);
		const blob: Blob = new Blob([jsonData], { type: 'application/json' });
		await uploadBytes(fileRef, blob);
		node.data.gcs_path = filePath;
		return filePath;
	} catch (error: unknown) {
		console.error('Error uploading file to GCS:', (error as Error).message);
		throw error;
	}
}

export async function uploadDataToGCS(
	node: DGNodeInterface<GCSBaseData>,
	data: GCSBaseData,
	slug: string,
	fileName: string
): Promise<string> {
	try {
		if (!node) {
			throw new Error('Node not provided');
		}
		const storage = getStorage();
		const auth = getAuth();
		const user: User | null = auth.currentUser;
		const userId: string | undefined = user?.uid;
		if (!userId) {
			throw new Error('User not authenticated');
		}
		const filePath: string = `uploads/${userId}/${slug}/${fileName}`;
		const fileRef = storageRef(storage, filePath);

		let blob: Blob;
		if (typeof data === 'object' && data !== null) {
			const jsonData: string = JSON.stringify(data);
			blob = new Blob([jsonData], { type: 'application/json' });
		} else if (typeof data === 'string') {
			blob = new Blob([data], { type: 'text/plain' });
		} else {
			throw new Error('Unsupported data type');
		}

		await uploadBytes(fileRef, blob);

		node.data.gcs_path = filePath;
		return filePath;
	} catch (error: unknown) {
		console.error('Error uploading file to GCS:', (error as Error).message);
		throw error;
	}
}

export async function readFileFromGCS(node: DGNodeInterface<GCSBaseData>): Promise<string> {
	try {
		if (!node || !node.data.gcs_path) {
			throw new Error('Node or GCS path not provided');
		}
		const storage = getStorage();
		const fileRef = storageRef(storage, node.data.gcs_path);
		const downloadURL: string = await getDownloadURL(fileRef);
		const response: Response = await fetch(downloadURL);
		if (!response.ok) {
			throw new Error('Failed to fetch file from GCS');
		}
		const fileContent: string = await response.text();
		return fileContent;
	} catch (error: unknown) {
		console.error('Error reading file from GCS:', (error as Error).message);
		throw error;
	}
}

export function topologicalSort(
	nodes: Array<DGNodeInterface<any>>,
	edges: Array<DGEdgeInterface>
): Array<DGNodeInterface<any>> {
	let sorted: Array<DGNodeInterface<any>> = [];
	let visited: Record<string, boolean> = {};
	interface GraphNode {
		node: DGNodeInterface<any>;
		edges: string[];
	}
	let graph: Record<string, GraphNode> = _.mapValues(
		_.keyBy(nodes, 'id'),
		(node: DGNodeInterface<any>) => ({
			node,
			edges: []
		})
	);

	edges.forEach((edge: DGEdgeInterface) => {
		if (graph[edge.source]) {
			graph[edge.source].edges.push(edge.target);
		}
	});

	nodes.forEach((node: DGNodeInterface<any>) => {
		(function visit(nodeId: string): void {
			if (visited[nodeId]) return;
			visited[nodeId] = true;
			graph[nodeId].edges.forEach(visit);
			sorted.push(graph[nodeId].node);
		})(node.id);
	});

	return _.reverse(sorted);
}
