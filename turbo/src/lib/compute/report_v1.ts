import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import _ from 'lodash';
import { readFileFromGCS, uploadJSONToGCS } from '$lib/utils';
import { format, unwrapFunctionStore } from 'svelte-i18n';
import type { DGNodeInterface, GCSBaseData } from '$lib/node_data_types';
import { locale } from 'svelte-i18n';
import { get } from 'svelte/store';

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

  setMessage(fromGCS = false, data = null) {
    if (data.merge?.topics.length > 0 && data.csv?.length > 0) {
      this.data.message = `
		${$__(`clusters`)}: ${data.merge?.topics.length}<br/>
		${$__(`csv`)}: ${data.csv?.length}`;
      if (fromGCS) {
        this.data.message = this.data.message + `<br/>${$__(`loaded_from_gcs`)}`;
      }
    } else {
      this.data.message = '';
    }
  }

  sortData(data) {
    if (!data) return data;
    data.topics.forEach((topic) => {
      topic.subtopics.forEach((subtopic) => {
        subtopic.claims = subtopic.claims.sort((a, b) => a.id.localeCompare(b.id));
      });
    });
    data.topics.forEach((topic) => {
      topic.subtopics = topic.subtopics.sort((a, b) => b.claims.length - a.claims.length);
    });
    data.topics = data.topics.sort((a, b) => {
      const totalClaimsA = a.subtopics.reduce((acc, subtopic) => acc + subtopic.claims.length, 0);
      const totalClaimsB = b.subtopics.reduce((acc, subtopic) => acc + subtopic.claims.length, 0);
      return totalClaimsB - totalClaimsA;
    });
    return data;
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
    const translations = inputData[this.data.input_ids.translations as string];
    const merge = inputData[this.data.input_ids.merge as string];
    const csv = inputData[this.data.input_ids.csv as string];

    const loc = get(locale);

    if (context == 'load' && this.data.gcs_path && _.isEmpty(inputData)) {
      try {
        let doc: any = await readFileFromGCS(this);
        if (typeof doc === 'string') {
          doc = JSON.parse(doc);
        }

        if (doc.merge) {
          const sorted = this.sortData(doc.merge);
          this.setMessage(true, sorted);
          return { merge: sorted };
        } else if (doc.translations) {
          const langs = Object.keys(doc.translations);
          if (langs.includes(loc)) {
            this.data.language = loc;
          } else {
            this.data.language = langs[0];
          }
          const sorted = this.sortData(doc.translations[this.data.language]);
          this.setMessage(true, sorted);
          return { merge: sorted };
        }
      } catch (e) {
        this.data.gcs_path = '';
        console.error(e);
      }
    }
    if (context == 'run' && (!_.isEmpty(merge) || !_.isEmpty(translations))) {
      try {
        await uploadJSONToGCS(this, { merge: merge, translations: translations }, slug);
      } catch (e) {
        console.error(e);
      }
    }
    if (_.isEmpty(merge) && _.isEmpty(translations)) return { merge: null, csv: null };
    const output_ids = this.data.output_ids;
    if (!_.isEmpty(translations)) {
      const langs = Object.keys(translations);
      if (langs.includes(loc)) {
        this.data.language = loc;
      }
      const translation = translations[this.data.language];
      const output = {
        [output_ids.merge]: this.sortData(_.cloneDeep(translation ? translation : merge)),
        [output_ids.csv]: _.cloneDeep(csv)
      };
      this.setMessage(false, output);
      return output;
    } else if (!_.isEmpty(merge)) {
      const output = {
        [output_ids.merge]: this.sortData(_.cloneDeep(merge)),
        [output_ids.csv]: _.cloneDeep(csv)
      };
      this.setMessage(false, output);
      return output;
    }
  }
}

interface ReportData extends GCSBaseData {
  output: Record<string, any>;
  output_ids: Record<string, string>;
  language: string;
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
    input_ids: { merge: '', csv: '', translations: '' },
    output_ids: { merge: 'merge', csv: 'csv' },
    category: categories.display.id,
    icon: 'report_v0',
    show_in_ui: false,
    message: '',
    filename: '',
    size_kb: 0,
    gcs_path: '',
    show_to_anon: false,
    language: 'en-US'
  },
  position: { x: 0, y: 0 },
  type: 'default_v0'
};

export const report_node_v1 = new ReportNode(report_node_data);

nodes.register(ReportNode, report_node_data);
