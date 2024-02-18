import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import deepCopy from 'deep-copy';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';
import _ from 'lodash';

export default class MergeNode {
  id: string;
  data: MergeData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: MergeNodeInterface) {
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
    if (!inputData) {
      return;
    }
    let cluster_extraction =
      inputData?.cluster_extraction || inputData[this.data.input_ids.cluster_extraction];
    let argument_extraction =
      inputData?.argument_extraction || inputData[this.data.input_ids.argument_extraction];

    if (!cluster_extraction || !argument_extraction || !cluster_extraction.topics) {
      this.data.dirty = false;
      return;
    }

    cluster_extraction = deepCopy(cluster_extraction);
    argument_extraction = deepCopy(argument_extraction);

    _.forOwn(argument_extraction, (v, k) => {
      _.forEach(v['claims'], (claim, i) => {
        claim['id'] = `${k}-${i}`;
      });
    });

    const lookup: Record<string, any> = {};

    _.forOwn(argument_extraction, (v, k) => {
      _.forEach(v['claims'], (claim) => {
        const combinedClaim = _.assign({}, claim, {
          interview: v['interview'],
          commentId: v['id']
        });
        const key = `${combinedClaim['topicName']}::${combinedClaim['subtopicName']}`;

        if (!_.has(lookup, key)) {
          lookup[key] = [];
        }
        lookup[key].push(combinedClaim);
      });
    });

    _.forEach(cluster_extraction['topics'], (topic) => {
      _.forEach(topic['subtopics'], (subtopic) => {
        const key = `${topic['topicName']}::${subtopic['subtopicName']}`;
        subtopic['claims'] = _.get(lookup, key, []);
      });
    });

    _.remove(cluster_extraction['topics'], (topic: Record<string, any>) => {
      _.remove(topic['subtopics'], (subtopic: Record<string, any>) => {
        return _.isEmpty(subtopic['claims']);
      });
      return _.isEmpty(topic['subtopics']);
    });

    this.data.output = cluster_extraction;
    this.data.dirty = false;
    return cluster_extraction;
  }
}

interface MergeData extends BaseData {
  output: object;
}

type MergeNodeInterface = DGNodeInterface & {
  data: MergeData;
};

export const merge_node_data: MergeNodeInterface = {
  id: 'merge',
  data: {
    label: 'merge',
    output: {},
    dirty: false,
    compute_type: 'merge_v0',
    input_ids: { cluster_extraction: '', argument_extraction: '' },
    category: categories.wrangling.id,
    icon: 'merge_v0',
    show_in_ui: false,
    message: ''
  },
  position: { x: 0, y: 0 },
  type: 'merge_v0'
};

export const merge_node = new MergeNode(merge_node_data);

nodes.register(MergeNode, merge_node_data);
