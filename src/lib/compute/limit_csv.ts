import categories from '$lib/node_categories';
import _ from 'lodash';

export const limit_csv = async (
	node: LimitCSVNode,
	inputData: object,
	context: string,
	info: (arg: string) => void,
	error: (arg: string) => void,
	success: (arg: string) => void,
	slug: string
) => {
	const input: [object] = inputData[Object.keys(inputData)[0]];
	node.data.dirty = false;
	if (input && _.isPlainObject(input)) {
		return _.pick(input, _.keys(input).slice(0, node.data.number));
	} else if (input && _.isArray(input)) {
		return input.slice(0, node.data.number);
	} else {
		return [];
	}
};

interface LimitCSVData extends BaseData {
	number: number;
}

type LimitCSVNode = DGNodeInterface & {
	data: LimitCSVData;
};

export let limit_csv_node: LimitCSVNode = {
	id: 'limit_csv',
	data: {
		label: 'Max CSV',
		dirty: false,
		number: 2,
		compute_type: 'limit_csv_v0',
		input_ids: { csv: '' },
		compute: limit_csv,
		category: categories.wrangling.id,
		icon: 'limit_csv_v0'
	},
	position: { x: 0, y: 0 },
	type: 'number_input_v0'
};
