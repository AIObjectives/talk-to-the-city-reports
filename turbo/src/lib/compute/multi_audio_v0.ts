import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import { readFileFromGCS } from '$lib/utils';
import type { BaseData, DGNodeInterface } from '$lib/node_data_types';

// Todo: this assumes a browser environment.
// to also work in node, consider using import { Readable } from 'stream'
// when on the backend, and using the browser File API when on the frontend.
// alternatively, it's OK for this node to return a Blob

class MultiAudioNode implements MultiAudioNodeInterface {
  id: string;
  data: MultiAudioData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: MultiAudioNodeInterface) {
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

    const output = [];
    let contents;
    if (this.data.download) {
      for (let i = 0; i < this.data.files.length; i++) {
        const gcs_path = this.data.files[i].gcs_path;
        contents = (await readFileFromGCS(this, true, gcs_path)) as Blob;
        this.data.files[i].size = contents.size;
        const fileName = gcs_path.split('/').pop()!;
        const audioFile = new File([contents], fileName, { type: contents.type });
        this.data.files[i].mime_type = contents.type;
        output.push(audioFile);
      }
    } else {
      // Optimization hack: allow for empty audio
      for (let i = 0; i < this.data.files.length; i++) {
        const blob = new Blob([' '.repeat(this.data.files[i].size)], {
          type: this.data.files[i].mime_type
        });
        output.push(
          new File([blob], this.data.files[i].filename, {
            type: this.data.files[i].mime_type
          })
        );
      }
    }

    return output;
  }
}

export default MultiAudioNode;

interface AudioData {
  size: number;
  mime_type: string;
  filename: string;
  gcs_path: string;
}

interface MultiAudioData extends BaseData {
  files: AudioData[];
  download: boolean;
}

type MultiAudioNodeInterface = DGNodeInterface & {
  data: MultiAudioData;
};

export const audio_node_data: MultiAudioNodeInterface = {
  id: 'multi_audio',
  data: {
    label: 'multi_audio',
    dirty: false,
    files: [],
    output: null,
    compute_type: 'multi_audio_v0',
    input_ids: {},
    category: categories.input.id,
    icon: 'audio_v0',
    show_in_ui: true,
    message: '',
    download: true
  },
  position: { x: 0, y: 0 },
  type: 'multi_audio_v0'
};

export const multi_audio_node = new MultiAudioNode(audio_node_data);

nodes.register(MultiAudioNode, audio_node_data);
