import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';
import _ from 'lodash';

export default class GridNode {
  id: string;
  data: GridData;
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
    if (!inputData) {
      return;
    }
    this.data.dirty = false;
    const input = inputData[Object.keys(inputData)[0]];
    this.data.output = input;
    this.data = {
      ...this.data,
      output: this.data.output
    };
    return this.data.output;
  }
}

interface GridData extends BaseData {
  text: string;
  output: object;
  width: number;
  height: number;
}

type GridNodeInterface = DGNodeInterface & {
  data: GridData;
};

export const grid_node_data: GridNodeInterface = {
  id: 'grid',
  data: {
    label: 'grid',
    text: '',
    dirty: false,
    output: {},
    compute_type: 'grid_v0',
    input_ids: { data: [] },
    category: categories.display.id,
    icon: 'grid_v0',
    width: 700,
    height: 500,
    show_in_ui: false,
    message: ''
  },
  position: { x: 0, y: 0 },
  type: 'grid_v0'
};

export const grid_node = new GridNode(grid_node_data);

nodes.register(GridNode, grid_node_data);
