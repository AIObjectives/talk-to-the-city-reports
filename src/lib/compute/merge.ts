import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import deepCopy from 'deep-copy';
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
		inputData: object,
		context: string,
		info: (arg: string) => void,
		error: (arg: string) => void,
		success: (arg: string) => void,
		slug: string,
		Cookies: any
	) {
		let cluster_extraction =
			inputData.cluster_extraction || inputData[this.data.input_ids.cluster_extraction];
		let argument_extraction =
			inputData.argument_extraction || inputData[this.data.input_ids.argument_extraction];

		if (!cluster_extraction || !argument_extraction || !cluster_extraction.topics) {
			this.data.dirty = false;
			return;
		}

		cluster_extraction = deepCopy(cluster_extraction);
		argument_extraction = deepCopy(argument_extraction);

		const lookup = {};

		_.forOwn(argument_extraction, (v, k) => {
			_.forEach(v['claims'], (claim) => {
				const combinedClaim = _.assign({}, claim, {
					interview: v['interview']
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

export let merge_node_data: MergeNodeInterface = {
	id: 'merge',
	data: {
		label: 'merge',
		output: {},
		dirty: false,
		compute_type: 'merge_v0',
		input_ids: { cluster_extraction: '', argument_extraction: '' },
		category: categories.wrangling.id,
		icon: 'merge_v0',
		show_in_ui: false
	},
	position: { x: 0, y: 0 },
	type: 'merge_v0'
};

export let merge_node = new MergeNode(merge_node_data);

nodes.register(MergeNode, merge_node_data);
