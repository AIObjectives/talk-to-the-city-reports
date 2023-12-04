import categories from '$lib/node_categories';

export const markdown = async (
	node: MarkdownNode,
	inputData: object,
	context: string,
	info: (arg: string) => void,
	error: (arg: string) => void,
	success: (arg: string) => void,
	slug: string
) => {
	node.data.dirty = false;
	const input = inputData[Object.keys(inputData)[0]];
	if (input && typeof input === 'string') node.data.markdown = input;
	return input;
};

interface MarkdownData extends BaseData {
	output: object;
	markdown: string;
}

type MarkdownNode = DGNodeInterface & {
	data: MarkdownData;
};

export const markdown_node: MarkdownNode = {
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
