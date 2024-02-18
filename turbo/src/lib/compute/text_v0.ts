import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import _ from 'lodash';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';

export default class TextNode {
  id: string;
  data: MarkdownData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: TextNodeInterface) {
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
  ): Promise<string> {
    this.data.dirty = false;
    const inputs: string[] = [];
    if (!_.isEmpty(inputData)) {
      _.forEach(_.values(inputData), (val) => {
        inputs.push(_.isString(val) ? val : JSON.stringify(val, null, 2));
      });
      this.data.text = inputs.join('\n\n');
    }
    this.data.output = this.data.text;
    return this.data.text;
  }
}

interface MarkdownData extends BaseData {
  output: object;
  text: string;
}

type TextNodeInterface = DGNodeInterface & {
  data: MarkdownData;
};

export const text_node_data: TextNodeInterface = {
  id: 'text',
  data: {
    label: 'text',
    output: '',
    text: '',
    dirty: false,
    compute_type: 'text_v0',
    input_ids: {},
    category: categories.wip.id,
    icon: 'text_v0',
    show_in_ui: true,
    message: ''
  },
  position: { x: 0, y: 0 },
  type: 'text_v0'
};

export const text_node = new TextNode(text_node_data);

nodes.register(TextNode, text_node_data);
