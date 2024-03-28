import gpt from '$lib/gpt';
import _ from 'lodash';
import jsonpath from 'jsonpath';
import nodes from '$lib/node_register';
import { readFileFromGCS, uploadJSONToGCS, quickChecksum } from '$lib/utils';
import type { DGNodeInterface, GCSBaseData } from '$lib/node_data_types';

import categories from '$lib/node_categories';

function defaultdict(factory) {
  const dict = new Proxy(
    {},
    {
      get: function (target, key) {
        let value = target[key];
        if (typeof value === 'undefined') {
          value = factory();
          target[key] = value;
        }
        return value;
      }
    }
  );

  return dict;
}

function sizeofDefaultDict(defaultdict) {
  return Object.keys(defaultdict).length;
}

export default class TranslateNode {
  id: string;
  data: TranslateData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: TranslateNodeInterface) {
    const { id, data, position, type } = node_data;
    this.id = id;
    this.data = data;
    this.position = position;
    this.type = type;
  }

  async translate(target_languages, data, keys, open_ai_key, info, error, success) {
    const translations = {};
    translations[this.data.input_language] = _.cloneDeep(data);

    const todo = defaultdict(() => []);

    for (const language of target_languages) {
      translations[language] = _.cloneDeep(data);
      for (const key of keys) {
        const valuesByJsonPath = jsonpath.query(translations[language], key);
        for (const [index, valueToTranslate] of valuesByJsonPath.entries()) {
          if (valueToTranslate !== null) {
            todo[JSON.stringify([language, valueToTranslate])].push({
              key,
              index,
              translation: ''
            });
          }
        }
      }
    }

    const num = sizeofDefaultDict(todo);
    const numTodo = new Set(_.range(0, num));

    async function delay(milliseconds) {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }

    const output = [];
    let i = 0;
    for (const t in todo) {
      i += 1;
      const [language, valueToTranslate] = JSON.parse(t);
      const promise = (async () => {
        await delay(100 * i);
        const res = await gpt(
          open_ai_key,
          {
            text: valueToTranslate,
            language: language
          },
          this.data.prompt,
          this.data.system_prompt,
          info,
          error,
          success,
          i,
          num,
          numTodo,
          null
        );
        const keys = _.uniq(todo[t].map((x) => x.key));
        for (const key of keys)
          jsonpath.apply(translations[language], key, (value, path) => {
            if (_.isEqual(value, valueToTranslate)) {
              return res;
            }
            return value;
          });
      })();
      output.push(promise);
    }

    await Promise.all(output);
    return translations;
  }

  async compute(
    inputData: Record<string, any>,
    context: string,
    info: (arg: string) => void,
    error: (arg: string) => void,
    success: (arg: string) => void,
    slug: string,
    Cookies: any
  ): Promise<Record<string, any>> {
    const open_ai_key =
      inputData.open_ai_key || inputData[this.data.input_ids.open_ai_key as string];
    const data = inputData.data || inputData[this.data.input_ids.data as string];
    const target_languages = this.data.target_languages;
    const keys = this.data.keys;

    if (_.isEmpty(data) || _.isEmpty(target_languages) || _.isEmpty(keys)) {
      return;
    }

    const length = quickChecksum(data);
    const length_changed = length !== this.data.length;

    const languageSelector = this.data.language_selector;

    if (!this.data.dirty && this.data.gcs_path && !length_changed) {
      let storedData: any = await readFileFromGCS(this);
      if (typeof storedData === 'string') storedData = JSON.parse(storedData);
      return {
        translations: storedData,
        translation: storedData[languageSelector] || storedData[this.data.input_language]
      };
    }

    if (context == 'run') {
      const translations = await this.translate(
        target_languages,
        data,
        keys,
        open_ai_key,
        info,
        error,
        success
      );
      await uploadJSONToGCS(this, translations, slug);
      this.data.length = length;
      return {
        translations,
        translation: translations[languageSelector] || translations[this.data.input_language]
      };
    }
  }
}

interface TranslateData extends GCSBaseData {
  target_languages: string[];
  gcs_path: string;
  keys: string[];
  language_selector: string;
  input_language: string;
  cache: Record<string, any>;
  system_prompt: string;
  prompt: string;
  length: number;
  locale_is_selector: boolean;
}

type TranslateNodeInterface = DGNodeInterface<GCSBaseData> & {
  data: TranslateData;
};

export const translate_node_data: TranslateNodeInterface = {
  id: 'translate',
  data: {
    label: 'translate',
    target_languages: ['zh-TW'],
    keys: [
      '$.topics[*].topicName',
      '$.topics[*].topicShortDescription',
      '$.topics[*].subtopics[*].subtopicName',
      '$.topics[*].subtopics[*].subtopicShortDescription',
      '$.topics[*].subtopics[*].claims[*].claim',
      '$.topics[*].subtopics[*].claims[*].quote',
      '$.topics[*].subtopics[*].claims[*].topicName',
      '$.topics[*].subtopics[*].claims[*].subtopicName'
    ],
    dirty: false,
    gcs_path: '',
    compute_type: 'translate_v0',
    input_ids: { open_ai_key: '', data: '' },
    output_ids: { translation: '', translations: [] },
    category: categories.ml.id,
    icon: 'translate_v0',
    message: '',
    show_in_ui: false,
    filename: '',
    size_kb: 0,
    language_selector: 'en-US',
    input_language: 'en-US',
    cache: {},
    system_prompt:
      'You are a professional translator. You respond with the correct translation and nothing else.',
    prompt: 'Translate the following text to {language}.\n\n{text}',
    length: 0,
    locale_is_selector: true
  },
  position: { x: 0, y: 0 },
  type: 'translate_v0'
};

export const translate_node = new TranslateNode(translate_node_data);

nodes.register(TranslateNode, translate_node_data);
