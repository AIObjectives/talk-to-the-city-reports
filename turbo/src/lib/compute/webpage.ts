import nodes from '$lib/node_register';
import categories from '$lib/node_categories';

export default class WebpageNode {
	id: string;
	data: WebpageData;
	position: { x: number; y: number };
	type: string;

	constructor(node_data: WebpageNodeInterface) {
		const { id, data, position, type } = node_data;
		this.id = id;
		this.data = data;
		this.position = position;
		this.type = type;
	}
	async compute(
		inputData: { text?: string },
		context: string,
		info: (arg: string) => void,
		error: (arg: string) => void,
		success: (arg: string) => void,
		slug: string,
		Cookies: any
	) {
		const url = this.data.text;
		this.data.dirty = false;

		if (!url) {
			error('URL not provided.');
			return;
		}

		try {
			const response = await fetch(`/api/readability?url=${encodeURIComponent(url)}`);
			if (response.ok) {
				const text = await response.text();
				const content = text;
				if (content) {
					this.data.output = content;
					return content;
				} else {
					error('Content not found in the response.');
				}
			} else {
				// The API call was unsuccessful
				error(`API call failed with status: ${response.status}`);
			}
		} catch (e) {
			// Catch and handle errors that may occur during the API call
			error(`An error occurred during API call: ${e.message}`);
		}
	}
}

interface WebpageData extends BaseData {
	output: object;
}

type WebpageNodeInterface = DGNodeInterface & {
	data: WebpageData;
};

export let webpage_node_data: WebpageNodeInterface = {
	id: 'webpage',
	data: {
		label: 'webpage',
		dirty: false,
		output: {},
		compute_type: 'webpage_v0',
		input_ids: {},
		category: categories.input.id,
		icon: 'webpage_v0',
		show_in_ui: false
	},
	position: { x: 0, y: 0 },
	type: 'text_input_v0'
};

export let webpage_node = new WebpageNode(webpage_node_data);

nodes.register(WebpageNode, webpage_node_data);
