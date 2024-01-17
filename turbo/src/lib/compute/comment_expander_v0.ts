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
		let out = _.head(_.values(inputData));

		let concatenated: string = '',
			commentInfo: Record<string, any> = {},
			wordCnt: number = 0,
			results: Record<string, any>[] = [];

		_.forEach(out, (row) => {
			const words = row['comment-body'].split(/\s+/);
			if (commentInfo.interview && row.interview !== commentInfo.interview) {
				results.push({ ...commentInfo, 'comment-body': concatenated });
				concatenated = '';
				commentInfo = {};
				wordCnt = 0;
			}

			wordCnt += words.length;

			if (wordCnt >= 100) {
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
}

type CommentExpanderNodeInterface = DGNodeInterface & {
	data: CommentExpanderData;
};

export let comment_expander_node_data: CommentExpanderNodeInterface = {
	id: 'comment_expander',
	data: {
		label: 'comment_expander',
		output: {},
		dirty: false,
		compute_type: 'comment_expander_v0',
		input_ids: {},
		category: categories.wrangling.id,
		icon: 'comment_expander_v0',
		show_in_ui: false,
		message: ''
	},
	position: { x: 0, y: 0 },
	type: 'comment_expander_v0'
};

export let comment_expander_node = new CommentExpanderNode(comment_expander_node_data);

nodes.register(CommentExpanderNode, comment_expander_node_data);
