import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import * as jq_web from 'jq-web/jq.asm.bundle.js';

interface BaseData {}

interface JqData extends BaseData {
	text: string;
	output: object;
}

export default class JqNodeV1 {
	id: string;
	data: JqData;
	position: { x: number; y: number };
	type: string;

	constructor(node_data) {
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
		slug: string
	) {
		this.data.dirty = false;
		const input = inputData[Object.keys(inputData)[0]];
		try {
			if (this.data.text) {
				return jq_web.json(input, this.data.text);
			}
		} catch (e) {
			return undefined;
		}
	}
}

type JqNodeInterface = DGNodeInterface & {
	data: JqData;
};

export let jq_node_data: JqNodeInterface = {
	id: 'jq_v1',
	data: {
		label: 'JQ',
		text: '',
		dirty: false,
		output: {},
		compute_type: 'jq_v1',
		input_ids: {},
		category: categories.wrangling.id,
		icon: 'jq_v0'
	},
	position: { x: 0, y: 0 },
	type: 'text_input_v0'
};

export let jq_v1_node = new JqNodeV1(jq_node_data);

nodes.register(JqNodeV1, jq_node_data);
