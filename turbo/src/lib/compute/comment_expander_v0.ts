import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';
import _ from 'lodash';

export default class CommentExpanderNode {
  id: string;
  data: CommentExpanderData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: CommentExpanderNodeInterface) {
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
    this.data.dirty = false;
    const out = _.head(_.values(inputData));
    const limit = parseInt(this.data.text);

    let concatenated: string = '',
      commentInfo: Record<string, any> = {},
      wordCnt: number = 0,
      results: Record<string, any>[] = [];

    _.forEach(out, (row) => {
      if (!row || !row['comment-body']) {
        return;
      }
      const words = row['comment-body'].split(/\s+/);
      if (words.length > limit) {
        row['comment-body'] = words.slice(0, limit).join(' ');
      }

      if (commentInfo.interview && row.interview !== commentInfo.interview) {
        results.push({ ...commentInfo, 'comment-body': concatenated });
        concatenated = '';
        commentInfo = {};
        wordCnt = 0;
      }

      wordCnt += words.length;

      if (wordCnt >= limit) {
        if (concatenated) results.push({ ...commentInfo, 'comment-body': concatenated });
        commentInfo = _.pick(row, ['video', 'comment-id', 'interview', 'timestamp']);
        concatenated = row['comment-body'];
        wordCnt = words.length;
      } else {
        if (!concatenated)
          commentInfo = _.pick(row, ['video', 'comment-id', 'interview', 'timestamp']);
        concatenated += concatenated ? ` ${row['comment-body']}` : row['comment-body'];
      }
    });

    if (concatenated) results.push({ ...commentInfo, 'comment-body': concatenated });

    this.data.output = results;
    return this.data.output;
  }
}

interface CommentExpanderData extends BaseData {
  output: object;
  text: string;
}

type CommentExpanderNodeInterface = DGNodeInterface & {
  data: CommentExpanderData;
};

export const comment_expander_node_data: CommentExpanderNodeInterface = {
  id: 'comment_expander',
  data: {
    label: 'comment_expander',
    output: {},
    dirty: false,
    compute_type: 'comment_expander_v0',
    input_ids: { data: '' },
    category: categories.wrangling.id,
    icon: 'comment_expander_v0',
    show_in_ui: false,
    message: '',
    text: '100'
  },
  position: { x: 0, y: 0 },
  type: 'comment_expander_v0'
};

export const comment_expander_node = new CommentExpanderNode(comment_expander_node_data);

nodes.register(CommentExpanderNode, comment_expander_node_data);
