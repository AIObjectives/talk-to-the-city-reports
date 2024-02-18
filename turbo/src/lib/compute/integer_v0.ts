import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import type { BaseData, DGNodeInterface } from '$lib/node_data_types';

export default class IntegerNode {
  id: string;
  data: IntegerData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: IntegerNodeInterface) {
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
    return this.data.value;
  }
}

interface IntegerData extends BaseData {
  output: Record<string, any>;
  value: number;
}

type IntegerNodeInterface = DGNodeInterface & {
  data: IntegerData;
};

export const integer_node_data: IntegerNodeInterface = {
  id: 'integer_v0',
  data: {
    label: 'integer_v0',
    compute_type: 'integer_v0',
    input_ids: {},
    category: categories.wip.id,
    icon: 'integer_v0',
    show_in_ui: true,
    message: '',
    output: {},
    dirty: false,
    value: 0
  },
  position: { x: 0, y: 0 },
  type: 'default_v0'
};

export const integer_node = new IntegerNode(integer_node_data);

nodes.register(IntegerNode, integer_node_data);
