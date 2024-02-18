import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import _ from 'lodash';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';

export default class MarkdownNode {
  id: string;
  data: MarkdownData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: MarkdownNodeInterface) {
    const { id, data, position, type } = node_data;
    this.id = id;
    this.data = data;
    this.position = position;
    this.type = type;
  }

  codeWrapper(code: string) {
    return `\`\`\`\n${code}\n\`\`\``;
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
        inputs.push(_.isString(val) ? val : this.codeWrapper(JSON.stringify(val, null, 2)));
      });
      this.data.markdown = inputs.join('\n\n');
    }
    this.data.output = this.data.markdown;
    return this.data.markdown;
  }
}

interface MarkdownData extends BaseData {
  output: object;
  markdown: string;
}

type MarkdownNodeInterface = DGNodeInterface & {
  data: MarkdownData;
};

export const markdown_node_data: MarkdownNodeInterface = {
  id: 'markdown',
  data: {
    label: 'markdown',
    output: '',
    markdown: '',
    dirty: false,
    compute_type: 'markdown_v0',
    input_ids: { markdown: '' },
    category: categories.display.id,
    icon: 'markdown_v0',
    show_in_ui: true
  },
  position: { x: 0, y: 0 },
  type: 'markdown_v0'
};

export const markdown_node = new MarkdownNode(markdown_node_data);

nodes.register(MarkdownNode, markdown_node_data);
