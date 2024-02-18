import Deepcopy from 'deep-copy';
import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import _ from 'lodash';
import { format, unwrapFunctionStore } from 'svelte-i18n';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';
import GPTNode from '$lib/compute/gpt_v0';
import { gpt_node_data } from '$lib/compute/gpt_v0';
import { gpt_v0_prompt } from '$lib/prompts';

const $__ = unwrapFunctionStore(format);

export default class MultiGPTNode {
  id: string;
  data: MultiGPTData;
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
    const prompts = inputData[this.data.input_ids.prompts];
    if (prompts) {
      // Todo: needs better handling of prompts
      _.forEach(prompts, (prompt, i) => {
        if (this.data.prompts[i]?.prompt != prompt) {
          if (this.data.prompts.length <= Number(i)) {
            this.data.prompts.push({
              prompt: prompt,
              dirty: true
            });
          } else {
            this.data.prompts[i].prompt = prompt;
            this.data.prompts[i].dirty = true;
          }
        }
      });
    }
    this.data.dirty = false;
    const output = [];
    // @ts-ignore
    this.data.prompt = null;
    // @ts-ignore
    this.data.gcs_paths = {};
    _.forEach(this.data.prompts, (prompt, i) => {
      const id = this.id + '_' + i;
      const gpt = new GPTNode(Deepcopy(gpt_node_data));
      gpt.id = id;
      gpt.data.prompt = prompt.prompt;
      gpt.data.dirty = prompt.dirty;
      gpt.data.gcs_path = prompt.gcs_path;
      gpt.data.input_ids.open_ai_key = this.data.input_ids.open_ai_key;
      const promise = gpt
        .compute(inputData, context, info, error, success, slug, Cookies)
        .then((res) => {
          prompt.dirty = false;
          prompt.gcs_path = gpt.data.gcs_path;
          return res;
        });
      output.push(promise);
    });
    const result = await Promise.all(output);
    if (this.data.join_output) {
      if (_.isString(result[0])) {
        this.data.output = result.join(' ');
      }
    } else {
      this.data.output = result;
    }
    return this.data.output;
  }
}

interface MultiGPTData extends BaseData {
  output: any;
  prompts: MultiPromptEntry[];
  system_prompt: string;
  response_format: any;
  join_output: boolean;
}

type MultiGPTNodeInterface = DGNodeInterface & {
  data: MultiGPTData;
};

interface MultiPromptEntry {
  prompt: string;
  dirty: boolean;
  gcs_path?: string;
}

export const multi_gpt_node_data: MultiGPTNodeInterface = {
  id: 'multi_gpt',
  data: {
    label: 'multi_gpt',
    output: {},
    prompts: [
      {
        prompt: gpt_v0_prompt,
        dirty: false
      } as MultiPromptEntry
    ],
    system_prompt: 'You are a helpful assistant.',
    compute_type: 'multi_gpt_v0',
    dirty: false,
    input_ids: { open_ai_key: '', text: '', prompts: '' },
    category: categories.ml.id,
    icon: 'multi_gpt_v0',
    response_format: null,
    show_in_ui: true,
    message: '',
    join_output: false
  },
  position: { x: 0, y: 0 },
  type: 'multi_gpt_v0'
};

export const multi_gpt_node = new MultiGPTNode(multi_gpt_node_data);
nodes.register(MultiGPTNode, multi_gpt_node);
