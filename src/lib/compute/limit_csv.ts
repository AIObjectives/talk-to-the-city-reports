import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import _ from 'lodash';

export default class LimitCSVNode {
	id: string;
	data: LimitCSVData;
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
		slug: string,
		Cookies: any
	) {
		const input: [object] = inputData[Object.keys(inputData)[0]];
		this.data.dirty = false;
		if (input && _.isPlainObject(input)) {
			return _.pick(input, _.keys(input).slice(0, this.data.number));
		} else if (input && _.isArray(input)) {
			return input.slice(0, this.data.number);
		} else {
			return [];
		}
	}
}

interface LimitCSVData extends BaseData {
	number: number;
}

type LimitCSVNodeInterface = DGNodeInterface & {
	data: LimitCSVData;
};

export let limit_csv_node_data: LimitCSVNodeInterface = {
	id: 'limit_csv',
	data: {
		label: 'Max CSV',
		dirty: false,
		number: 2,
		compute_type: 'limit_csv_v0',
		input_ids: { csv: '' },
		category: categories.wrangling.id,
		icon: 'limit_csv_v0',
		show_in_ui: true
	},
	position: { x: 0, y: 0 },
	type: 'number_input_v0'
};

export let limit_csv_node = new LimitCSVNode(limit_csv_node_data);

nodes.register(LimitCSVNode, limit_csv_node_data);
