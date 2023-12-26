// import type { Node } from '@xyflow/svelte';
import { getAuth } from 'firebase/auth';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';
import { readFileFromGCS, uploadDataToGCS } from '$lib/utils';
import { info } from '$components/toast/theme';
import type { DGNodeInterface, BaseData, GCSBaseData } from '$lib/node_data_types';

export class DGNode {
	node: DGNodeInterface;
	parent: any; // graph

	constructor(node: DGNodeInterface, parent: any) {
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
		const pathPrefix = `uploads/${auth.currentUser!.uid}/${this.parent.parent.slug}/`;
		const node_data: GCSBaseData = this.node.data as GCSBaseData;
		if (node_data.gcs_path && !node_data.gcs_path.includes(pathPrefix)) {
			try {
				info(`Copying file ${node_data.gcs_path} to ${pathPrefix}`);
				const data = await readFileFromGCS(this.node);
				console.log('data');
				console.log(data);
				const fileName = node_data.gcs_path.split('/').pop();
				await uploadDataToGCS(this.node, data, this.parent.parent.slug, fileName);
			} catch (error) {
				console.error('Error copying file:', error);
			}
		}
	};

	deleteAssets = () => {
		if (this.node.data.gcs_path) {
			const auth = getAuth();
			const pathPrefix = `uploads/${auth.currentUser!.uid}/${this.parent.parent.slug}/`;
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
			} else {
				console.log(this.node.data.gcs_path);
				console.log('Not deleting file');
			}
		}
	};
}
