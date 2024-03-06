import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';

export default class PineconeKeyNode {
  id: string;
  data: PineconeKeyData;
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
    const ui_key = this.data.text;
    if (ui_key && ui_key != '...(key hidden)') {
      Cookies.set('tttc_pinecone_key_' + this.id, ui_key);
      this.data.text = '...(key hidden)';
      return ui_key;
    }
    const local_key = Cookies.get('tttc_pinecone_key_' + this.id);
    if (local_key) {
      this.data.text = '...(key hidden)';
      return local_key;
    }
    return '';
  }
}

interface PineconeKeyData extends BaseData {
  text: any;
  prevent_dirty: boolean;
}

type PineconeKeyNodeInterface = DGNodeInterface & {
  data: PineconeKeyData;
};

export const pinecone_key_node_data: PineconeKeyNodeInterface = {
  id: 'pinecone_key',
  data: {
    label: 'pinecone_key',
    text: '',
    dirty: false,
    compute_type: 'pinecone_key_v0',
    input_ids: {},
    category: categories.input.id,
    icon: 'pinecone_key_v0',
    show_in_ui: true,
    message: '',
    prevent_dirty: true
  },
  position: { x: 0, y: 0 },
  type: 'text_input_v0'
};

export const pinecone_key_node = new PineconeKeyNode(pinecone_key_node_data);

nodes.register(PineconeKeyNode, pinecone_key_node_data);
