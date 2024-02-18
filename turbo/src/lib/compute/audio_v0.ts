import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import { readFileFromGCS } from '$lib/utils';
import type { GCSBaseData, DGNodeInterface } from '$lib/node_data_types';

// Todo: this assumes a browser environment.
// to also work in node, consider using import { Readable } from 'stream'
// when on the backend, and using the browser File API when on the frontend.
// alternatively, it's OK for this node to return a Blob

class AudioNode implements AudioNodeInterface {
  id: string;
  data: AudioData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: AudioNodeInterface) {
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
    if (!this.data.dirty && this.data.output && this.data.output.length > 0) {
      return this.data.output;
    }

    let contents;
    if (this.data.gcs_path) {
      if (this.data.download) {
        contents = (await readFileFromGCS(this, true)) as Blob;
        this.data.size = contents.size;
        const fileName = this.data.gcs_path.split('/').pop()!;
        const audioFile = new File([contents], fileName, { type: contents.type });
        this.data.mime_type = contents.type;
        this.data.output = audioFile;
      } else {
        // Optimization hack: allow for empty audio
        const blob = new Blob([' '.repeat(this.data.size)], { type: this.data.mime_type });
        this.data.output = new File([blob], this.data.filename, {
          type: this.data.mime_type
        });
      }
    }

    this.data.dirty = false;
    return this.data.output;
  }
}

export default AudioNode;

interface AudioData extends GCSBaseData {
  size: number;
  mime_type: string;
  download: boolean;
}

type AudioNodeInterface = DGNodeInterface<GCSBaseData> & {
  data: AudioData;
};

export const audio_node_data: AudioNodeInterface = {
  id: 'audio',
  data: {
    label: 'audio',
    filename: '',
    size_kb: 0,
    dirty: false,
    gcs_path: '',
    output: null,
    compute_type: 'audio_v0',
    input_ids: { data: '' },
    category: categories.input.id,
    icon: 'audio_v0',
    show_in_ui: true,
    message: '',
    size: 0,
    mime_type: '',
    download: true
  },
  position: { x: 0, y: 0 },
  type: 'audio_v0'
};

export const audio_node = new AudioNode(audio_node_data);

nodes.register(AudioNode, audio_node_data);
