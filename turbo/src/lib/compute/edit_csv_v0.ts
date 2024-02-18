import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import deepCopy from 'deep-copy';
import _ from 'lodash';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';

class EditCSVNode {
  id: string;
  data: EditCSVData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: EditCSVNodeInterface) {
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
    const input = deepCopy(inputData[Object.keys(inputData)[0]]);
    if (!input || _.isEmpty(input)) {
      this.data.dirty = false;
      return;
    }

    for (const [key, value] of Object.entries(this.data.generate)) {
      input.forEach((row: { [key: string]: any }, i) => {
        if (value.includes('$i')) {
          row[key] = value.replace('$i', i);
        } else {
          row[key] = value;
        }
      });
    }

    this.data.delete.forEach((column) => {
      input.forEach((row: { [key: string]: any }) => {
        delete row[column];
      });
    });

    for (const [oldKey, newKey] of Object.entries(this.data.rename)) {
      input.forEach((row: { [key: string]: any }) => {
        if (row.hasOwnProperty(oldKey)) {
          row[newKey] = row[oldKey];
          delete row[oldKey];
        }
      });
    }

    this.data.output = input;
    this.data.dirty = false;
    return this.data.output;
  }
}

interface EditCSVData extends BaseData {
  generate: { [key: string]: string };
  delete: string[];
  rename: { [key: string]: string };
  output?: any[];
}

type EditCSVNodeInterface = DGNodeInterface & {
  data: EditCSVData;
};

export const edit_csv_node_data: EditCSVNodeInterface = {
  id: 'edit_csv',
  data: {
    label: 'edit_csv',
    dirty: false,
    generate: {},
    delete: [],
    rename: {},
    compute_type: 'edit_csv_v0',
    input_ids: { csv: '' },
    category: categories.wrangling.id,
    icon: 'edit_csv_v0',
    show_in_ui: false,
    output: [],
    message: ''
  },
  position: { x: 0, y: 0 },
  type: 'edit_csv_v0'
};

export const edit_csv_node = new EditCSVNode(edit_csv_node_data);

export default EditCSVNode;

nodes.register(EditCSVNode, edit_csv_node_data);
