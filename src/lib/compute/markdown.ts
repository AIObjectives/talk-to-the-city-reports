import nodes from '$lib/node_register';
import categories from '$lib/node_categories';

export default class MarkdownNode {
	id: string;
	data: MarkdownData;
	position: { x: number; y: number };
	type: string;

	constructor(node_data: MarkdownNodeInterface) {
		const { id, data, position, type } = node_data;
		this.id = id;
		this.data = data;
		this.position = position;
		this.type = type;
	}

	async compute(
		inputData: object,
		context: string,
		info: (arg: string) => void,
		error: (arg: string) => void,
		success: (arg: string) => void,
		slug: string
	) {
		this.data.dirty = false;
		const input = inputData[Object.keys(inputData)[0]];
		if (input && typeof input === 'string') this.data.markdown = input;
		return input;
	}
}

interface MarkdownData extends BaseData {
	output: object;
	markdown: string;
}

type MarkdownNodeInterface = DGNodeInterface & {
	data: MarkdownData;
};

export let markdown_node_data: MarkdownNodeInterface = {
	id: 'markdown',
	data: {
		label: 'Markdown',
		output: {},
		markdown: '',
		dirty: false,
		compute_type: 'markdown_v0',
		input_ids: { markdown: '' },
		category: categories.display.id,
		icon: 'markdown_v0'
	},
	position: { x: 0, y: 0 },
	type: 'markdown_v0'
};

export let markdown_node = new MarkdownNode(markdown_node_data);

nodes.register(MarkdownNode, markdown_node_data);
