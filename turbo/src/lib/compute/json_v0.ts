import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import { readFileFromGCS } from '$lib/utils';
import type { GCSBaseData, DGNodeInterface } from '$lib/node_data_types';

export interface JSONNodeInterface extends DGNodeInterface<GCSBaseData> {}

class JSONNode implements JSONNodeInterface {
  id: string;
  data: GCSBaseData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: JSONNodeInterface) {
    const { id, data, position, type } = node_data;
    this.id = id;
    this.data = data;
    this.position = position;
    this.type = type;
  }

  async compute(
    inputData: object,
    context: string,
    info: (arg: string) => void,
    error: (arg: string) => void,
    success: (arg: string) => void,
    slug: string,
    Cookies: any
  ) {
    if (!this.data.dirty && this.data.output && this.data.output.length > 0) {
      return this.data.output;
    }

    let contents;
    if (this.data.gcs_path) {
      contents = await readFileFromGCS(this);
      this.data.output = JSON.parse(contents);
    }

    this.data.dirty = false;
    return this.data.output;
  }
}

export default JSONNode;

export const json_node_data: JSONNodeInterface = {
  id: 'json',
  data: {
    label: 'json',
    filename: '',
    size_kb: 0,
    dirty: false,
    gcs_path: '',
    output: [],
    compute_type: 'json_v0',
    input_ids: {},
    category: categories.input.id,
    icon: 'json_v0',
    show_in_ui: true
  },
  position: { x: 0, y: 0 },
  type: 'json_v0'
};

export const json_node = new JSONNode(json_node_data);

nodes.register(JSONNode, json_node_data);
