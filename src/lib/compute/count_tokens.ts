import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import { getEncoding } from 'js-tiktoken';
import _ from 'lodash';
import { format, unwrapFunctionStore } from 'svelte-i18n';

const $__ = unwrapFunctionStore(format);

interface CountTokensData extends BaseData {
	num_tokens: number;
	csv_length: number;
	text: string;
	message: string;
}

export default class CountTokensNode {
	id: string;
	data: CountTokensData;
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
		inputData: any,
		context: string,
		info: (arg: string) => void,
		error: (arg: string) => void,
		success: (arg: string) => void,
		slug: string,
		Cookies: any
	) {
		const inputArray = inputData[Object.keys(inputData)[0]];
		if (!inputArray) return;
		const inputMatches = inputArray.length && this.data.csv_length === inputArray.length;
		if (!this.data.dirty && inputMatches) {
			this.data.message = `${$__('number_of_tokens')}: ${this.data.num_tokens}`;
			return this.data.num_tokens;
		}
		const joinedInput = inputArray.map((entry: any) => entry['comment-body']).join(' ');
		try {
			this.data.csv_length = inputArray.length;
			const encoding = getEncoding(this.data.text);
			this.data.num_tokens = encoding.encode(joinedInput).length;
			this.data.dirty = false;
			this.data.message = `${$__('number_of_tokens')}: ${this.data.num_tokens}`;
			return this.data.num_tokens;
		} catch (e) {
			error(`Error: ${e}`);
		}
	}
}

type CountTokensNodeInterface = DGNodeInterface & {
	data: CountTokensData;
};

export let count_tokens_node_data: CountTokensNodeInterface = {
	id: 'count_tokens',
	data: {
		label: 'count_tokens',
		dirty: false,
		text: 'cl100k_base',
		num_tokens: 0,
		message: '',
		csv_length: 0,
		compute_type: 'count_tokens_v0',
		input_ids: { csv: '' },
		category: categories.llm.id,
		icon: 'count_tokens_v0',
		show_in_ui: false
	},
	position: { x: 0, y: 0 },
	type: 'text_input_v0'
};

export let count_tokens_node = new CountTokensNode(count_tokens_node_data);

nodes.register(CountTokensNode, count_tokens_node_data);
