import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';
import _ from 'lodash';

export default class AddCSVNode {
  id: string;
  data: AddCSVData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: AddCSVNodeInterface) {
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
  ) {
    this.data.dirty = false;
    let outArray = [];
    _.forEach(_.values(inputData), (x) => {
      outArray = outArray.concat(x);
    });
    if (this.data.commentId) {
      _.forEach(outArray, (x, i) => {
        x['comment-id'] = this.data.commentId.replace('$i', i.toString());
      });
    }
    this.data.output = outArray;
    return this.data.output;
  }
}

interface AddCSVData extends BaseData {
  output: object;
  commentId: string;
}

type AddCSVNodeInterface = DGNodeInterface & {
  data: AddCSVData;
};

export const add_csv_node_data: AddCSVNodeInterface = {
  id: 'add_csv',
  data: {
    label: 'add_csv',
    output: {},
    dirty: false,
    compute_type: 'add_csv_v0',
    input_ids: { data: [] },
    category: categories.wrangling.id,
    icon: 'add_csv_v0',
    show_in_ui: false,
    message: '',
    commentId: ''
  },
  position: { x: 0, y: 0 },
  type: 'add_csv_v0'
};

export const add_csv_node = new AddCSVNode(add_csv_node_data);

nodes.register(AddCSVNode, add_csv_node_data);
