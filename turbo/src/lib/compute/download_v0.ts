import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';
import _ from 'lodash';

export default class DownloadNode {
  id: string;
  data: DownloadData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: DownloadNodeInterface) {
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
    const data = _.head(_.values(inputData));
    return data;
  }
}

interface DownloadData extends BaseData {
  output: object;
}

type DownloadNodeInterface = DGNodeInterface & {
  data: DownloadData;
};

export const download_node_data: DownloadNodeInterface = {
  id: 'download',
  data: {
    label: 'download',
    output: {},
    dirty: false,
    compute_type: 'download_v0',
    input_ids: { data: '' },
    category: categories.wrangling.id,
    icon: 'download_v0',
    show_in_ui: false,
    message: ''
  },
  position: { x: 0, y: 0 },
  type: 'download_v0'
};

export const download_node = new DownloadNode(download_node_data);

nodes.register(DownloadNode, download_node_data);
