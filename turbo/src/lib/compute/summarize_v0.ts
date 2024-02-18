import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import type { DGNodeInterface, GCSBaseData } from '$lib/node_data_types';
import { readFileFromGCS, uploadJSONToGCS } from '$lib/utils';
import _ from 'lodash';
import gpt from '$lib/gpt';
import { summarize_v0_prompt } from '$lib/prompts';

export default class SummarizeNode {
  id: string;
  data: SummarizeData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: SummarizeNodeInterface) {
    const { id, data, position, type } = node_data;
    this.id = id;
    this.data = data;
    this.position = position;
    this.type = type;
  }

  subtopicSummary(topic, subtopic, open_ai_key, info, error, success, subtopicPromises) {
    // Generate a summary of the subtopic
    let quotes = '';
    _.forEach(subtopic.claims, (quote) => {
      quotes += `- "${quote.quote}"\n`;
    });
    const numWords = quotes.split(' ').length;
    if (numWords > 0) {
      const words = Math.min(numWords, 30);
      const prompt = this.data.prompt
        .replace('{topicName}', topic.topicName)
        .replace('{subtopicName}', subtopic.subtopicName)
        .replace('{quotes}', quotes)
        .replace('{words}', words.toString());
      const todo = new Set([1]);
      info('Computing summary');
      subtopicPromises.push(
        gpt(
          open_ai_key,
          {},
          prompt,
          this.data.system_prompt,
          info,
          error,
          success,
          0,
          1,
          todo,
          null
        ).then((result) => {
          subtopic.subtopicShortDescription = result;
        })
      );
    }
  }

  topicSummary(topic, open_ai_key, info, error, success, topicPromises) {
    // generate a summary of the topic, based on the subtopic summaries
    let quotes = '';
    _.forEach(topic.subtopics, (subtopic) => {
      quotes += `- "${subtopic.subtopicShortDescription}"\n`;
    });
    const numWords = quotes.split(' ').length;
    if (numWords > 0) {
      const words = Math.min(numWords, 30);
      const prompt = this.data.prompt
        .replace('{topicName}', topic.topicName)
        .replace('{subtopicName}', '(all subtopics)')
        .replace('{quotes}', quotes)
        .replace('{words}', words.toString());
      const todo = new Set([1]);
      info('Computing summary');
      topicPromises.push(
        gpt(
          open_ai_key,
          {},
          prompt,
          this.data.system_prompt,
          info,
          error,
          success,
          0,
          1,
          todo,
          null
        ).then((result) => {
          topic.topicShortDescription = result;
        })
      );
    }
  }

  async run(data, open_ai_key, info, error, success, slug) {
    const subtopicPromises = [];
    const topicPromises = [];
    _.forEach(data.topics, async (topic) => {
      _.forEach(topic.subtopics, async (subtopic) => {
        this.subtopicSummary(topic, subtopic, open_ai_key, info, error, success, subtopicPromises);
      });
    });
    await Promise.all(subtopicPromises);
    _.forEach(data.topics, async (topic) => {
      this.topicSummary(topic, open_ai_key, info, error, success, topicPromises);
    });
    await Promise.all(topicPromises);
    const summaries = {};
    _.forEach(data.topics, (topic) => {
      summaries[topic.topicName] = topic.topicShortDescription;
      _.forEach(topic.subtopics, (subtopic) => {
        summaries[topic.topicName + '_' + subtopic.subtopicName] =
          subtopic.subtopicShortDescription;
      });
    });
    await uploadJSONToGCS(this, summaries, slug);
    this.data.length = this.length(data);
  }

  async load(data) {
    let summaries = await readFileFromGCS(this);
    if (_.isString(summaries)) {
      summaries = JSON.parse(summaries);
    }
    _.forEach(data.topics, (topic) => {
      topic.topicShortDescription = summaries[topic.topicName];
      _.forEach(topic.subtopics, (subtopic) => {
        subtopic.subtopicShortDescription =
          summaries[topic.topicName + '_' + subtopic.subtopicName];
      });
    });
  }

  length(data) {
    // we use length of the quotes, prompts etc. as a cheap proxy for hashing
    return (
      data?.topics
        .flatMap((topic) => topic.subtopics)
        .flatMap((subtopic) => subtopic.claims)
        .reduce((length, claim) => length + claim.quote.length, 0) + this.data.prompt.length
    );
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
    let data = inputData.data || inputData[this.data.input_ids.data];
    const open_ai_key = inputData.open_ai_key || inputData[this.data.input_ids.open_ai_key];

    if (!this.data.enable) {
      this.data.output = data;
      return data;
    }

    data = _.cloneDeep(data);

    const lengthMatches = this.data.length == this.length(data);

    if (lengthMatches && this.data.gcs_path) {
      await this.load(data);
    } else if (context == 'run' && !lengthMatches) {
      await this.run(data, open_ai_key, info, error, success, slug);
    }
    this.data.dirty = false;
    this.data.output = data;
    return data;
  }
}

interface SummarizeData extends GCSBaseData {
  output: any;
  prompt: string;
  system_prompt: string;
  length: number;
  enable: boolean;
}

type SummarizeNodeInterface = DGNodeInterface & {
  data: SummarizeData;
};

export const summarize_node_data: SummarizeNodeInterface = {
  id: 'summarize',
  data: {
    label: 'summarize',
    dirty: false,
    output: {},
    compute_type: 'summarize_v0',
    input_ids: { data: '', open_ai_key: '' },
    category: categories.ml.id,
    prompt: summarize_v0_prompt,
    system_prompt: '',
    icon: 'summarize_v0',
    show_in_ui: true,
    message: '',
    filename: '',
    size_kb: 0,
    gcs_path: '',
    length: 0,
    enable: true
  },
  position: { x: 0, y: 0 },
  type: 'summarize_v0'
};

export const summarize_node = new SummarizeNode(summarize_node_data);

nodes.register(SummarizeNode, summarize_node_data);
