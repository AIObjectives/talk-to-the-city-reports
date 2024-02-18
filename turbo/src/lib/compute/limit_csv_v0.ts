import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import _ from 'lodash';
import { format, unwrapFunctionStore } from 'svelte-i18n';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';
const $__ = unwrapFunctionStore(format);

export default class LimitCSVNode {
  id: string;
  data: LimitCSVData;
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
    inputData: Record<string, any>,
    context: string,
    info: (arg: string) => void,
    error: (arg: string) => void,
    success: (arg: string) => void,
    slug: string,
    Cookies: any
  ) {
    const input: [] = _.head(_.values(inputData));
    this.data.dirty = false;
    this.data.message = '';
    if (_.isEmpty(input)) {
      this.data.message = $__('missing_input_data');
      this.data.output = [];
      return this.data.output;
    }
    const number: number = _.isNumber(this.data.number)
      ? this.data.number
      : parseInt(this.data.number);

    if (_.isNaN(number)) {
      this.data.output = input;
    } else if (_.isNumber(number))
      if (_.isPlainObject(input)) {
        this.data.output = _.pick(input, _.keys(input).slice(0, number));
      } else if (_.isArray(input)) {
        this.data.output = input.slice(0, number);
      } else {
        this.data.output = [];
      }
    return this.data.output;
  }
}

interface LimitCSVData extends BaseData {
  number: string;
}

type LimitCSVNodeInterface = DGNodeInterface & {
  data: LimitCSVData;
};

export const limit_csv_node_data: LimitCSVNodeInterface = {
  id: 'limit_csv',
  data: {
    label: 'limit_csv',
    dirty: false,
    number: '',
    message: '',
    compute_type: 'limit_csv_v0',
    input_ids: { csv: '' },
    category: categories.wrangling.id,
    icon: 'limit_csv_v0',
    show_in_ui: true
  },
  position: { x: 0, y: 0 },
  type: 'number_input_v0'
};

export const limit_csv_node = new LimitCSVNode(limit_csv_node_data);

nodes.register(LimitCSVNode, limit_csv_node_data);
