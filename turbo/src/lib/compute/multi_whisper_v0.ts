import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';
import WhisperNode, { whisper_node_data } from '$lib/compute/whisper_v1';

import { format, unwrapFunctionStore } from 'svelte-i18n';
import _ from 'lodash';

const $__ = unwrapFunctionStore(format);

export default class MultiWhisperNode {
  id: string;
  data: MultiWhisperData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: MultiWhisperNodeInterface) {
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
    const audio: File[] = inputData.audio || inputData[this.data.input_ids.audio];
    const open_ai_key = inputData.open_ai_key || inputData[this.data.input_ids.open_ai_key];

    console.log('num audio files: ', audio.length);

    // remove entries from node_info that are not in the audio list
    for (const key in this.data.node_info) {
      if (!audio.some((x) => x.name === key)) {
        delete this.data.node_info[key];
      }
    }

    // for each audio track, create and run a whisper node
    for (let i = 0; i < audio.length; i++) {
      const filename = audio[i].name;

      const whisper = new WhisperNode(_.cloneDeep(whisper_node_data));
      // Set the IDs for the whisper node
      whisper.id = 'whisper_' + filename;
      // Set the input IDs for the whisper node
      whisper.data.input_ids.open_ai_key = 'open_ai_key';
      whisper.data.input_ids.audio = 'audio';

      // If the node_info is already present, merge it with the whisper node's data
      if (!_.isEmpty(this.data.node_info[filename])) {
        _.merge(whisper.data, this.data.node_info[filename]);
      }

      // Run the whisper node
      const result = await whisper.compute(
        { audio: audio[i], open_ai_key: open_ai_key },
        this.data.enable ? context : 'load',
        info,
        error,
        success,
        slug,
        Cookies
      );

      // Assign the output of the whisper node to the node_info
      // TODO: this should really be stored in the cache
      this.data.node_info[filename] = {
        response_format: whisper.data.response_format,
        gcs_path: whisper.data.gcs_path,
        language: whisper.data.language,
        audio_size: whisper.data.audio_size,
        prompt: whisper.data.prompt,
        model: whisper.data.model,
        // output: whisper.data.output,
        temperature: whisper.data.temperature,
        output_internal_format: whisper.data.output_internal_format,
        interview: whisper.data.interview,
        video: whisper.data.video,
        dirty: _.isEmpty(whisper.data.output),
        filename: filename
      };

      this.data.cache[filename] = whisper.data.output;
    }

    return _.flatten(_.values(this.data.cache).map((x) => x));
  }
}

interface MultiWhisperData extends BaseData {
  node_info: {};
}

type MultiWhisperNodeInterface = DGNodeInterface & {
  data: MultiWhisperData;
};

export const multi_whisper_node_data: MultiWhisperNodeInterface = {
  id: 'multi_whisper',
  data: {
    label: 'multi_whisper',
    dirty: false,
    compute_type: 'multi_whisper_v0',
    input_ids: { open_ai_key: '', audio: '' },
    category: categories.ml.id,
    icon: 'whisper_v0',
    show_in_ui: true,
    message: '',
    output: null,
    node_info: {},
    enable: false,
    cache: {}
  },
  position: { x: 0, y: 0 },
  type: 'multi_whisper_v0'
};

export const multi_whisper_node = new MultiWhisperNode(multi_whisper_node_data);

nodes.register(MultiWhisperNode, multi_whisper_node_data);
