import nodes from '$lib/node_register';
import {
  merge_extraction_v1_system_prompt,
  merge_extraction_prompt_v1,
  merge_extraction_v1_suffix
} from '$lib/prompts';
import categories from '$lib/node_categories';
import type { DGNodeInterface, GCSBaseData } from '$lib/node_data_types';
import GPTNode from '$lib/compute/gpt_v0';

import _ from 'lodash';

export default class MergeClusterExtractionNode {
  id: string;
  data: MergeClusterExtractionData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: MergeClusterExtractionNodeInterface) {
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
    const gpt = new GPTNode(this);
    let text = inputData[this.data.input_ids.csv] || [];
    text = _.cloneDeep(text);

    if (_.isEmpty(text)) return;

    text = {
      topics: _.uniq(_.flatMap(text, (item) => item.topics))
    };
    gpt.data.input_ids.text = this.data.input_ids.csv;
    gpt.data.input_ids.open_ai_key = this.data.input_ids.open_ai_key;
    const input = { ...inputData, [this.data.input_ids.csv]: text };
    const output = await gpt.compute(input, context, info, error, success, slug, Cookies);
    output?.topics?.forEach((topic) => {
      topic.subtopics = _.uniq(topic.subtopics);
    });
    this.data.output = output;
    return output;
  }
}

interface MergeClusterExtractionData extends GCSBaseData {
  output: any;
  prompt: string;
  system_prompt: string;
  prompt_suffix: string;
  input_ids: Record<string, any>;
  text: string;
  ignore_description: boolean;
  text_length: number;
  response_format: Record<string, any>;
}

type MergeClusterExtractionNodeInterface = DGNodeInterface & {
  data: MergeClusterExtractionData;
};

export const merge_cluster_extraction_node_data: MergeClusterExtractionNodeInterface = {
  id: 'merge_cluster_extraction',
  data: {
    label: 'merge_cluster_extraction',
    output: {},
    text: '',
    system_prompt: merge_extraction_v1_system_prompt,
    prompt: merge_extraction_prompt_v1,
    prompt_suffix: merge_extraction_v1_suffix,
    dirty: false,
    compute_type: 'merge_cluster_extraction_v1',
    input_ids: { csv: '', open_ai_key: '' },
    category: categories.wrangling.id,
    icon: 'merge_cluster_extraction_v0',
    show_in_ui: false,
    ignore_description: false,
    message: '',
    filename: '',
    size_kb: 0,
    gcs_path: '',
    text_length: 0,
    response_format: { type: 'json_object' }
  },
  position: { x: 0, y: 0 },
  type: 'merge_cluster_extraction_v1'
};

export const merge_cluster_extraction_node_v1 = new MergeClusterExtractionNode(
  merge_cluster_extraction_node_data
);

nodes.register(MergeClusterExtractionNode, merge_cluster_extraction_node_data);
