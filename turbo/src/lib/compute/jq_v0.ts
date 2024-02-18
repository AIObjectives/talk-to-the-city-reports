import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import jq_lib from '$lib/jq.js';

export default class JqNodeV0 {
  id: string;
  data: JqDataV0;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: JqNodeV0Interface) {
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
        const jqFilter = jq_lib.compile(this.data.text);
        const result = [];
        for (const v of jqFilter(input)) {
          result.push(v);
        }
        if (result.length === 1) {
          return result[0];
        }
        return result;
      } catch (e) {
        console.error('Error evaluating JQ expression:', e);
        return undefined;
      }
    }
  }
}

interface JqDataV0 extends BaseData {
  text: string;
  output: object;
}

type JqNodeV0Interface = DGNodeInterface & {
  data: JqDataV0;
};

export const jq_v0_node_data: JqNodeV0Interface = {
  id: 'jq_v0',
  data: {
    label: 'jq',
    text: '',
    dirty: false,
    output: {},
    compute_type: 'jq_v0',
    input_ids: { data: '' },
    category: categories.wrangling.id,
    icon: 'jq_v0',
    show_in_ui: false
  },
  position: { x: 0, y: 0 },
  type: 'text_input_v0'
};

export const jq_v0_node = new JqNodeV0(jq_v0_node_data);

nodes.register(JqNodeV0, jq_v0_node_data);
