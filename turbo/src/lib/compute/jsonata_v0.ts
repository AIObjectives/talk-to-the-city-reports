import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import jsonata_lib from 'jsonata';

interface BaseData {}

interface JsonataData extends BaseData {
  text: string;
  output: object;
}

export default class JsonataNode {
  id: string;
  data: JsonataData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data) {
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

    if (this.data.text) {
      try {
        const jsonataExpr = jsonata_lib(this.data.text);
        const result = await jsonataExpr.evaluate(input);
        return result;
      } catch (e) {
        console.error('Error evaluating JSONata expression:', e);
        return undefined;
      }
    }
  }
}

type JsonataNodeInterface = DGNodeInterface & {
  data: JsonataData;
};

export const jsonata_node_data: JsonataNodeInterface = {
  id: 'jsonata',
  data: {
    label: 'jsonata',
    text: '',
    dirty: false,
    output: {},
    compute_type: 'jsonata_v0',
    input_ids: { data: '' },
    category: categories.lang.id,
    icon: 'jsonata_v0',
    show_in_ui: false
  },
  position: { x: 0, y: 0 },
  type: 'text_input_v0'
};

export const jsonata_node = new JsonataNode(jsonata_node_data);

nodes.register(JsonataNode, jsonata_node_data);
