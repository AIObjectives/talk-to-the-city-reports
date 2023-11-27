import type { Node } from '@xyflow/svelte';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';

export class DGNode {
	node: Node;

	constructor(node: Node) {
		this.node = node;
	}

	deleteAssets = () => {
		if (this.node.data.gcs_path) {
			const storage = getStorage();
			const fileRef = storageRef(storage, this.node.data.gcs_path);
			deleteObject(fileRef)
				.then(() => {
					console.log('File deleted successfully');
				})
				.catch((error) => {
					console.error('Error deleting file:', error);
				});
		}
	};
}
