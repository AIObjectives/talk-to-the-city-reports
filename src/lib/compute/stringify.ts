import categories from '$lib/node_categories';
export const stringify = async (
	node: JqNode,
	inputData: object,
	context: string,
	info: (arg: string) => void,
	error: (arg: string) => void,
	success: (arg: string) => void,
	slug: string
) => {
	node.data.dirty = false;
	const input = inputData[Object.keys(inputData)[0]];

	try {
		return JSON.stringify(input, null, 2);
	} catch {
		return input;
	}
};

interface StringifyData extends BaseData {
	output: object;
}

type StringifyNode = DGNodeInterface & {
	data: StringifyData;
};

export const stringify_node: StringifyNode = {
	id: 'stringify',
	data: {
		label: 'Stringify',
		dirty: false,
		output: {},
		compute_type: 'stringify_v0',
		input_ids: {},
		category: categories.wrangling.id,
		icon: 'stringify_v0'
	},
	position: { x: 200, y: 700 },
	type: 'default'
};
