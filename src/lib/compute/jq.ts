import jq_lib from '$lib/jq.js';

export const jq = async (
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

	if (node.data.text) {
		try {
			const jqFilter = jq_lib.compile(node.data.text);
			const result = [];
			for (let v of jqFilter(input)) {
				result.push(v);
			}
			if (result.length === 1) {
				return result[0];
			}
			return result;
		} catch (e) {
			console.error('Error evaluating JQ expression:', e);
			return undefined;
		}
	}
};

interface JqData extends BaseData {
	filter: string;
	output: object;
}

type JqNode = DGNodeInterface & {
	data: JqData;
};

export const jq_node: JqNode = {
	id: 'jq',
	data: {
		label: 'JQ',
		text: '',
		dirty: false,
		output: {},
		compute_type: 'jq_v0',
		input_ids: {}
	},
	position: { x: 200, y: 700 },
	type: 'text_input_v0'
};
