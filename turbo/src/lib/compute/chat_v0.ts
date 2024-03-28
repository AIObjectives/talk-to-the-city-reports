import { get } from 'svelte/store';
import { getEncoding } from 'js-tiktoken';
import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import mock_responses from '$lib/mock_data/gpt_responses';
import { openai } from '$lib/gpt';
import CryptoJS from 'crypto-js';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';
import _ from 'lodash';
import { format, unwrapFunctionStore } from 'svelte-i18n';
import { user } from '$lib/store';

const $__ = unwrapFunctionStore(format);

export default class ChatNode {
  id: string;
  data: ChatNodeData;
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
    inputData: Record<string, any>,
    context: string,
    info: (arg: string) => void,
    error: (arg: string) => void,
    success: (arg: string) => void,
    slug: string,
    Cookies: any
  ) {
    this.data.dirty = false;
    const system_prompt =
      inputData.system_prompt || inputData[this.data.input_ids.system_prompt as string];
    if (system_prompt) this.data.system_prompt = system_prompt;
    this.data.cache.data = inputData.data || inputData[this.data.input_ids.data as string];
    return _.cloneDeep(this.data.messages);
  }

  getTools(dataset) {
    let tools = [];
    (this.data.input_ids.tools as []).forEach((tool: string) => {
      tool = tool.split('|')[0];
      const node = dataset.graph.findImpl(tool);
      if (node) {
        tools = tools.concat(node.tools());
      }
    });
    return tools;
  }

  async executeFunction(func, dataset) {
    for (let tool of this.data.input_ids.tools) {
      tool = tool.split('|')[0];
      const node = dataset.graph.findImpl(tool);
      if (node) {
        const name = func.function.name;
        let args = JSON.parse(func.function.arguments);
        if (!Array.isArray(args)) {
          args = Object.values(args);
        }
        args.push(dataset);
        if (typeof node[name] === 'function') {
          return await node[name].apply(node, args);
        }
      }
    }
  }

  createContext(data) {
    let context = '';
    let num_tokens = 0;
    const encoding = getEncoding('cl100k_base');

    if (_.isString(data)) {
      const tokens = encoding.encode(data);
      tokens.slice(0, this.data.max_context_injection_size).forEach((token) => {
        context += encoding.decode([token]);
      });
      return context;
    }

    if (!_.isEmpty(data?.topics)) {
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
            if (num_tokens > this.data.max_context_injection_size) break;
          }
          if (num_tokens > this.data.max_context_injection_size) break;
        }
        if (num_tokens > this.data.max_context_injection_size) break;
      }
      return context;
    }

    if (!_.isEmpty(data) && (_.isPlainObject(data) || _.isArray(data))) {
      const st = JSON.stringify(data, null, 2);
      num_tokens = encoding.encode(st).length;
      const tokens = encoding.encode(st);
      tokens.slice(0, this.data.max_context_injection_size).forEach((token) => {
        context += encoding.decode([token]);
      });
      return context;
    }

    return context;
  }

  getSystemPrompt(dataset) {
    if (!_.isEmpty(this.data.cache.data)) {
      if (_.isArray(this.data.cache.data) || _.isObject(this.data.cache.data))
        return `${this.data.system_prompt} ${this.createContext(this.data.cache.data)}`;
      else return `${this.data.system_prompt} ${this.data.cache.data}`;
    }
    return this.data.system_prompt;
  }

  getKey(dataset) {
    const keyNode = dataset.graph.find(this.data.input_ids.open_ai_key);
    let apiKey = keyNode?.node?.data.output;
    return apiKey;
  }

  async chat(messages, dataset, key) {
    if (this.data.restrict_to_owner && get(user)?.uid != dataset.owner) {
      this.data.message = $__('chat_is_restricted_to_dataset_owner');
      return this.data.messages;
    } else {
      this.data.message = '';
    }
    this.data.messages = _.cloneDeep(messages);
    if (this.data.messages.length == 1 && this.getSystemPrompt(dataset)) {
      this.data.messages.unshift({ role: 'system', content: this.getSystemPrompt(dataset) });
    }
    const keyNode = dataset.graph.find(this.data.input_ids.open_ai_key);
    let apiKey = keyNode.node.data.output;
    if (key) apiKey = key;
    if (!apiKey) {
      this.data.message = $__('invalid_key');
      return this.data.messages;
    }
    const hash = CryptoJS.SHA256(JSON.stringify(this.data.messages)).toString();
    const tools = this.getTools(dataset);
    const response = await openai(
      apiKey,
      this.data.messages.map((m) => ({ role: m.role, content: m.content })),
      import.meta.env.VITEST,
      hash,
      mock_responses,
      null,
      tools
    );
    if (_.isArray(response)) {
      for (let i = 0; i < response.length; i++) {
        const resp = response[i];
        if (resp.type == 'function') {
          this.data.messages.push({
            role: 'assistant',
            content: JSON.stringify(resp, null, 2),
            type: 'function_call',
            hide: false
          });
          const fresp = await this.executeFunction(resp, dataset);
          console.log('function resp', fresp);
          this.data.messages.push({
            role: 'user',
            type: 'function_response',
            content: JSON.stringify(fresp, null, 2),
            hide: false
          });
        }
      }
      await this.chat(this.data.messages, dataset, apiKey);
      return this.data.messages;
    } else {
      this.data.messages.push({ role: 'assistant', content: response, hide: false });
      console.log(response);
      return this.data.messages;
    }
  }

  reset() {
    this.data.messages = [];
    this.data.dirty = true;
  }
}

interface ChatNodeData extends BaseData {
  cache: { data: string };
  output: object;
  messages: object[];
  text_to_speech: boolean;
  speech_to_text: boolean;
  show_function_calls: boolean;
  system_prompt: string;
  max_context_injection_size: number;
  restrict_to_owner: boolean;
}

type ChatNodeInterface = DGNodeInterface & {
  data: ChatNodeData;
};

export let chat_node_data: ChatNodeInterface = {
  id: 'chat',
  data: {
    label: 'chat',
    dirty: false,
    messages: [],
    output: {},
    compute_type: 'chat_v0',
    input_ids: { data: '', open_ai_key: '', system_prompt: '', embeddings: '', tools: [] },
    category: categories.ml.id,
    icon: 'chat_v0',
    show_in_ui: true,
    message: '',
    text_to_speech: false,
    speech_to_text: false,
    show_function_calls: false,
    show_settings_in_standard_view: true,
    system_prompt: '',
    cache: { data: '' },
    max_context_injection_size: 50000,
    restrict_to_owner: false
  },
  position: { x: 0, y: 0 },
  type: 'chat_v0'
};

export let chat_node = new ChatNode(chat_node_data);

nodes.register(ChatNode, chat_node);
