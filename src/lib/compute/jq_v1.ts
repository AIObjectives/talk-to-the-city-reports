import categories from '$lib/node_categories';
import * as jq_web from 'jq-web/jq.asm.bundle.js';

export const jq_v1 = async (
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
		if (node.data.text) {
			return jq_web.json(input, node.data.text);
		}
	} catch (e) {
		return undefined;
	}
};

interface JqData extends BaseData {
	filter: string;
	output: object;
}

type JqNode = DGNodeInterface & {
	data: JqData;
};

export const jq_v1_node: JqNode = {
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
