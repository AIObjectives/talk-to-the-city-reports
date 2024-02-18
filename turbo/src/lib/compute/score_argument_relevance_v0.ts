import nodes from '$lib/node_register';
import { readFileFromGCS, uploadJSONToGCS } from '$lib/utils';
import { cluster_extraction_system_prompt, score_claim_relevance_prompt } from '$lib/prompts';
import deepCopy from 'deep-copy';
import categories from '$lib/node_categories';
import gpt from '$lib/gpt';
import _ from 'lodash';
import { format, unwrapFunctionStore } from 'svelte-i18n';

const $__ = unwrapFunctionStore(format);

export default class ScoreArgumentRelevanceNode {
  id: string;
  data: ScoreArgumentRelevanceData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: ScoreArgumentRelevanceNodeInterface) {
    const { id, data, position, type } = node_data;
    this.id = id;
    this.data = data;
    this.position = position;
    this.type = type;
  }

  averageScore() {
    const keys = _.keys(this.data.output);
    const scores = [];
    for (let i = 0; i < keys.length; i++) {
      const claims = this.data.output[keys[i]].claims;
      for (let j = 0; j < claims.length; j++) {
        scores.push(claims[j].score);
      }
    }
    return _.mean(scores);
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
    const { prompt, system_prompt } = this.data;
    const argument_extraction =
      inputData.argument_extraction || inputData[this.data.input_ids.argument_extraction];
    const open_ai_key = inputData.open_ai_key || inputData[this.data.input_ids.open_ai_key];

    if (!argument_extraction || Object.values(argument_extraction).length == 0) {
      this.data.dirty = false;
      return;
    }

    if (
      !this.data.dirty &&
      this.data.csv_length == Object.values(argument_extraction).length &&
      this.data.gcs_path
    ) {
      let doc = await readFileFromGCS(this);
      if (typeof doc === 'string') {
        doc = JSON.parse(doc);
      }
      const numClaims = _.sumBy(_.values(doc), (value) => value.claims.length);
      this.data.output = doc;
      const mean = this.averageScore();
      this.data.message = `${$__('loaded_from_gcs')}. ${$__('claims')}: ${numClaims}. ${$__(
        'mean_score'
      )}: ${mean.toFixed(2)}`;
      this.data.dirty = false;
      return this.data.output;
    }

    if (context == 'run' && open_ai_key && (prompt || system_prompt)) {
      const copy = deepCopy(argument_extraction);
      const keys = _.keys(copy);

      const numClaims = _.sumBy(keys, (key) => _.get(copy[key], 'claims', []).length);

      const todo = new Set(_.range(0, numClaims));
      const gptPromises = [];

      let k = 0;
      for (let i = 0; i < keys.length; i++) {
        const claims = copy[keys[i]].claims;
        for (let j = 0; j < claims.length; j++) {
          const claim = claims[j];
          const score_claim = async () => {
            const response = await gpt(
              open_ai_key,
              { claim: JSON.stringify(claim, null, 2) },
              prompt,
              system_prompt,
              info,
              error,
              success,
              k,
              numClaims,
              todo
            );
            const res = JSON.parse(response);
            claim.score = res.score;
            claim.explanation = res.explanation;
          };
          k += 1;
          gptPromises.push(score_claim());
        }
      }
      await Promise.all(gptPromises);
      this.data.output = copy;
      this.data.csv_length = Object.keys(copy).length;
      this.data.dirty = false;
      await uploadJSONToGCS(this, this.data.output, slug);
      return this.data.output;
    }
  }
}

interface ScoreArgumentRelevanceData extends ClusterExtractionData {
  // Inherits all properties from ClusterExtractionData
}

type ScoreArgumentRelevanceNodeInterface = DGNodeInterface & {
  data: ScoreArgumentRelevanceData;
};

export const score_argument_relevance_node_data: ScoreArgumentRelevanceNodeInterface = {
  id: 'score_argument_relevance',
  data: {
    label: 'score_argument_relevance',
    output: {},
    text: '',
    system_prompt: cluster_extraction_system_prompt,
    prompt: score_claim_relevance_prompt,
    csv_length: 0,
    dirty: false,
    compute_type: 'score_argument_relevance_v0',
    input_ids: { open_ai_key: '', argument_extraction: '' },
    category: categories.ml.id,
    icon: 'score_argument_relevance_v0',
    show_in_ui: false
  },
  position: { x: 0, y: 0 },
  type: 'prompt_v0'
};

export const score_argument_relevance_node = new ScoreArgumentRelevanceNode(
  score_argument_relevance_node_data
);

nodes.register(ScoreArgumentRelevanceNode, score_argument_relevance_node_data);
