import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import { readFileFromGCS, uploadJSONToGCS } from '$lib/utils';
import { cluster_extraction_prompt_v0, cluster_extraction_system_prompt } from '$lib/prompts';
import { format, unwrapFunctionStore } from 'svelte-i18n';
import type { DGNodeInterface, GCSBaseData } from '$lib/node_data_types';
import gpt from '$lib/gpt';
import _ from 'lodash';

const $__ = unwrapFunctionStore(format);

export default class ClusterExtractionNode {
  id: string;
  data: ClusterExtractionData;
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
    const csv = inputData.csv || inputData[this.data.input_ids.csv];
    const open_ai_key = inputData.open_ai_key || inputData[this.data.input_ids.open_ai_key];

    if (!csv || csv.length == 0 || !(this.data.prompt || this.data.system_prompt)) {
      this.data.message = `${$__('missing_input_data')}`;
      this.data.dirty = false;
      return;
    }

    if (!this.data.dirty && this.data.csv_length == csv.length && this.data.gcs_path) {
      let doc: any = await readFileFromGCS(this);
      if (typeof doc === 'string') {
        doc = JSON.parse(doc);
      }
      this.data.output = doc;
      this.data.message = `${$__('loaded_from_gcs')}. ${$__('topics')}: ${
        doc?.topics?.length
      } ${$__('subtopics')}: ${_.sumBy(doc?.topics, (topic: any) => topic?.subtopics?.length)}.`;
      this.data.dirty = false;
      return this.data.output;
    }

    if (context == 'run' && open_ai_key && csv && csv.length > 0) {
      info(`${$__('computing')} ${$__(this.data.label)}`);
      this.data.csv_length = csv.length;
      const { prompt, system_prompt } = this.data;
      let i = 0;
      const interval = setInterval(() => {
        this.data.message = `${$__('computing')} ${$__(this.data.label)} ${'.'.repeat(i % 4)}`;
        info(this.data.message);
        i++;
      }, 5000);
      const todo = new Set(_.range(0, csv.length));
      const result = await gpt(
        open_ai_key,
        {
          comments: csv.map((x: any) => x['comment-body']).join('\n')
        },
        prompt,
        system_prompt,
        info,
        error,
        success,
        0,
        1,
        todo
      );
      clearInterval(interval);
      this.data.output = JSON.parse(result);
      await uploadJSONToGCS(this, this.data.output, slug);
      this.data.dirty = false;
      this.data.message = `${$__('topics')}: ${this.data.output?.topics?.length} ${$__(
        'subtopics'
      )}: ${_.sumBy(this.data.output?.topics, (topic: any) => topic?.subtopics?.length)}.`;
      success(this.data.message);
      return this.data.output;
    } else {
      this.data.message = `${$__('missing_input_data')}`;
      this.data.dirty = false;
      return;
    }
  }
}

interface ClusterExtractionData extends GCSBaseData {
  output: any;
  text: string;
  system_prompt: string;
  prompt: string;
  csv_length: number;
}

type ClusterExtractionNodeInterface = DGNodeInterface & {
  data: ClusterExtractionData;
};

export const cluster_extraction_node_data_v0: ClusterExtractionNodeInterface = {
  id: 'cluster_extraction',
  data: {
    label: 'cluster_extraction',
    output: {},
    text: '',
    system_prompt: cluster_extraction_system_prompt,
    prompt: cluster_extraction_prompt_v0,
    csv_length: 0,
    dirty: false,
    compute_type: 'cluster_extraction_v0',
    input_ids: { open_ai_key: '', csv: '' },
    category: categories.ml.id,
    icon: 'cluster_extraction_v0',
    show_in_ui: true,
    message: '',
    filename: '',
    size_kb: 0,
    gcs_path: ''
  },
  position: { x: 0, y: 0 },
  type: 'prompt_v0'
};

export const cluster_extraction_node_v0 = new ClusterExtractionNode(
  cluster_extraction_node_data_v0
);

nodes.register(ClusterExtractionNode, cluster_extraction_node_data_v0);
