import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';
import _ from 'lodash';

export default class UniqueNode {
  id: string;
  data: UniqueData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: UniqueNodeInterface) {
    const { id, data, position, type } = node_data;
    this.id = id;
    this.data = data;
    this.position = position;
    this.type = type;
  }

  async compute(
    inputData: Record<string, any>,
    context: string,
    info: (arg: string) => void,
    error: (arg: string) => void,
    success: (arg: string) => void,
    slug: string,
    Cookies: any
  ) {
    this.data.dirty = false;
    if (!this.data.text) return;
    const input = _.head(_.values(inputData));
    this.data.output = _.uniqBy(input, this.data.text);
    this.data.output = this.data.output.map((x) => x[this.data.text]);
    return this.data.output;
  }
}

interface UniqueData extends BaseData {
  output: Record<string, any>[];
  text: string;
}

type UniqueNodeInterface = DGNodeInterface & {
  data: UniqueData;
};

export const unique_node_data: UniqueNodeInterface = {
  id: 'unique',
  data: {
    label: 'unique',
    output: [],
    dirty: false,
    compute_type: 'unique_v0',
    input_ids: { data: '' },
    category: categories.wrangling.id,
    icon: 'unique_v0',
    show_in_ui: false,
    message: '',
    text: ''
  },
  position: { x: 0, y: 0 },
  type: 'unique_v0'
};

export const unique_node = new UniqueNode(unique_node_data);

nodes.register(UniqueNode, unique_node_data);
