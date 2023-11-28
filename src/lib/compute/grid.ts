export const grid = async (node: ParticipantFilterNode, inputData: object, context) => {
	node.data.dirty = false;
	const input = inputData[Object.keys(inputData)[0]];
	console.log('Computing grid');
	node.data.output = input;
	node.data = {
		...node.data,
		output: input
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
