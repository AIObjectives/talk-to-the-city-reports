function isPlainObject(obj) {
	return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}
export const grid = async (
	node: GridNode,
	inputData: object,
	context: string,
	info: (arg: string) => void,
	error: (arg: string) => void,
	success: (arg: string) => void,
	slug: string
) => {
	node.data.dirty = false;
	const input = inputData[Object.keys(inputData)[0]];
	node.data.output = input;
	node.data = {
		...node.data,
		output: node.data.output
	};
};

interface GridData extends BaseData {
	text: string;
	output: object;
}

type GridNode = DGNodeInterface & {
	data: GridData;
};

export const grid_node: GridNode = {
	id: 'grid',
	data: {
		label: 'Grid Node',
		text: '',
		dirty: false,
		output: [],
		compute_type: 'grid_v0',
		input_ids: {}
	},
	position: { x: 200, y: 700 },
	type: 'grid_v0'
};
