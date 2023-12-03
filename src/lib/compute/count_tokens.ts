import { getEncoding } from 'js-tiktoken';

export const count_tokens = async (
	node: CountTokensNode,
	inputData: any,
	context: string,
	info: (arg: string) => void,
	error: (arg: string) => void,
	success: (arg: string) => void,
	slug: string
) => {
	const inputArray = inputData[Object.keys(inputData)[0]];
	const inputMatches = inputArray.length && node.data.csv_length === inputArray.length;
	if (!node.data.dirty && inputMatches) return node.data.num_tokens;
	const joinedInput = inputArray.map((entry: any) => entry['comment-body']).join(' ');
	try {
		node.data.csv_length = inputArray.length;
		const encoding = getEncoding(node.data.text);
		node.data.num_tokens = encoding.encode(joinedInput).length;
		node.data.dirty = false;
		node.data.message = `Number of tokens: ${node.data.num_tokens}`;
		return node.data.num_tokens;
	} catch (e) {
		error(`Error: ${e}`);
	}
};

interface CountTokensData extends BaseData {
	num_tokens: number;
}

type CountTokensNode = DGNodeInterface & {
	data: CountTokensData;
};

export let count_tokens_node: CountTokensNode = {
	id: 'count_tokens',
	data: {
		label: 'Count Tokens',
		dirty: false,
		text: 'cl100k_base',
		num_tokens: 0,
		message: '',
		csv_length: 0,
		compute_type: 'count_tokens_v0',
		input_ids: { csv: '' },
		compute: count_tokens
	},
	position: { x: 100, y: -50 },
	type: 'text_input_v0'
};
