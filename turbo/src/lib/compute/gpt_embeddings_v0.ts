import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import type { DGNodeInterface, GCSBaseData } from '$lib/node_data_types';
import { readFileFromGCS, uploadJSONToGCS } from '$lib/utils';
import _ from 'lodash';
import { Dataset } from '$lib/dataset';
import { format, unwrapFunctionStore } from 'svelte-i18n';

const $__ = unwrapFunctionStore(format);

import OpenAI from 'openai';

export default class GPTEmbeddingsNode {
  id: string;
  data: GPTEmbeddingsNodeData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: GPTEmbeddingsNodeInterface) {
    const { id, data, position, type } = node_data;
    this.id = id;
    this.data = data;
    this.position = position;
    this.type = type;
  }

  async createEmbeddings(term, dataset: Dataset) {
    const open_ai_key_node = dataset.graph.findImpl(this.data.input_ids.open_ai_key as string);
    const openai = new OpenAI({
      apiKey: open_ai_key_node.data.output,
      dangerouslyAllowBrowser: true
    });
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: term,
      encoding_format: 'float'
    });
    return embedding;
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
    let data = inputData.data || inputData[this.data.input_ids.data as string];
    let open_ai_key = inputData.open_ai_key || inputData[this.data.input_ids.open_ai_key as string];

    if (!data) {
      this.data.message = $__('no_data');
      return;
    }

    if (_.isPlainObject(data)) {
      data = _.flatMap(data, (item) =>
        _.map(item.claims, (claim) => ({
          claim: claim.claim
        }))
      );
    }

    if (!this.data.dirty && this.data.length == data.length && !_.isEmpty(this.data.output)) {
      return this.data.output;
    }

    if (
      !this.data.dirty &&
      this.data.length == data.length &&
      this.data.gcs_path &&
      this.data.save_to_gcs
    ) {
      let doc;
      try {
        doc = await readFileFromGCS(this);
        let MiBs = (doc.length * 8) / Math.pow(2, 20);
        MiBs = _.round(MiBs, 2);
        info(
          `${$__('loaded_embeddings_from_gcs')}: ${MiBs}MiBs. ${$__(
            'consider_disabling_gcs_for_this_node'
          )}`
        );
      } catch (e) {
        console.log('error', e);
        this.data.gcs_path = '';
        return;
      }
      if (typeof doc === 'string') {
        doc = JSON.parse(doc);
      }
      this.data.message = `${$__('loaded_from_gcs')}.`;
      this.data.dirty = false;
      return { embeddings: doc };
    }

    if (context == 'run') {
      if (!open_ai_key) {
        error($__('missing_open_ai_key'));
        return;
      }
      const openai = new OpenAI({ apiKey: open_ai_key, dangerouslyAllowBrowser: true });
      if (data.length == this.data.length) {
        return this.data.output;
      }
      const embeddings = [];
      for (let i = 0; i < data.length; i++) {
        info(`${$__('computing_embedding')} ${i + 1} / ${data.length}`);
        const claim = data[i]['claim'];
        const embedding = await openai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: claim,
          encoding_format: 'float'
        });
        embeddings.push({ values: embedding.data[0].embedding, id: data[i]['claim'] });
      }
      this.data.length = embeddings.length;
      this.data.message = `${$__('computed_embeddings')}: ${embeddings.length}.`;
      if (this.data.save_to_gcs) await uploadJSONToGCS(this, embeddings, slug);
      return { embeddings: embeddings };
    }
  }
}

interface GPTEmbeddingsNodeData extends GCSBaseData {
  output: any;
  length: number;
}

type GPTEmbeddingsNodeInterface = DGNodeInterface & {
  data: GPTEmbeddingsNodeData;
};

export let gpt_embeddings_node_data: GPTEmbeddingsNodeInterface = {
  id: 'gpt_embeddings',
  data: {
    label: 'gpt_embeddings',
    dirty: false,
    output: {},
    compute_type: 'gpt_embeddings_v0',
    input_ids: { data: '', open_ai_key: '' },
    output_ids: { embeddings: '' },
    category: categories.ml.id,
    icon: 'gpt_embeddings_v0',
    show_in_ui: true,
    message: '',
    length: 0,
    filename: '',
    size_kb: 0,
    gcs_path: '',
    save_to_gcs: true
  },
  position: { x: 0, y: 0 },
  type: 'gpt_embeddings_v0'
};

export let gpt_embeddings_node = new GPTEmbeddingsNode(gpt_embeddings_node_data);

nodes.register(GPTEmbeddingsNode, gpt_embeddings_node_data);
