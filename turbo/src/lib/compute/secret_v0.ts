import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';

export default class SecretNode {
  id: string;
  data: SecretData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data) {
    const { id, data, position, type } = node_data;

    this.id = id;
    this.data = data;
    this.position = position;
    this.type = type;
    if (!this.data.rand_id) {
      this.data.rand_id = Math.random().toString(36).substring(7);
    }
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
      Cookies.set('tttc_secret_' + this.data.rand_id, ui_key);
      this.data.text = '...(key hidden)';
      return ui_key;
    }
    const local_key = Cookies.get('tttc_secret_' + this.data.rand_id);
    if (local_key) {
      this.data.text = '...(key hidden)';
      return local_key;
    }
    return '';
  }
}

interface SecretData extends BaseData {
  text: any;
  rand_id: string;
  prevent_dirty: boolean;
}

type SecretNodeInterface = DGNodeInterface & {
  data: SecretData;
};

export const secret_node_data: SecretNodeInterface = {
  id: '',
  data: {
    label: 'secret',
    text: '',
    dirty: false,
    compute_type: 'secret_v0',
    input_ids: {},
    category: categories.input.id,
    icon: 'secret_v0',
    show_in_ui: true,
    message: '',
    rand_id: '',
    prevent_dirty: true
  },
  position: { x: 0, y: 0 },
  type: 'text_input_v0'
};

export const secret_node = new SecretNode(secret_node_data);

nodes.register(SecretNode, secret_node_data);
