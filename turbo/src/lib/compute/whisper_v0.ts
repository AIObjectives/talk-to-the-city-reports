import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';
import { readFileFromGCS, uploadJSONToGCS } from '$lib/utils';
import { secondsToHHMMSS } from '$lib/utils';
import OpenAI from 'openai';
import MockOpenAI from '$lib/mock_open_ai';

import { format, unwrapFunctionStore } from 'svelte-i18n';
import _ from 'lodash';

const $__ = unwrapFunctionStore(format);

// Todo: this assumes a browser environment.
// to also work in node, consider using import { Readable } from 'stream'
// when on the backend, and using the browser File API when on the frontend.

export default class WhisperNode {
  id: string;
  data: WhisperData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: WhisperNodeInterface) {
    const { id, data, position, type } = node_data;
    this.id = id;
    this.data = data;
    this.position = position;
    this.type = type;
  }

  convert_to_internal_format(doc: any) {
    const output: any[] = [];
    _.forEach(doc.segments, (segment, i) => {
      const row: any = {
        'comment-id': '' + i,
        'comment-body': segment.text.trim(),
        timestamp: secondsToHHMMSS(segment.start)
      };
      if (this.data.interview) row['interview'] = this.data.interview;
      if (this.data.video) row['video'] = this.data.video;
      output.push(row);
    });
    return output;
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
    const audio: File = inputData.audio || inputData[this.data.input_ids.audio];
    const open_ai_key = inputData.open_ai_key || inputData[this.data.input_ids.open_ai_key];
    this.data.message = '';
    const sizes_match = audio?.size == this.data.audio_size;

    if (!this.data.dirty && this.data.gcs_path && sizes_match) {
      if (!_.isEmpty(this.data.output)) {
        this.data.message = `${$__('loaded_from_cache')}.`;
        return this.data.output;
      }
      const doc = (await readFileFromGCS(this)) as string;
      this.data.message = `${$__('loaded_from_gcs')}.`;
      if (_.includes(['verbose_json', 'json'], this.data.response_format)) {
        return JSON.parse(doc);
      } else if (this.data.response_format == 'custom') {
        this.data.output = this.convert_to_internal_format(JSON.parse(doc));
        return this.data.output;
      }
      return this.data.output;
    }

    if (context == 'run' && !open_ai_key) {
      this.data.message = `${$__('missing_input_data')}`;
      return;
    }

    if (context == 'run' && audio && open_ai_key) {
      const openaiClass = import.meta.env.VITEST ? MockOpenAI : OpenAI;
      const openai = new openaiClass({
        apiKey: open_ai_key,
        dangerouslyAllowBrowser: true
      });
      const response_format =
        this.data.response_format == 'custom' ? 'verbose_json' : this.data.response_format;

      info($__('transcribing_audio'));
      this.data.audio_size = audio.size;
      const transcription = await openai.audio.transcriptions.create({
        file: audio,
        model: this.data.model,
        response_format: response_format as
          | 'verbose_json'
          | 'json'
          | 'text'
          | 'srt'
          | 'vtt'
          | undefined,
        prompt: this.data.prompt,
        temperature: this.data.temperature,
        language: this.data.language
      });
      await uploadJSONToGCS(this as any, transcription, slug);
      this.data.dirty = false;
      if (this.data.response_format == 'custom') {
        this.data.output = this.convert_to_internal_format(transcription);
        return this.data.output;
      }
      this.data.output = transcription;
      return this.data.output;
    }
  }
}

interface WhisperData extends BaseData {
  audio: any;
  response_format: string;
  gcs_path: string;
  language: string;
  audio_size: number;
  prompt: string;
  model: string;
  output: any;
  temperature: number;
  output_internal_format: boolean;
  interview: string;
  video: string;
}

type WhisperNodeInterface = DGNodeInterface & {
  data: WhisperData;
};

export const whisper_node_data: WhisperNodeInterface = {
  id: 'whisper',
  data: {
    label: 'whisper',
    audio: null,
    dirty: false,
    compute_type: 'whisper_v0',
    input_ids: { open_ai_key: '', audio: '' },
    category: categories.ml.id,
    icon: 'whisper_v0',
    show_in_ui: true,
    message: '',
    response_format: 'custom',
    gcs_path: '',
    language: 'en',
    audio_size: 0,
    prompt: '',
    model: 'whisper-1',
    output: null,
    temperature: 0,
    output_internal_format: true,
    interview: '',
    video: ''
  },
  position: { x: 0, y: 0 },
  type: 'whisper_v0'
};

export const whisper_node = new WhisperNode(whisper_node_data);

nodes.register(WhisperNode, whisper_node_data);
