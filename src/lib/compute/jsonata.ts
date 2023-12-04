import categories from '$lib/node_categories';
import jsonata_lib from 'jsonata';

export const jsonata = async (
	node: JsonataNode,
	inputData: object,
	context: string,
	info: (arg: string) => void,
	error: (arg: string) => void,
	success: (arg: string) => void,
	slug: string
) => {
	node.data.dirty = false;
	const input = inputData[Object.keys(inputData)[0]];

	if (node.data.text) {
		try {
			const jsonataExpr = jsonata_lib(node.data.text);
			const result = await jsonataExpr.evaluate(input);
			return result;
		} catch (e) {
			console.error('Error evaluating JSONata expression:', e);
			return undefined;
		}
	}
};

interface JsonataData extends BaseData {
	text: string;
	output: object;
}

type JsonataNode = DGNodeInterface & {
	data: JsonataData;
};

export const jsonata_node: JsonataNode = {
	id: 'jsonata',
	data: {
		label: 'JSONata',
		text: '',
		dirty: false,
		output: {},
		compute_type: 'jsonata_v0',
		input_ids: {},
		category: categories.wrangling.id,
		icon: 'jsonata_v0'
	},
	position: { x: 0, y: 0 },
	type: 'text_input_v0'
};
