import type { Node } from '@xyflow/svelte';
import { getAuth } from 'firebase/auth';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';
import { readFileFromGCS, uploadDataToGCS } from '$lib/utils';
import { success, error, info } from '$components/toast/theme';

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

	copyAssets = async () => {
		const auth = getAuth();
		const pathPrefix = `uploads/${auth.currentUser.uid}/${this.parent.parent.slug}`;
		if (this.node.data.gcs_path && !this.node.data.gcs_path.includes(pathPrefix)) {
			try {
				info(`Copying file ${this.node.data.gcs_path} to ${pathPrefix}`);
				const data = await readFileFromGCS(this.node);
				await uploadDataToGCS(this.node, data, this.parent.parent.slug);
			} catch (error) {
				console.error('Error copying file:', error);
			}
		}
	};

	deleteAssets = () => {
		if (this.node.data.gcs_path) {
			const auth = getAuth();
			const pathPrefix = `uploads/${auth.currentUser.uid}/${this.parent.parent.slug}`;
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
