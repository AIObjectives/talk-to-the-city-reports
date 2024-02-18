import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import _ from 'lodash';
import { readFileFromGCS, uploadJSONToGCS } from '$lib/utils';
import { format, unwrapFunctionStore } from 'svelte-i18n';
import type { DGNodeInterface, GCSBaseData } from '$lib/node_data_types';

const $__ = unwrapFunctionStore(format);

export default class ReportNode {
  id: string;
  data: ReportData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: ReportNodeInterface) {
    const { id, data, position, type } = node_data;
    this.id = id;
    this.data = data;
    this.position = position;
    this.type = type;
  }

  setMessage(fromGCS = false) {
    if (this.data.output.merge?.topics.length > 0 && this.data.output.csv?.length > 0) {
      this.data.message = `
		${$__(`clusters`)}: ${this.data.output.merge?.topics.length}<br/>
		${$__(`csv`)}: ${this.data.output.csv?.length}`;
      if (fromGCS) {
        this.data.message = this.data.message + `<br/>${$__(`loaded_from_gcs`)}`;
      }
    } else {
      this.data.message = '';
    }
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
    if (context == 'load' && this.data.gcs_path && _.isEmpty(inputData)) {
      try {
        let doc: any = await readFileFromGCS(this);
        if (typeof doc === 'string') {
          doc = JSON.parse(doc);
        }
        this.data.output.merge = doc.merge;
        this.setMessage(true);
        return this.data.output;
      } catch (e) {
        this.data.gcs_path = '';
        console.error(e);
      }
    }
    if (context == 'run') {
      try {
        const doc = {
          merge: inputData[this.data.input_ids.merge]
        };
        await uploadJSONToGCS(this, doc, slug);
      } catch (e) {
        console.error(e);
      }
    }
    const output_ids = this.data.output_ids;
    this.data.output[output_ids.merge] = _.cloneDeep(inputData[this.data.input_ids.merge]);
    this.data.output[output_ids.csv] = _.cloneDeep(inputData[this.data.input_ids.csv]);
    this.setMessage(false);
    return this.data.output;
  }
}

interface ReportData extends GCSBaseData {
  output: Record<string, any>;
  output_ids: Record<string, string>;
}

type ReportNodeInterface = DGNodeInterface & {
  data: ReportData;
};

export const report_node_data: ReportNodeInterface = {
  id: 'report_v1',
  data: {
    label: 'report_v1',
    output: {},
    dirty: false,
    compute_type: 'report_v1',
    input_ids: { merge: '', csv: '' },
    output_ids: { merge: 'merge', csv: 'csv' },
    category: categories.display.id,
    icon: 'report_v0',
    show_in_ui: false,
    message: '',
    filename: '',
    size_kb: 0,
    gcs_path: ''
  },
  position: { x: 0, y: 0 },
  type: 'default_v0'
};

export const report_node_v1 = new ReportNode(report_node_data);

nodes.register(ReportNode, report_node_data);
