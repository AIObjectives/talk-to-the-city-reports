import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';
import _ from 'lodash';

export default class FilterCSVNode {
  id: string;
  data: FilterCSVData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: FilterCSVNodeInterface) {
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
    if (!this.data.filters) this.data.filters = [];
    this.data.dirty = false;
    const outArray = _.head(_.values(inputData)) || [];
    const inclusiveFiltering = !this.data.exclusive;
    this.data.output = outArray.filter((row: any) => {
      return inclusiveFiltering
        ? this.data.filters.every((filter) => row[filter.column] === filter.value)
        : !this.data.filters.some((filter) => row[filter.column] === filter.value);
    });

    return this.data.output;
  }
}

interface FilterCSVData extends BaseData {
  output: object;
  filters: Record<string, any>[];
  exclusive: boolean;
}

type FilterCSVNodeInterface = DGNodeInterface & {
  data: FilterCSVData;
};

export const filter_csv_node_data: FilterCSVNodeInterface = {
  id: 'filter_csv',
  data: {
    label: 'filter_csv',
    output: {},
    exclusive: true,
    dirty: false,
    compute_type: 'filter_csv_v0',
    input_ids: { data: '' },
    category: categories.wrangling.id,
    icon: 'filter_csv_v0',
    show_in_ui: false,
    message: '',
    filters: []
  },
  position: { x: 0, y: 0 },
  type: 'filter_csv_v0'
};

export const filter_csv_node = new FilterCSVNode(filter_csv_node_data);

nodes.register(FilterCSVNode, filter_csv_node_data);
