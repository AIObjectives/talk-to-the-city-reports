import type { Node } from '@xyflow/svelte';
import { getAuth } from 'firebase/auth';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';

export class DGNode {
	node: Node;
	parent: any; // graph

	constructor(node: Node, parent: any) {
		this.node = node;
		this.parent = parent;
	}

	get hasAllInputs() {
		if (!this.node || !this.node.data) return false;
		return Object.keys(this.node.data.input_ids).every((id) => {
			const input_id = this.node.data.input_ids[id];
			const input_node = this.parent.find(input_id);
			return input_node != null;
		});
	}

	deleteAssets = () => {
		if (this.node.data.gcs_path) {
			const auth = getAuth();
			const userId = auth.currentUser.uid;
			const slug = this.parent.parent.slug;
			const pathPrefix = `uploads/${userId}/${slug}`;
			if (this.node.data.gcs_path.includes(pathPrefix)) {
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
		}
	};
}
