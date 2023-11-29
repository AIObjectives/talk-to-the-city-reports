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

	if (input && input.length) {
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
		label: 'Limit CSV',
		dirty: false,
		number: 2,
		compute_type: 'limit_csv_v0',
		input_ids: { csv: '' },
		compute: limit_csv
	},
	position: { x: 100, y: -50 },
	type: 'number_input_v0'
};
