import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';
import DeepCopy from 'deep-copy';
import ClusterExtractionNode, {
  cluster_extraction_node_data_v1
} from '$lib/compute/cluster_extraction_v1';
import {
  multi_cluster_extraction_prompt_v0,
  multi_cluster_extraction_v0_suffix
} from '$lib/prompts';
import _ from 'lodash';
import { getEncoding } from 'js-tiktoken';
const encoding = getEncoding('cl100k_base');

export default class MultiClusterExtractionNode {
  id: string;
  data: MultiClusterExtractionData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data) {
    const { id, data, position, type } = node_data;
    this.id = id;
    this.data = data;
    this.position = position;
    this.type = type;
  }

  getChunks(csv) {
    this.data.num_tokens = 0;
    const chunks = [];
    let chunk = [],
      chunkTokens = 0;
    _.forEach(csv, (row) => {
      const lineTokens = encoding.encode(row['comment-body']).length;
      this.data.num_tokens += lineTokens;
      if (chunkTokens + lineTokens > this.data.context_limit) {
        chunks.push(chunk), (chunk = []), (chunkTokens = 0);
      }
      chunk.push(row), (chunkTokens += lineTokens);
    });
    chunk.length && chunks.push(chunk);
    return chunks;
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
    const chunks = this.getChunks(csv);
    if (this.data.num_chunks != chunks.length) {
      this.data.dirty = true;
      this.data.gcs_paths = {};
    }
    this.data.num_chunks = chunks.length;
    const output = [];
    _.forEach(chunks, async (chunk, i) => {
      const cluster_extraction = new ClusterExtractionNode(
        DeepCopy(cluster_extraction_node_data_v1)
      );
      cluster_extraction.id = this.id + '_' + i;
      cluster_extraction.data.dirty = this.data.dirty;
      cluster_extraction.data.input_ids = this.data.input_ids;
      cluster_extraction.data.gcs_path = this.data.gcs_paths[cluster_extraction.id];
      cluster_extraction.data.csv_length = chunk.length;
      cluster_extraction.data.prompt = this.data.prompt;
      cluster_extraction.data.system_prompt = this.data.system_prompt;
      cluster_extraction.data.prompt_suffix = this.data.prompt_suffix;
      const promise = cluster_extraction
        .compute({ ...inputData, csv: chunk }, context, info, error, success, slug, Cookies)
        .then((res) => {
          this.data.dirty = false;
          this.data.gcs_paths[cluster_extraction.id] = cluster_extraction.data.gcs_path;
          return res;
        });
      output.push(promise);
    });
    const result = await Promise.all(output);
    this.data.output = result;
    this.data.dirty = false;
    return this.data.output;
  }
}

interface MultiClusterExtractionData extends BaseData {
  output: any;
  text: string;
  system_prompt: string;
  prompt: string;
  prompt_suffix: string;
  csv_length: number;
  context_limit: number;
  gcs_paths: Record<string, string>;
  num_tokens: number;
  num_chunks: number;
}

type MultiClusterExtractionNodeInterface = DGNodeInterface & {
  data: MultiClusterExtractionData;
};

export const multi_cluster_extraction_node_data: MultiClusterExtractionNodeInterface = {
  id: 'multi_cluster_extraction',
  data: {
    label: 'multi_cluster_extraction',
    output: {},
    text: '',
    csv_length: 0,
    system_prompt: '',
    prompt: multi_cluster_extraction_prompt_v0,
    prompt_suffix: multi_cluster_extraction_v0_suffix,
    dirty: false,
    compute_type: 'multi_cluster_extraction_v0',
    input_ids: { open_ai_key: '', csv: '' },
    category: categories.ml.id,
    icon: 'multi_cluster_extraction_v0',
    show_in_ui: true,
    message: '',
    context_limit: 10000,
    gcs_paths: {},
    num_tokens: 0,
    num_chunks: 0
  },
  position: { x: 0, y: 0 },
  type: 'multi_cluster_extraction_v0'
};

export const multi_cluster_extraction_node = new MultiClusterExtractionNode(
  multi_cluster_extraction_node_data
);

nodes.register(MultiClusterExtractionNode, multi_cluster_extraction_node_data);
