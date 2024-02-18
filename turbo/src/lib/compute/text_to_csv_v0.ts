import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';
import { getEncoding } from 'js-tiktoken';

import { format, unwrapFunctionStore } from 'svelte-i18n';
import _ from 'lodash';

const $__ = unwrapFunctionStore(format);

export default class TextToCSV {
  id: string;
  data: TextToCSVData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: TextToCSVInterface) {
    const { id, data, position, type } = node_data;
    this.id = id;
    this.data = data;
    this.position = position;
    this.type = type;
  }

  toCSV(val, interview, video, timestamp, startIndex = 0) {
    const encoding = getEncoding('cl100k_base');
    const tokens = encoding.encode(val);
    const commentChunks = [];
    for (let i = 0; i < tokens.length; i += parseInt(this.data.numTokens)) {
      const chunkTokens = tokens.slice(i, i + parseInt(this.data.numTokens));
      const commentChunk = chunkTokens.map((token) => encoding.decode([token])).join('');
      commentChunks.push(commentChunk);
    }

    const docs = [];

    commentChunks.forEach((chunk, index) => {
      const doc = {
        'comment-body': chunk,
        'comment-id': (startIndex + index).toString(),
        interview: interview
      };

      if (video) {
        doc['video'] = video;
        doc['timestamp'] = timestamp;
      }
      docs.push(doc);
    });
    return docs;
  }

  async compute(inputData, context, info, error, success, slug, Cookies) {
    this.data.dirty = false;
    const res = [];
    const inputs = _.values(inputData);
    _.forEach(inputs, (input, i) => {
      if (_.isString(input)) {
        const interview = this.data.entries[i]?.interview || this.data.entries[0].interview;
        const video = this.data.entries[i]?.video || this.data.entries[0].video;
        const timestamp = this.data.entries[i]?.timestamp || this.data.entries[0].timestamp;
        const csv = this.toCSV(input, interview, video, timestamp, res.length);
        res.push(...csv);
      } else if (_.isArray(input)) {
        input.forEach((val, j) => {
          const interview = this.data.entries[j]?.interview || this.data.entries[0].interview;
          const video = this.data.entries[j]?.video || this.data.entries[0].video;
          const timestamp = this.data.entries[j]?.timestamp || this.data.entries[0].timestamp;
          const csv = this.toCSV(val, interview, video, timestamp, res.length);
          res.push(...csv);
        });
      }
    });
    this.data.output = res;
    return res;
  }
}

interface TextToCSVEntry {
  interview: string;
  video: string;
  timestamp: string;
}

interface TextToCSVData extends BaseData {
  output: any;
  numTokens: string;
  entries: TextToCSVEntry[];
}

type TextToCSVInterface = DGNodeInterface & {
  data: TextToCSVData;
};

export const text_to_csv_node_data: TextToCSVInterface = {
  id: 'text_to_csv',
  data: {
    label: 'text_to_csv',
    dirty: false,
    compute_type: 'text_to_csv_v0',
    input_ids: { data: '' },
    category: categories.wrangling.id,
    icon: 'text_to_csv_v0',
    show_in_ui: true,
    message: '',
    output: null,
    numTokens: '1000',
    entries: [
      {
        interview: 'Alice',
        video: 'https://www.youtube.com/watch?v=1qKz9W3bKbE',
        timestamp: '00:00:00'
      }
    ]
  },
  position: { x: 0, y: 0 },
  type: 'text_to_csv_v0'
};

export const text_to_csv_node = new TextToCSV(text_to_csv_node_data);

nodes.register(TextToCSV, text_to_csv_node_data);
