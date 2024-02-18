import { get } from 'svelte/store';
import nodes from '$lib/node_register';
import { getEncoding } from 'js-tiktoken';
import categories from '$lib/node_categories';
import { chat_system_prompt } from '$lib/prompts';
import mock_responses from '$lib/mock_data/gpt_responses';
import { openai } from '$lib/gpt';
import CryptoJS from 'crypto-js';
import _ from 'lodash';
import { format, unwrapFunctionStore } from 'svelte-i18n';

const $__ = unwrapFunctionStore(format);

export default class ChatNode {
  id: string;
  data: StringifyData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: ChatNodeInterface) {
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
    this.data.dirty = false;
    this.data.output = _.cloneDeep(this.data.messages);
    return this.data.output;
  }

  createContext(data) {
    let context = '';
    let num_tokens = 0;
    const encoding = getEncoding('cl100k_base');

    if (_.isString(data)) {
      const tokens = encoding.encode(data);
      tokens.slice(0, 50000).forEach((token) => {
        context += encoding.decode([token]);
      });
      return context;
    }

    for (let i = 0; i < _.keys(data?.topics).length; i++) {
      const topic = data?.topics[i];
      for (let j = 0; j < _.keys(topic?.subtopics).length; j++) {
        const subtopic = topic?.subtopics[j];
        for (let k = 0; k < _.keys(subtopic?.claims).length; k++) {
          const claim = subtopic?.claims[k];
          let text = '';
          text += '\n';
          text += `Interview: ${claim?.interview}\n`;
          text += `Topic: ${claim?.topicName}\n`;
          text += `Subtopic: ${claim?.subtopicName}\n`;
          text += `Claim: ${claim?.claim}\n`;
          text += '\n';
          context += text;
          num_tokens += encoding.encode(text).length;
          if (num_tokens > 50000) break;
        }
        if (num_tokens > 50000) break;
      }
      if (num_tokens > 50000) break;
    }

    return context;
  }

  insertSystemPrompt(messages, context) {
    if (messages.length === 1) {
      console.log(context);
      const M = _.cloneDeep(this.data.initial_messages);
      M[0].content = M[0].content.replace('{text}', context);
      M.push(messages[0]);
      this.data.messages = M;
    }
  }

  async chat(messages, dataset, key) {
    this.data.messages = _.cloneDeep(messages);
    this.data.message = null;
    const keyNode = dataset.graph.find(this.data.input_ids.open_ai_key);
    let apiKey = keyNode.node.data.output;
    if (key) apiKey = key;
    if (!apiKey) {
      this.data.message = $__('invalid_key');
      return;
    }
    const data = dataset.graph.find(this.data.input_ids.data);
    if (!data) {
      this.data.message = $__('missing_input_data');
      return;
    }
    const context = this.createContext(data.node.data.output);
    if (!context) {
      console.log('missing context');
      this.data.message = $__('missing_input_data');
      return;
    }
    this.insertSystemPrompt(messages, context);
    const hash = CryptoJS.SHA256(JSON.stringify(this.data.messages)).toString();
    const response = await openai(
      apiKey,
      this.data.messages,
      import.meta.env.VITEST,
      hash,
      mock_responses,
      null
    );
    this.data.messages.push({ role: 'assistant', content: response });
    console.log(response);
    return this.data.messages;
  }

  reset() {
    this.data.messages = [];
    this.data.dirty = true;
    console.log('reset');
    console.log(this.data.messages);
  }
}

interface StringifyData extends BaseData {
  output: object;
}

type ChatNodeInterface = DGNodeInterface & {
  data: StringifyData;
};

export const chat_node_data: ChatNodeInterface = {
  id: 'chat',
  data: {
    label: 'chat',
    dirty: false,
    initial_messages: [{ role: 'system', content: chat_system_prompt }],
    messages: [],
    output: {},
    compute_type: 'chat_v0',
    input_ids: { open_ai_key: '', data: '' },
    category: categories.ml.id,
    icon: 'chat_v0',
    show_in_ui: true
  },
  position: { x: 0, y: 0 },
  type: 'chat_v0'
};

export const chat_node = new ChatNode(chat_node_data);

nodes.register(ChatNode, chat_node);
