import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import type { BaseData, DGNodeInterface } from '$lib/node_data_types';

export default class AdderNode {
  id: string;
  data: AdderData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: AdderNodeInterface) {
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
    const a = inputData['a'] || inputData[this.data.input_ids.a];
    const b = inputData['b'] || inputData[this.data.input_ids.b];
    return a + b;
  }
}

interface AdderData extends BaseData {
  output: Record<string, any>;
  value: number;
}

type AdderNodeInterface = DGNodeInterface & {
  data: AdderData;
};

export const adder_node_data: AdderNodeInterface = {
  id: 'adder_v0',
  data: {
    label: 'adder_v0',
    compute_type: 'adder_v0',
    input_ids: { a: '', b: '' },
    category: categories.wip.id,
    icon: 'adder_v0',
    show_in_ui: true,
    message: '',
    output: {},
    dirty: false,
    value: 0
  },
  position: { x: 0, y: 0 },
  type: 'default_v0'
};

export const adder_node = new AdderNode(adder_node_data);

nodes.register(AdderNode, adder_node_data);
