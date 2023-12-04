import categories from '$lib/node_categories';

export const llama = async (
	node: LlamaNode,
	inputData: object,
	context: string,
	info: (arg: string) => void,
	error: (arg: string) => void,
	success: (arg: string) => void,
	slug: string,
	Cookies: any
) => {
	node.data.message = 'fetching...';
	node.data.dirty = false;
	try {
		const response = await fetch('http://localhost:10000/v1/chat/completions');
		if (response.ok) {
			node.data.message = 'online';
			return node.data.text;
		} else {
			error('Request failed');
		}
	} catch (err) {
		node.data.message = 'offline';
	}
};

interface LlamaData extends BaseData {
	text: string;
}

type LlamaNode = DGNodeInterface & {
	data: LlamaData;
};

export const llama_node: LlamaNode = {
	id: 'llama',
	data: {
		label: 'Llama',
		text: 'http://localhost:10000/v1/chat/completions',
		dirty: false,
		compute_type: 'llama_v0',
		input_ids: {},
		category: categories.llama.id,
		icon: 'llama_v0'
	},
	position: { x: 0, y: 0 },
	type: 'text_input_v0'
};
