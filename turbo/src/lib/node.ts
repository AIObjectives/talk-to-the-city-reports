import _ from 'lodash';
import { getAuth } from 'firebase/auth';
import nodesRegister from '$lib/node_register';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';
import { readFileFromGCS, uploadDataToGCS } from '$lib/utils';
import { info } from '$components/toast/theme';
import type { DGNodeInterface, GCSBaseData } from '$lib/node_data_types';

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

  copyAssets = async (sourceSlug: string, targetSlug: string) => {
    if (this.node.data.compute_type == 'feedback_v0') {
      const node = nodesRegister.init(this.node.data.compute_type, this.node);
      await node.copyFeedbackToNewSlug(sourceSlug, targetSlug);
    }

    const auth = getAuth();
    const pathPrefix = `uploads/${auth.currentUser!.uid}/${this.parent.parent.slug}/`;
    const node_data: GCSBaseData = this.node.data as GCSBaseData;

    const copySingleAsset = async (gcsPath) => {
      try {
        info(`Copying file ${gcsPath} to ${pathPrefix}`);
        const data = await readFileFromGCS(this.node, false, gcsPath);
        const fileName = gcsPath.split('/').pop();
        const filePath = await uploadDataToGCS(this.node, data, this.parent.parent.slug, fileName);
        return filePath;
      } catch (error) {
        console.error('Error copying file:', error);
      }
    };

    if (node_data.gcs_path && !node_data.gcs_path.includes(pathPrefix)) {
      const filePath = await copySingleAsset(node_data.gcs_path);
      if (filePath) {
        this.node.data.gcs_path = filePath;
      }
    }

    if (
      node_data.gcs_paths &&
      typeof node_data.gcs_paths === 'object' &&
      !Array.isArray(node_data.gcs_paths)
    ) {
      for (const key of Object.keys(node_data.gcs_paths)) {
        const singlePath = node_data.gcs_paths[key];
        if (!singlePath.includes(pathPrefix)) {
          const newFilePath = await copySingleAsset(singlePath);
          if (newFilePath) {
            node_data.gcs_paths[key] = newFilePath;
          }
        }
      }
    }

    if (node_data.prompts && Array.isArray(node_data.prompts)) {
      for (const prompt of node_data.prompts) {
        const singlePath = prompt.gcs_path;
        if (!singlePath.includes(pathPrefix)) {
          const newFilePath = await copySingleAsset(singlePath);
          if (newFilePath) {
            prompt.gcs_path = newFilePath;
          }
        }
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
