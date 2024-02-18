import { browser } from '$app/environment';
import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import * as jq_web from 'jq-web/jq.asm.bundle.js';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';

import _ from 'lodash';

export default class JqNodeV1 {
  id: string;
  data: JqData;
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
    this.data.message = '';
    this.data.dirty = false;
    const input = _.head(_.values(inputData));
    try {
      if (this.data.text && (_.isPlainObject(input) || _.isArray(input))) {
        if (browser) {
          this.data.output = jq_web.json(input, this.data.text);
          return this.data.output;
        } else {
          const jqModule = await import('node-jq');
          const jq = jqModule.default;
          const res: any = await jq.run(this.data.text, input, {
            input: 'json',
            output: 'json'
          });
          try {
            this.data.output = JSON.parse(res);
            return this.data.output;
          } catch (e) {
            try {
              this.data.output = res.split('\n').map(JSON.parse);
              return this.data.output;
            } catch (e) {
              this.data.output = res;
              return this.data.output;
            }
          }
        }
      }
    } catch (e) {
      console.log(e);
      console.error(e.toString());
      this.data.message = e.toString();
      return undefined;
    }
  }
}

interface JqData extends BaseData {
  text: string;
  output: any;
}

type JqNodeInterface = DGNodeInterface & {
  data: JqData;
};

export const jq_node_data: JqNodeInterface = {
  id: 'jq_v1',
  data: {
    label: 'jq',
    text: '',
    dirty: false,
    output: {},
    compute_type: 'jq_v1',
    input_ids: { data: '' },
    category: categories.lang.id,
    icon: 'jq_v0',
    show_in_ui: false,
    message: ''
  },
  position: { x: 0, y: 0 },
  type: 'jq_v1'
};

export const jq_v1_node = new JqNodeV1(jq_node_data);

nodes.register(JqNodeV1, jq_node_data);
