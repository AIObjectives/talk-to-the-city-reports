import nodes from '$lib/node_register';
import categories from '$lib/node_categories';

export default class StringifyNode {
  id: string;
  data: StringifyData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: StringifyNodeInterface) {
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
    this.data.dirty = false;
    const input = inputData[Object.keys(inputData)[0]];

    try {
      return JSON.stringify(input, null, 2);
    } catch {
      return input;
    }
  }
}

interface StringifyData extends BaseData {
  output: object;
}

type StringifyNodeInterface = DGNodeInterface & {
  data: StringifyData;
};

export const stringify_node_data: StringifyNodeInterface = {
  id: 'stringify',
  data: {
    label: 'stringify',
    dirty: false,
    output: {},
    compute_type: 'stringify_v0',
    input_ids: { data: '' },
    category: categories.wrangling.id,
    icon: 'stringify_v0',
    show_in_ui: false
  },
  position: { x: 0, y: 0 },
  type: 'default'
};

export const stringify_node = new StringifyNode(stringify_node_data);

nodes.register(StringifyNode, stringify_node_data);
