import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';

interface LlamaData extends BaseData {
  text: string;
}

export default class LlamaNode {
  id: string;
  data: LlamaData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: LlamaNodeInterface) {
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
    this.data.message = 'fetching..';
    this.data.dirty = false;
    try {
      const response = await fetch('http://localhost:10000/v1/chat/completions');
      if (response.ok) {
        this.data.message = 'online';
        return this.data.text;
      } else {
        error('Request failed');
      }
    } catch (err) {
      this.data.message = 'offline';
    }
  }
}

type LlamaNodeInterface = DGNodeInterface & {
  data: LlamaData;
};

export const llama_node_data: LlamaNodeInterface = {
  id: 'llama',
  data: {
    label: 'llama',
    text: 'http://localhost:10000/v1/chat/completions',
    dirty: false,
    compute_type: 'llama_v0',
    input_ids: {},
    category: categories.ml.id,
    icon: 'llama_v0',
    show_in_ui: true,
    message: ''
  },
  position: { x: 0, y: 0 },
  type: 'text_input_v0'
};

export const llama_node = new LlamaNode(llama_node_data);

nodes.register(LlamaNode, llama_node_data);
