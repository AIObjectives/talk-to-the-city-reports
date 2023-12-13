import nodes from '$lib/node_register';
import categories from '$lib/node_categories';

interface BaseData {}

interface OpenAIKeyData extends BaseData {
	text: string;
}

export default class OpenAIKeyNode {
	id: string;
	data: OpenAIKeyData;
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
		inputData: object,
		context: string,
		info: (arg: string) => void,
		error: (arg: string) => void,
		success: (arg: string) => void,
		slug: string,
		Cookies: any
	) {
		let ui_key = this.data.text;
		let ui_key_is_valid = this.keyIsValid(ui_key);
		if (ui_key && ui_key_is_valid) {
			Cookies.set('open_ai_key', ui_key);
			this.data.text = 'sk-...(key hidden)';
			this.data.dirty = false;
			return ui_key;
		}
		if (ui_key && !ui_key_is_valid) {
			this.data.text = 'Invalid key';
			this.data.dirty = false;
		}
		let local_key = Cookies.get('open_ai_key');
		let local_key_is_valid = this.keyIsValid(local_key);
		if (local_key && local_key_is_valid) {
			this.data.text = 'sk-...(key hidden)';
			this.data.dirty = false;
			return local_key;
		}
		this.data.text = 'Invalid key';
	}

	keyIsValid(key) {
		return key && key.length == 51 && key.slice(0, 3) == 'sk-';
	}
}

type OpenAIKeyNodeInterface = DGNodeInterface & {
	data: OpenAIKeyData;
};

export let open_ai_key_node_data: OpenAIKeyNodeInterface = {
	id: 'open_ai_key',
	data: {
		label: 'open_ai_key',
		text: 'sk-...',
		dirty: false,
		compute_type: 'open_ai_key_v0',
		input_ids: {},
		category: categories.llm.id,
		icon: 'open_ai_key_v0',
		show_in_ui: true
	},
	position: { x: 0, y: 0 },
	type: 'text_input_v0'
};

export let open_ai_key_node = new OpenAIKeyNode(open_ai_key_node_data);

nodes.register(OpenAIKeyNode, open_ai_key_node_data);
